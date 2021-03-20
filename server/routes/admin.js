var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var connection = mysql.createConnection({

})

var bodyParser = require('body-parser');
var cors = require('cors');

const bcrypt = require('bcrypt');

router.use(cors());
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.get('/', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.render('index', { title: 'Express' });
});

router.post('/', function(req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  //get the user input
  var inUsername = req.body.id;
  var inPassword = req.body.pass;

  //select the account from the database (only 1 acc anyways)
  connection.query('SELECT * FROM creds', function(error, results, fields) {
    if (error) throw error;

    // if no accounts exist, add one (dummy test, will be removed at the end)
    if (!results[0]) {
      bcrypt.hash(inPassword, 10, function(error, hash) {
        if (error) throw error;   
        connection.query('INSERT INTO creds (username, pass) VALUES (?, ?)',
        [inUsername, hash],
        function(error, results, fields) {
          if (error) throw error;
          res.send({result: 'OK'});
          console.log('OK');
        });
      });
      } else {

        //compare the db's password with the user's input
        bcrypt.compare(inPassword, results[0].pass, function(error, results) {
          if (error) throw error;

          //if correct, send OK to the frontend
          if(results) {
            res.json({result: 'OK'});
            console.log('OK');

            //else, send Failed
          } else {
            res.json({result: 'Failed'});
            console.log('Failed');
          }
        });
      }
  });


});

router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.sendStatus(404);
});

module.exports = router;
