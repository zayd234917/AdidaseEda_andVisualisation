import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Adidas Sales API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Restrict to your frontend URL in production
    allow_methods=["GET"],
    allow_headers=["*"],
)

def get_engine():
    db_url = os.getenv("DATABASE_URL")
    if not db_url:
        raise RuntimeError("DATABASE_URL not set in .env")
    return create_engine(db_url)


# ── Health check ────────────────────────────────────────────────────────────

@app.get("/")
def health():
    return {"status": "ok", "message": "Adidas Sales API is running"}


# ── KPI summary ─────────────────────────────────────────────────────────────

@app.get("/kpis")
def get_kpis():
    """Total revenue, profit, units sold, and average margin."""
    query = text("""
        SELECT
            SUM(total_sales)       AS total_revenue,
            SUM(operating_profit)  AS total_profit,
            SUM(units_sold)        AS total_units,
            AVG(operating_margin)  AS avg_margin
        FROM sales
    """)
    with get_engine().connect() as conn:
        row = conn.execute(query).mappings().fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="No data found")
        return dict(row)


# ── Sales by region ──────────────────────────────────────────────────────────

@app.get("/sales/by-region")
def sales_by_region():
    query = text("""
        SELECT
            region,
            SUM(total_sales)      AS revenue,
            SUM(operating_profit) AS profit
        FROM sales
        GROUP BY region
        ORDER BY revenue DESC
    """)
    with get_engine().connect() as conn:
        rows = conn.execute(query).mappings().fetchall()
        return [dict(r) for r in rows]


# ── Sales by product ─────────────────────────────────────────────────────────

@app.get("/sales/by-product")
def sales_by_product():
    query = text("""
        SELECT
            product,
            SUM(total_sales)      AS revenue,
            SUM(units_sold)       AS units,
            SUM(operating_profit) AS profit
        FROM sales
        GROUP BY product
        ORDER BY revenue DESC
    """)
    with get_engine().connect() as conn:
        rows = conn.execute(query).mappings().fetchall()
        return [dict(r) for r in rows]


# ── Sales by retailer ────────────────────────────────────────────────────────

@app.get("/sales/by-retailer")
def sales_by_retailer():
    query = text("""
        SELECT
            retailer,
            SUM(total_sales)      AS revenue,
            SUM(operating_profit) AS profit,
            SUM(units_sold)       AS units
        FROM sales
        GROUP BY retailer
        ORDER BY revenue DESC
    """)
    with get_engine().connect() as conn:
        rows = conn.execute(query).mappings().fetchall()
        return [dict(r) for r in rows]


# ── Monthly trend ────────────────────────────────────────────────────────────

@app.get("/sales/monthly-trend")
def monthly_trend():
    query = text("""
        SELECT
            year,
            month,
            SUM(total_sales)      AS revenue,
            SUM(operating_profit) AS profit
        FROM sales
        GROUP BY year, month
        ORDER BY year, month
    """)
    with get_engine().connect() as conn:
        rows = conn.execute(query).mappings().fetchall()
        return [dict(r) for r in rows]


# ── Sales by method (In-store / Online / Outlet) ─────────────────────────────

@app.get("/sales/by-method")
def sales_by_method():
    query = text("""
        SELECT
            sales_method,
            SUM(total_sales)      AS revenue,
            SUM(units_sold)       AS units
        FROM sales
        GROUP BY sales_method
        ORDER BY revenue DESC
    """)
    with get_engine().connect() as conn:
        rows = conn.execute(query).mappings().fetchall()
        return [dict(r) for r in rows]


# ── Top cities ───────────────────────────────────────────────────────────────

@app.get("/sales/top-cities")
def top_cities(limit: int = 10):
    query = text("""
        SELECT
            city,
            state,
            SUM(total_sales) AS revenue
        FROM sales
        GROUP BY city, state
        ORDER BY revenue DESC
        LIMIT :limit
    """)
    with get_engine().connect() as conn:
        rows = conn.execute(query, {"limit": limit}).mappings().fetchall()
        return [dict(r) for r in rows]