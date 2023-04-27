import sys
import time
import sqlite3
import pandas as pd
import os
import json
import flask
from flask import Flask, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/sqlquery', methods=["GET", "POST"])
def sqlquery():
    if request.method == "POST":
        received_data = request.get_json()
        print(received_data)

        # connect to database
        os.remove("forestfires.db")
        conn = sqlite3.connect("forestfires.db")
        conn.row_factory = sqlite3.Row

        # create table
        sql_create_table = """CREATE TABLE IF NOT EXISTS forestfire (
                        id INT primary key,
                        X REAL,
                        Y REAL,
                        month TEXT,
                        day TEXT,
                        FFMC REAL,
                        DMC REAL,
                        DC REAL,
                        ISI REAL,
                        temp REAL,
                        humidity REAL,
                        wind REAL,
                        rain REAl,
                        area REAL
                    );"""

        if conn is not None:
            c = conn.cursor()
            c.execute(sql_create_table)
            df = pd.read_csv("forestfires.csv")
            df.to_sql('forestfire', conn, if_exists='append', index=False)

        # excute query string
        c.execute(received_data)
        rows = c.fetchall()

        data = []
        for row in rows:
            data.append(dict(row))

        # end connection to database
        conn.close()
        
        return flask.Response(response = json.dumps(data) , status=201)

if __name__ == "__main__":
    app.debug = True
    app.run("localhost", 6969)
    
