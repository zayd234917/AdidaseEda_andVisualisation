import os
import pandas as pd
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

load_dotenv()


COLUMN_MAP = {
    "retailer":         "retailer",
    "invoice_date":     "invoice_date",
    "region":           "region",
    "state":            "state",
    "city":             "city",
    "product":          "product",
    "price_per_unit":   "price_per_unit",
    "units_sold":       "units_sold",
    "total_sales":      "total_sales",
    "operating_profit": "operating_profit",
    "operating_margin": "operating_margin",
    "sales_method":     "sales_method",
}


def get_engine():
    db_url = os.getenv("DATABASE_URL")
    if not db_url:
        raise RuntimeError("DATABASE_URL not set in .env")
    return create_engine(db_url)


def _check_columns(df: pd.DataFrame):
    """Warn about any expected columns that are missing."""
    missing = [col for col in COLUMN_MAP if col not in df.columns]
    if missing:
        print("\n Missing columns detected!")
        print(f"   Expected : {list(COLUMN_MAP.keys())}")
        print(f"   Got      : {df.columns.tolist()}")
        print(f"   Missing  : {missing}")
        print("   → Edit COLUMN_MAP at the top of load.py to match your column names.\n")
        raise KeyError(f"Missing columns: {missing}")


def _load_retailers(df: pd.DataFrame, conn) -> dict:
    """Insert unique retailers, return {name: id} mapping."""
    names = df["retailer"].dropna().unique().tolist()
    conn.execute(
        text("INSERT INTO retailers (retailer_name) VALUES (:name) ON CONFLICT (retailer_name) DO NOTHING"),
        [{"name": n} for n in names],
    )
    rows = conn.execute(text("SELECT retailer_id, retailer_name FROM retailers")).fetchall()
    return {row[1]: row[0] for row in rows}


def _load_locations(df: pd.DataFrame, conn) -> dict:
    """Insert unique (city, state) pairs, return {(city, state): id} mapping."""
    locs = df[["city", "state", "region"]].drop_duplicates()
    conn.execute(
        text("""
            INSERT INTO locations (city, state, region)
            VALUES (:city, :state, :region)
            ON CONFLICT (city, state) DO NOTHING
        """),
        locs.to_dict(orient="records"),
    )
    rows = conn.execute(text("SELECT location_id, city, state FROM locations")).fetchall()
    return {(row[1], row[2]): row[0] for row in rows}


def _load_products(df: pd.DataFrame, conn) -> dict:
    """Insert unique products, return {name: id} mapping."""
    names = df["product"].dropna().unique().tolist()
    conn.execute(
        text("INSERT INTO products (product_name) VALUES (:name) ON CONFLICT (product_name) DO NOTHING"),
        [{"name": n} for n in names],
    )
    rows = conn.execute(text("SELECT product_id, product_name FROM products")).fetchall()
    return {row[1]: row[0] for row in rows}


def _load_sales(df: pd.DataFrame, conn, retailer_map, location_map, product_map):
    """Build and insert the fact table rows."""
    records = []
    for _, row in df.iterrows():
        records.append({
            "retailer_id":      retailer_map[row["retailer"]],
            "location_id":      location_map[(row["city"], row["state"])],
            "product_id":       product_map[row["product"]],
            "invoice_date":     row["invoice_date"].date() if pd.notna(row["invoice_date"]) else None,
            "sales_method":     row.get("sales_method"),
            "price_per_unit":   float(row["price_per_unit"]),
            "units_sold":       int(row["units_sold"]),
            "total_sales":      float(row["total_sales"]),
            "operating_profit": float(row["operating_profit"]) if pd.notna(row.get("operating_profit")) else None,
            "operating_margin": float(row["operating_margin"]) if pd.notna(row.get("operating_margin")) else None,
        })

    conn.execute(
        text("""
            INSERT INTO sales (
                retailer_id, location_id, product_id,
                invoice_date, sales_method,
                price_per_unit, units_sold, total_sales,
                operating_profit, operating_margin
            ) VALUES (
                :retailer_id, :location_id, :product_id,
                :invoice_date, :sales_method,
                :price_per_unit, :units_sold, :total_sales,
                :operating_profit, :operating_margin
            )
        """),
        records,
    )
    return len(records)


def load(df: pd.DataFrame) -> int:
    df = df.rename(columns=COLUMN_MAP)

    _check_columns(df)

    engine = get_engine()
    with engine.begin() as conn:  
        print("  Loading retailers...")
        retailer_map = _load_retailers(df, conn)

        print("  Loading locations...")
        location_map = _load_locations(df, conn)

        print("  Loading products...")
        product_map = _load_products(df, conn)

        print("  Loading sales fact table...")
        n = _load_sales(df, conn, retailer_map, location_map, product_map)

    print(f"  ✓ {n} sales rows inserted.")
    return n