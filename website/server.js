const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const chartjs = require('chartjs-node');
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

app.post('/', (req, res) => {
  req.left
});

state_names = ['AL', 'AK', 'AS', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FM', 'FL', 'GA', 'GU', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MH', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'MP', 'OH', 'OK', 'OR', 'PW', 'PA', 'PR', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VI', 'VA', 'WA', 'WV', 'WI', 'WY' ];
app.get('/', (req, res) => {
    // connection.query("SELECT * FROM birth_data_by_city limit 1", (err, rows)=>{
    //     if(err){
    //         console.log("Failed query!");
    //         return;
    //     }
    //     console.log("Successfully recieved tuple!!!!!!", rows[0]);
        res.render('index' ,{
          title: 'State Data Viewer',
          states: state_names
        });
    // });
});

const server = app.listen(7000,() => {
   console.log(`Express running → PORT ${server.address().port}`);
});
