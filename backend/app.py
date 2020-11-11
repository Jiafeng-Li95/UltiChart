from flask import Flask, request, jsonify, sessions
from flask_jwt_extended import JWTManager, jwt_required, create_access_token
import pymongo
from pymongo import MongoClient
import json
from bson import json_util
# Mac: export FLASK_APP=app.py flask run
# To keep it in dev mode continuously: export FLASK_APP=app.py FLASK_ENV=development
# All our data is loaded on the server side vs. rendering on frontend side so more secure

# Change connection string depending on your python version. 
cluster_320 =  MongoClient("mongodb://cc320:cc320@320-shard-00-00.8rfoj.mongodb.net:27017,320-shard-00-01.8rfoj.mongodb.net:27017,320-shard-00-02.8rfoj.mongodb.net:27017/320?ssl=true&replicaSet=atlas-mkdts8-shard-0&authSource=admin&retryWrites=true&w=majority")
db = cluster_320["Employees"]
collection = db["Tiger_Microsystems-employees"]

app = Flask(__name__)

# Should load all the data into Postman.
@app.route("/employees", methods=["GET"])
def get_all_employees():
    all_employees = list(collection.find({}))
    return json.dumps(all_employees, default=json_util.default)

@app.route("/details/<email>", methods=["GET"])
def get_employees(email):
    """Find employee object with given email and retrieve empID. Get all employees where managerId == empId.
    Returns empId and direct reports of employee we are looking at.
    Args: email of employee
    Note: Direct reports are defined as an employee who has the current empId as managerId.
    """

    direct_reports = []
    current_emp = collection.find_one({"email": email})
    all_employees = collection.find({"managerId": current_emp["employeeId"]})

    for employee in all_employees:
        direct_reports.append({"firstName": employee["firstName"], "lastName": employee["lastName"], "employeeID": employee["employeeId"], "positionTitle": employee["positionTitle"], "email": employee["email"], "managerID": employee["managerId"]})

    current_employee = []
    current_employee.append({"firstName": current_emp["firstName"], "lastName": current_emp["lastName"], "employeeId": current_emp["employeeId"], "positionTitle": employee["positionTitle"], "email": employee["email"]})
    
    return jsonify({"currentEmployee": current_employee, "directReports": direct_reports})

""" Alternate input data using JSON for details
@app.route("/details", methods=["GET"])
def get_employees():
    Find employee object with given email and retrieve empID. Get all employees where managerId == empId.
    Returns empId and direct reports of employee we are looking at.
    Note: Direct reports are defined as an employee who has the current empId as managerId.

    if request.is_json:
        direct_reports = []
        email_address = request.get_json()
        current_emp = collection.find_one({"email": email_address["email"]})
        all_employees = collection.find({"managerId": current_emp["employeeId"]})

        for employee in all_employees:
            direct_reports.append({"firstName": employee["firstName"], "lastName": employee["lastName"], "employeeID": employee["employeeId"], "managerID": employee["managerId"]})
        return jsonify({"employeeId": current_emp["employeeId"], "directReports": direct_reports}), 200
    # The user did not enter json format.
    else:
        # The frontend will be notified of the error.
        flash('data is not in json format')
        # Return error 400.
        return render_template('error.html'), 400
"""

"""@app.route("/search", methods=["GET"])
def complete_search():
    all_employees = list(collection.find({}))
    if request.is_json:
        # result = []
        
        field_value = request.get_json() # Decodes from JSON to Python dict
        field_value_as_list = list(field_value.items()) # Converts dict to list
        
        Testing
        search_text = field_value_as_list[0][1]
        fake_return = {search_text: field_value_as_list}
        return fake_return, 200
        
        
        field_name = field_value_as_list[0][0] # Gets field name you want to search by
        search_text = field_value_as_list[0][1] # Gets value of field name
        # drop index if it exists 
        collection.drop_index(field_name)
        collection.create_index([('field_name', 'text')])

        # matched_emps = collection.find({"$text": {"$search": search_text}})
        matched_emp = collection.find_one({"$text": {"$search": search_text}}) # Finds first occurrence of matched text (value)

        for employee in matched_emps:
            result.append({"firstName": employee["firstName"], "lastName": employee["lastName"], "employeeID": employee["employeeId"], "managerID": employee["managerId"]})

        return jsonify({"employeeId": matched_emp["employeeId"], "firstName": matched_emp["firstName"], "lastName": matched_emp["lastName"], "email": matched_emp["email"]}), 200
        # return jsonify({"matched_employees": result}), 200
    # The user did not enter json format.
    else:
        # The frontend will be notified of the error.
        flash('data is not in json format')
        # Return error 400.
        return render_template('error.html'), 400"""


