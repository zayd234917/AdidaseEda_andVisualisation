def transform(df):
    df["Invoice Date"] = pd.to_datetime(df["Invoice Date"])
    df["Year"] = df["Invoice Date"].dt.year
    df["Month"] = df["Invoice Date"].dt.month
    df["Operating Margin"] = df["Operating Profit"] / df["Total Sales"]
    df.columns = [c.strip().lower().replace(" ", "_") for c in df.columns]
    df = df.dropna()
    return df