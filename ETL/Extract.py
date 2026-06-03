import pandas as pd

def extract(path="Data/dataset.xlsx"):
    df = pd.read_excel(path)
    print(f"Loaded {len(df)} rows, {df.shape[1]} columns")
    print(df.dtypes)
    return df