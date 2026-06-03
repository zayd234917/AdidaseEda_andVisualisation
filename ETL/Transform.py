import pandas as pd

def transform(df):
    # Normalize column names
    df.columns = [str(c).strip().lower().replace(" ", "_") for c in df.columns]
    print("=== Normalized columns ===")
    print(df.columns.tolist())

    df["invoice_date"] = pd.to_datetime(df["invoice_date"])
    df["year"]  = df["invoice_date"].dt.year
    df["month"] = df["invoice_date"].dt.month
    df = df.dropna()
    return df