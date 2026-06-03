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


# ── Health check ─────────────────────────────────────────────────────────────

@app.get("/")
def health():
    return {"status": "ok", "message": "Adidas Sales API is running"}


# ── KPI summary ──────────────────────────────────────────────────────────────

@app.get("/kpis")
def get_kpis():
    """Total revenue, profit, units sold, and average margin."""
    query = text("""
        SELECT
            SUM(s.total_sales)      AS total_revenue,
            SUM(s.operating_profit) AS total_profit,
            SUM(s.units_sold)       AS total_units,
            AVG(s.operating_margin) AS avg_margin
        FROM sales s
    """)
    with get_engine().connect() as conn:
        row = conn.execute(query).mappings().fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="No data found")
        return dict(row)


# ── Sales by region ───────────────────────────────────────────────────────────

@app.get("/sales/by-region")
def sales_by_region():
    """Uses v_sales_by_region view — joins sales + locations."""
    with get_engine().connect() as conn:
        rows = conn.execute(text("SELECT * FROM v_sales_by_region")).mappings().fetchall()
        return [dict(r) for r in rows]


# ── Sales by product ──────────────────────────────────────────────────────────

@app.get("/sales/by-product")
def sales_by_product():
    """Uses v_sales_by_product view — joins sales + products."""
    with get_engine().connect() as conn:
        rows = conn.execute(text("SELECT * FROM v_sales_by_product")).mappings().fetchall()
        return [dict(r) for r in rows]


# ── Sales by retailer ─────────────────────────────────────────────────────────

@app.get("/sales/by-retailer")
def sales_by_retailer():
    """Uses v_sales_by_retailer view — joins sales + retailers."""
    with get_engine().connect() as conn:
        rows = conn.execute(text("SELECT * FROM v_sales_by_retailer")).mappings().fetchall()
        return [dict(r) for r in rows]


# ── Monthly trend ─────────────────────────────────────────────────────────────

@app.get("/sales/monthly-trend")
def monthly_trend():
    """Uses v_monthly_trend view."""
    with get_engine().connect() as conn:
        rows = conn.execute(text("SELECT * FROM v_monthly_trend")).mappings().fetchall()
        return [dict(r) for r in rows]


# ── Sales by method (In-store / Online / Outlet) ──────────────────────────────

@app.get("/sales/by-method")
def sales_by_method():
    """Uses v_sales_by_method view."""
    with get_engine().connect() as conn:
        rows = conn.execute(text("SELECT * FROM v_sales_by_method")).mappings().fetchall()
        return [dict(r) for r in rows]


# ── Top cities ────────────────────────────────────────────────────────────────

@app.get("/sales/top-cities")
def top_cities(limit: int = 10):
    """Uses v_top_cities view — joins sales + locations."""
    query = text("SELECT * FROM v_top_cities LIMIT :limit")
    with get_engine().connect() as conn:
        rows = conn.execute(query, {"limit": limit}).mappings().fetchall()
        return [dict(r) for r in rows]