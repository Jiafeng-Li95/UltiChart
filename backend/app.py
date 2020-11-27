
from flask import Flask, request, jsonify, sessions
from flask_jwt_extended import JWTManager, jwt_required, create_access_token
import pymongo
from pymongo import MongoClient
import json
from bson import json_util
from bson.objectid import ObjectId
# Mac: export FLASK_APP=app.py flask run
# To keep it in dev mode continuously: export FLASK_APP=app.py FLASK_ENV=development

# Change connection string depending on your python version. 
cluster_320 =  MongoClient("mongodb://cc320:cc320@320-shard-00-00.8rfoj.mongodb.net:27017,320-shard-00-01.8rfoj.mongodb.net:27017,320-shard-00-02.8rfoj.mongodb.net:27017/320?ssl=true&replicaSet=atlas-mkdts8-shard-0&authSource=admin&retryWrites=true&w=majority")
db = cluster_320["Employees"]
collection = db["Tiger_Microsystems-employees"]

db2 = cluster_320["Employees"]
collection2 = db2["Requests"]

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
    current_employee.append({"firstName": current_emp["firstName"], "lastName": current_emp["lastName"], "employeeId": current_emp["employeeId"], "positionTitle": current_emp["positionTitle"], "email": current_emp["email"]})
    
    return jsonify({"currentEmployee": current_employee, "directReports": direct_reports})

# Searchable by firstName and lastName
# password, positionTitle, isManager and startDate
@app.route("/search/<search_text>", methods=["GET"])
def complete_search(search_text):
    result = []
    # check available indices
    matched_emps = collection.find({"email":{"$regex":search_text, '$options' : 'i'}})
    for employee in matched_emps:
        result.append({"firstName": employee["firstName"], "lastName": employee["lastName"], "email": employee["email"], "employeeID": employee["employeeId"], "managerID": employee["managerId"], "password": employee["password"], "positionTitle": employee["positionTitle"], "isManager": employee["isManager"], "startDate": employee["startDate"]})

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
# Given employeeId, update employee object
@app.route("/update", methods=["PUT"])
def update_employee():
    if request.is_json:
        # Get the data that is being added.
        post = request.get_json()
        # Updates passed in employee object in database, given the employeeId
        collection.find_one_and_update({"employeeId": post["employeeId"]}, {"$set": post})
        return "employee " + str(post["employeeId"]) + "'s information has been updated", 200
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

#route to check if a user is a manager or not 
@app.route("/isManager/<email>", methods=["GET"])
def is_Manager(email):
    current_emp = collection.find_one({"email": email}) #getting the current user object
    if current_emp: #if the current user is a valid user

        if current_emp["isManager"] == True: #checking if the user is a manager or not
            return "isManager"
        else:
             return "isNotManager"
    else:
        return "employee not found"

@app.route("/decline/<objectID>", methods=["PUT"])
def decline_request(objectID):
    collection2.update({'_id': ObjectId(objectID)},    # Updating status, but not changing any data
        {
         '$set': {
            'status': "decline"
        }
    }, upsert=False)
   
    return "Done"

@app.route("/accept/<objectID>", methods=["PUT"])
def accept_request(objectID):
    current_request = collection2.find_one({"_id": ObjectId(objectID)})  # Need to update the actual database.
    collection2.update({'_id': ObjectId(objectID)},
        {
         '$set': {
            'status': "accept"
        }
    }, upsert=False)

    collection.update({'employeeId': current_request["employeeId"]},
        {
         '$set': {
            'managerId': current_request["newManager"]
        }
    }, upsert=False)

    return "Done"

@app.route("/createRequest/<oldManagerEmail>/<newManagerEmail>/<oldManagerID>/<newManagerID>/<employeeID>", methods=["POST"])
def create_request(oldManagerEmail, newManagerEmail, oldManagerID, newManagerID, employeeID):
    rcollection = db["Requests"]

    sendRequest = []
    sendRequest.append({"employeeID": employeeID, "oldManager": oldManagerID, "newManager": newManagerID, "oldManagerEmail": oldManagerEmail, "newManagerEmail": newManagerEmail, "status": "pending"})
    rcollection.insert_many(sendRequest)
    return "Done"

# Find a request given to the logged in user.
@app.route("/viewSentRequests/<email>", methods=["GET"])
def view_sent_requests(email):
    rcollection = db["Requests"] 
    current_emp = collection.find_one({"email": email})  

    targetRequests = [] 
    all_requests = rcollection.find({"oldManager": current_emp["employeeId"]})

    for requests in all_requests:
        targetRequests.append({"EmployeeID": requests["employeeId"], "OldManager": requests["oldManager"], "NewManager": requests["newManager"], "OldManagerEmail": requests["oldManagerEmail"], "NewManagerEmail": requests["newManagerEmail"], "Status": requests["status"]})
    return jsonify({"ViewSentRequests": targetRequests})

# Find a request given to the logged in user.
@app.route("/viewReceivedRequests/<email>", methods=["GET"])
def view_received_requests(email):
    rcollection = db["Requests"] 
    current_emp = collection.find_one({"email": email})  

    targetRequests = [] 
    all_requests = rcollection.find({"newManager": current_emp["employeeId"]})

    for requests in all_requests:
        targetRequests.append({"EmployeeID": requests["employeeId"], "OldManager": requests["oldManager"], "NewManager": requests["newManager"], "OldManagerEmail": requests["oldManagerEmail"], "NewManagerEmail": requests["newManagerEmail"], "Status": requests["status"]})
    return jsonify({"ViewRecievedRequests": targetRequests})
