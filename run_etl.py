from ETL.Extract import extract
from ETL.Transform import transform
from ETL.load import load

if __name__ == "__main__":
    print("Starting ETL pipeline...")
    df = extract("Data/dataset.xlsx")
    df = transform(df)
    df = load(df)
    print("ETL complete. Database is ready.")