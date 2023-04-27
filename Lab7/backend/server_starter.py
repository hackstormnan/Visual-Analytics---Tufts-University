from flask import Flask
import flask
import json
from flask_cors import CORS

from sklearn.neighbors import KNeighborsClassifier

from project_somerville import *

app = Flask(__name__)
CORS(app)

def getConfusionMatrix(prediction_data):
    confusion_matrix_dict = {}
    ground_truth = prediction_data['ground_truth']
    
    for keys in prediction_data:
        truePositive = 0
        trueNegative = 0
        falsePositive = 0
        falseNegative = 0

        for i in prediction_data[keys]:
            if(ground_truth[i] == 1):
                if(ground_truth[i] == prediction_data[keys][i]):
                    truePositive += 1
                else: falseNegative += 1
            elif(ground_truth[i] == 0):
                if(ground_truth[i] == prediction_data[keys][i]):
                    trueNegative += 1
                else: falsePositive += 1
            

        confusion_matrix_dict.update({keys : {"truePositive": truePositive, 
                                            "trueNegative": trueNegative, 
                                            "falsePositive": falsePositive, 
                                            "falseNegative": falseNegative} })

    return confusion_matrix_dict

@app.route("/")
def hello():
    return "Whoops, Wrong Page!"

@app.route('/confusionMatrix', methods=["GET"])
def confusionMatrix():
    print("users endpoint reached...")
    with open("model_predictions.json", "r") as f:
        prediction_data = json.load(f)
    
    with open("somerville_happiness_2018_data.json", "r") as f:
        happiness_data = json.load(f)

    confusion_matrix = getConfusionMatrix(prediction_data)

    # TODO: call the right function to calculate projects result
    projection_result = project_somerville()

    data = [prediction_data, happiness_data, confusion_matrix, projection_result]

    return flask.jsonify(data)

if __name__ == "__main__":
    app.debug = True
    app.run("localhost", 6969)