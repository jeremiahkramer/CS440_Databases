const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mysql = require('mysql');
app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());

const connection = mysql.createConnection({
  user:'cs440_group02',
  password:'7mquVYx9EV5c',
  host:'classmysql.engr.oregonstate.edu',
  database:'cs440_group02',
  multipleStatements: true
});

connection.connect((err) => {
  if(err){
    console.log('Error connecting to Database...');
    return;
  }
  console.log('Connected to Database!');
});

//handle querying to get data for plots
app.post('/', (req, res) => {
  console.log(req.body.right);
  res_data = {
    left_data: [],
    right_data: []
  }
  //general query for a state, on 'left' table
  connection.query("SELECT * FROM " + req.body.left + " WHERE state = " + req.body.state, (err, rows)=>{
    if(err){
      console.log("Failed query!");
      return;
    }
    console.log("Successfully recieved tuple", rows[0]);
    res_data.left_data = rows[0];
  });
  //general query for a state, on 'right' table
  connection.query("SELECT * FROM " + req.body.right + " WHERE state = " + req.body.state, (err, rows)=>{
    if(err){
      console.log("Failed query!");
      return;
    }
    console.log("Successfully recieved tuple", rows[0]);
    res_data.right_data = rows[0]; 
  });
  //send back the data
  res.send(res_data);
  
});

state_names = ['Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming'];
app.get('/', (req, res) => {
  res.render('index' ,{
    title: 'State Data Viewer',
    states: state_names
  });
});

const server = app.listen(7000,() => {
   console.log(`Express running → PORT ${server.address().port}`);
});
