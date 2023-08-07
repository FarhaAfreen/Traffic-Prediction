from flask import Flask, render_template, jsonify, request
from pathFinder import process_data

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('main.html')

@app.route('/map')
def map():
    return render_template('map.html')

@app.route('/process_pathCoordinates', methods=['POST'])
def process_pathCoordinates():
    data = request.get_json()
    print('going to procoess data_____________')
    return process_data(data)

if __name__ == '__main__':
    app.run(debug=True) 