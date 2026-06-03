-- =============================================================
--  Adidas Sales Database Schema
--  Run once: psql -d adidas_db -f schema.sql
-- =============================================================


-- -------------------------------------------------------------
--  1. RETAILERS
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS retailers (
    retailer_id     SERIAL PRIMARY KEY,
    retailer_name   VARCHAR(100) NOT NULL UNIQUE
);


-- -------------------------------------------------------------
--  2. LOCATIONS
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS locations (
    location_id     SERIAL PRIMARY KEY,
    city            VARCHAR(100) NOT NULL,
    state           VARCHAR(100) NOT NULL,
    region          VARCHAR(50)  NOT NULL,
    UNIQUE (city, state)
);


-- -------------------------------------------------------------
--  3. PRODUCTS
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS products (
    product_id      SERIAL PRIMARY KEY,
    product_name    VARCHAR(150) NOT NULL UNIQUE
);


-- -------------------------------------------------------------
--  4. SALES  (fact table)
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS sales (
    sale_id             SERIAL PRIMARY KEY,
    retailer_id         INT            NOT NULL REFERENCES retailers(retailer_id),
    location_id         INT            NOT NULL REFERENCES locations(location_id),
    product_id          INT            NOT NULL REFERENCES products(product_id),
    invoice_date        DATE           NOT NULL,
    sales_method        VARCHAR(50),             -- In-store / Online / Outlet
    price_per_unit      NUMERIC(10,2)  NOT NULL,
    units_sold          INT            NOT NULL,
    total_sales         NUMERIC(12,2)  NOT NULL,
    operating_profit    NUMERIC(12,2),
    operating_margin    NUMERIC(6,4)             -- e.g. 0.4200 = 42%
);


-- =============================================================
--  INDEXES  (speed up your dashboard queries)
-- =============================================================
CREATE INDEX IF NOT EXISTS idx_sales_date     ON sales(invoice_date);
CREATE INDEX IF NOT EXISTS idx_sales_retailer ON sales(retailer_id);
CREATE INDEX IF NOT EXISTS idx_sales_location ON sales(location_id);
CREATE INDEX IF NOT EXISTS idx_sales_product  ON sales(product_id);
CREATE INDEX IF NOT EXISTS idx_sales_method   ON sales(sales_method);


-- =============================================================
--  USEFUL VIEWS  (ready-made queries for your API)
-- =============================================================

-- Revenue & profit by region
CREATE OR REPLACE VIEW v_sales_by_region AS
SELECT
    l.region,
    SUM(s.total_sales)      AS revenue,
    SUM(s.operating_profit) AS profit,
    SUM(s.units_sold)       AS units
FROM sales s
JOIN locations l ON s.location_id = l.location_id
GROUP BY l.region
ORDER BY revenue DESC;


-- Revenue & profit by product
CREATE OR REPLACE VIEW v_sales_by_product AS
SELECT
    p.product_name,
    SUM(s.total_sales)      AS revenue,
    SUM(s.operating_profit) AS profit,
    SUM(s.units_sold)       AS units
FROM sales s
JOIN products p ON s.product_id = p.product_id
GROUP BY p.product_name
ORDER BY revenue DESC;


-- Revenue & profit by retailer
CREATE OR REPLACE VIEW v_sales_by_retailer AS
SELECT
    r.retailer_name,
    SUM(s.total_sales)      AS revenue,
    SUM(s.operating_profit) AS profit,
    SUM(s.units_sold)       AS units
FROM sales s
JOIN retailers r ON s.retailer_id = r.retailer_id
GROUP BY r.retailer_name
ORDER BY revenue DESC;


-- Monthly trend
CREATE OR REPLACE VIEW v_monthly_trend AS
SELECT
    EXTRACT(YEAR  FROM invoice_date)::INT AS year,
    EXTRACT(MONTH FROM invoice_date)::INT AS month,
    SUM(total_sales)      AS revenue,
    SUM(operating_profit) AS profit,
    SUM(units_sold)       AS units
FROM sales
GROUP BY year, month
ORDER BY year, month;


-- Sales by method
CREATE OR REPLACE VIEW v_sales_by_method AS
SELECT
    sales_method,
    SUM(total_sales)  AS revenue,
    SUM(units_sold)   AS units,
    COUNT(*)          AS transactions
FROM sales
GROUP BY sales_method
ORDER BY revenue DESC;


-- Top cities
CREATE OR REPLACE VIEW v_top_cities AS
SELECT
    l.city,
    l.state,
    l.region,
    SUM(s.total_sales)      AS revenue,
    SUM(s.operating_profit) AS profit
FROM sales s
JOIN locations l ON s.location_id = l.location_id
GROUP BY l.city, l.state, l.region
ORDER BY revenue DESC;