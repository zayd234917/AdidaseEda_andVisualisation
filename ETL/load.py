import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
load_dotenv()
def load(df):
    db_url = os.getenv("DATABASEURL")
    engine = create_engine(db_url)
    df.to_sql("sales", engine, if_exists="replace", index=False)
    print("Data loaded To Postgresql")