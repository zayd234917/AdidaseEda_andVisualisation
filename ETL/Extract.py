# ETL/Extract.py
import pandas as pd


def extract(path="Data/dataset.xlsx"):
    # Peek at the raw file to find where headers actually are
    df = pd.read_excel("Data/dataset.xlsx")
    df = df.drop('Unnamed: 0', axis=1)
    df.columns = df.iloc[3]
    df=df.drop(labels=[0,1,2,3],axis=0).reset_index(drop=True)
    print(df.head())
    print(df.columns.to_list())
    print("\n=== Column names after header=1 ===")
    print(df.columns.tolist())
    return df