@app.route("/search/<search_text>", methods=["GET"])
def complete_search(search_text):
    result = []
    matched_emps = collection.find({"$text": {"$search": search_text}}) # Finds first occurrence of matched text (value)
    for employee in matched_emps:
        result.append({"firstName": employee["firstName"], "lastName": employee["lastName"], "employeeID": employee["employeeId"], "managerID": employee["managerId"]})

    return jsonify({"matched_employees": result}), 200





# Get the data from the Mongo Server.

# Input data in json format...

# firstName       String
# lastName        String
# companyId       Integer
# password        String      // Don't need yet. Or do we...
# positionTitle   String
# companyName     String
# isManager       Boolean     // False if checked "employee" on form, else true.
# employeeId      Integer
# managerId       Integer
# email           String
# startDate       String

# Add json data via Postman to server. 
@app.route("/hire", methods=["POST"])
def get_json_employees():
    all_employees = list(collection.find({}))
    if request.is_json:
        # Get the data that is being added.
        employees = request.get_json()
        # Append the json data to the database.
        all_employees.append(employees)
        # Inserts to the database.
        collection.insert_one(employees);
        return {'id': len(all_employees)}, 200
    # The user did not enter json format.
    else:
        # The frontend will be notified of the error.
        flash('data is not in json format')
        # Return error 400.
        return render_template('error.html'), 400

# Update employee information
# Given ObjectId, update employee object
@app.route("/update", methods=["PUT"])
def update_employee():
    all_employees = list(collection.find({}))
    if request.is_json:
        # Get the data that is being added.
        employee = request.get_json()
        # Updates passed in employee object in database, given the ObjectId.
        collection.update({'_id': employee["_id"]["$oid"]}, employee)
        return "employee " + str(employee["employeeId"]["$numberInt"]) + "'s information has been updated", 200
        # The user did not enter json format.
    else:
        # The frontend will be notified of the error.
        flash('data is not in json format')
        # Return error 400.
        return render_template('error.html'), 400

# Remove json data via Postman from server. Also removes data directly from MongoDB.
# Removes the employee based on email.
@app.route("/remove/<email>", methods=["DELETE"])
def remove_employee(email):
    all_employees = list(collection.find({}))
    """ Returns the first occurence of the object with the given email """
    current_employee = collection.find_one({"email": email})
    """ Removes the employee from the server """
    all_employees.remove(current_employee)
    """ Removes the employee from MongoDB """
    collection.delete_one(current_employee)
    """ Return """
    return 'None', 200

#login
jwt = JWTManager(app)

# configuring JWT
app.config["JWT_SECRET_KEY"] = "this-is-secret-key"

#route that leads you to the org chart page once you are logged in
#unable to reach this route until you are successfully logged in
@app.route("/dashboard")
@jwt_required
def dasboard():
    return jsonify(message="Welcome! to the Ultimate Software Employee Organization Chart!")

@app.route("/login", methods=["POST"])
def login():
    if request.is_json:
        email = request.json["email"]
        password = request.json["password"]
    else:
        email = request.form["email"]
        password = request.form["password"]

    test = collection.find_one({"email": email,"password":password})
    if test:
        access_token = create_access_token(identity=email)
        return jsonify(message="Login Succeeded!", access_token=access_token), 201
    else:
        return jsonify(message="Bad Email or Password"), 401

if __name__ == '__main__':
    app.run(debug=True)

"""
# Add json data via Postman to the requests. 
@app.route("/sendManagerRequest", methods=["POST"])
def send_manager_request():
    rcollection = db["Requests"]
    requests = list(rcollection.find({}))
    if request.is_json:
        # Get the data that is being added.
        employees = request.get_json()
        # Append the json data to the database.
        requests.append(employees)
        # Inserts to the database.
        rcollection.insert_one(employees);
        return {'id': len(requests)}, 200
    # The user did not enter json format.
    else:
        # The frontend will be notified of the error.
        flash('data is not in json format')
        # Return error 400.
        return render_template('error.html'), 400
# Find a request given to the logged in user.
@app.route("/viewManagerRequest", methods=["GET"])
@jwt_required
def view_manager_request():
    rcollection = db["Requests"]

    userID = None
    for u in collection['email']:
        if get_jwt_identity() == u['email']:
            userID = u['employeeId']
            break

    if not userID:
        return
    
    request = db.requests.find_one({'newManager': userID})
    employee = None
    for e in collection['employeeId']:
        if request['employeeId'] == e['employeeId']:
            employee = e
            break
    if not employee:
        return

    return employee
    pass
"""