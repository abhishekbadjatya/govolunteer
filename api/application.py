import certifi
import sys
import os
import json
import time
import config as Config
from flask import Flask
from pprint import pprint
from flask import Flask, request, render_template, g, redirect, Response, make_response, jsonify, url_for
from flaskext.mysql import MySQL
from werkzeug import generate_password_hash, check_password_hash

application = Flask(__name__)  
app = application
#mysql = MySQL()


# MySQL configurations
app.config['MYSQL_DATABASE_USER'] = 'root'
app.config['MYSQL_DATABASE_PASSWORD'] = ''
app.config['MYSQL_DATABASE_DB'] = 'govol'
app.config['MYSQL_DATABASE_HOST'] = 'localhost'
mysql = MySQL(app)
'''mysql.init_app(app)'''

@app.route('/')
@app.route('/index')
def index():
    return render_template('index.html')

@app.route('/api/authz/signup/', methods=['POST'])
def signup():
    try:
        if not request.json or not 'EmailId' in request.json:
               return json.dumps({'message':'Error'})
        content = request.get_json(silent=True)
        _hashed_password = generate_password_hash(content['password'])
        conn=mysql.connect()
        dbcursor = conn.cursor();
        dbcursor.callproc('sp_createUser',(content['username'],content['EmailId'],_hashed_password))
        data = dbcursor.fetchall()
        if len(data) is 0:
            conn.commit()
            return json.dumps({'message':'User created successfully !'})
        else:
            return json.dumps({'message':str(data[0])})
    except Exception as e:
        return json.dumps({'message':'Error2'})

@app.route('/api/authz/signin/', methods=['POST'])
def signin():
    try:
        if not request.json or not 'EmailId' in request.json and not 'password' in request.json:
            return json.dumps({'message':'Error'})
        content = request.get_json(silent=True)
        conn=mysql.connect()
        dbcursor = conn.cursor();
        dbcursor.callproc('sp_loginUser',(content['EmailId'],0,0))
        dbcursor.execute('SELECT @_sp_loginUser_1,@_sp_loginUser_2') 
        result = dbcursor.fetchone() 
        if check_password_hash(result[0], content['password']):
            conn.commit()
            return json.dumps({'message':'Logged In'})
        else:
            return json.dumps({'message':'Could not log in!!'+str(result[1])})
    except Exceptions as e:
        return json.dumps({'message':'Error'})

@app.route('/api/metadata', methods=['GET'])
def metadata():

   try:
       content = request.get_json(silent=True)
       conn=mysql.connect()
       dbcursor = conn.cursor();
       dbcursor.callproc('sp_getCityMetadata')
       #data = dbcursor.fetchone()
       data = dbcursor.fetchall()
       items_list1=[]
       for item in data:
                i = {
                    'CityId':item[0],
                    'CityName':item[1]
                }
                items_list1.append(i)
       #dbcursor.execute('SELECT @_sp_getMetadata_1')
       dbcursor.callproc('sp_getCategoriesMetadata')
       data = dbcursor.fetchall()
       items_list2=[]
       for item in data:
                i = {
                    'CategoryId':item[0],
                    'CategoryName':item[1]
                }
                items_list2.append(i)
       return json.dumps({'city':items_list1,'category':items_list2})
   except Exception as e:
       return json.dumps({'message':'Error'})


@app.route('/api/search', methods=['GET'])
def searchbyfilter():
   try:
       category=request.args.get('category');
       location=request.args.get('location');
       user_type=request.args.get('lookingfor');
       searchword=request.args.get('searchword');

       if location!=None and user_type!=None:
            
            return json.dumps({'message':'Error1'})
       else:
            return json.dumps({'message':'Error2'})

       return jsonify({'task': category}), 201
   except Exception as e:
       return json.dumps({'message':'Error'})


@app.route('/api/userpost', methods=['POST'])
def userpost():
   try:
    if not request.json or not 'userId' in request.json:
        return json.dumps({'message':'Error'})
    content=request.get_json(silent=True);
    #return json.dumps(content)
    conn=mysql.connect()
    dbcursor = conn.cursor();
    dbcursor.callproc('sp_createPost',(content['userId'],content['Title'],content['Description'],content['StartDate'],content['EndDate'],content['Tstamp'],content['CityId'],content['Category']))
    data = dbcursor.fetchall()
    if len(data) is 0:
        conn.commit()
        return json.dumps({'message':'Post created successfully!'})
    else:
        return json.dumps({'message':str(data[0])})
   except Exception as e:
        return json.dumps({'message':'Error1'})

@app.route('/api/event', methods=['POST'])
def newevent():
   try:
       content = request.get_json(silent=True);
       #activities=content['activities']
       conn=mysql.connect()
       dbcursor = conn.cursor();
       
       dbcursor.callproc('sp_createEvent',(1,content['title'],content['description'],content['startDate'],content['endDate'],0))

       dbcursor.execute('SELECT @_sp_createEvent_5') 
       result = dbcursor.fetchone()
       if result[0] != 0:
            pass
          #conn.commit()
       else:
          return json.dumps({'message':str(result)})
       eventid=result[0]
       activities=content['activities']
       for activity in activities:
            #return json.dumps(activity)
            dbcursor.callproc('sp_getFeasibleUser',(activity['categoryId'],activity['startTime'],activity['endTime'],activity['cityid']))
            data1 = dbcursor.fetchall()
            if len(data1) is 0:
                return json.dumps({'message':'User does not exist'})
            user=modeluser(data1)
            activity['user']=user;
            #return json.dumps(activity['user']['uid'])
            userids=activity['user']['uid']
            #return json.dumps(userids)
            dbcursor.callproc('sp_createActivity',(userids,activity['title'],activity['desc'],activity['categoryId'],activity['startTime'],activity['endTime'],eventid,activity['cityid'],0))
            dbcursor.execute('SELECT @_sp_createActivity_8')
            result2 = dbcursor.fetchone()
            if result2[0] != 0:
                activity['activityid']=result2[0]
            else:
                return json.dumps({'message':str(result2)})
       content['activities']=activities
       return json.dumps(content)
   except Exception as e:
       return json.dumps({'message':'Error1'})

def modeluser(usercred):
    i = {
                    'uid':1,
                    'username':usercred[0][0],
                    'emailid':usercred[0][1],
                    'pic':usercred[0][2],
                    'UserType':usercred[0][3],'Description':usercred[0][4],'City':usercred[0][5]

                }
    return i;
if __name__ == "__main__":
    app.run(debug=True)