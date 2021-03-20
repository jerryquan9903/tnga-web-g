var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var connection = mysql.createConnection({

})

var bodyParser = require('body-parser');
var cors = require('cors');

router.use(cors());
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

/* GET home peage. */
router.get('/', function(req, res) {
  //res.render('index', { title: 'Express' });
  //get all the texts from the database
  connection.query('SELECT * FROM about', function(error, results) {
    if (error) throw error;

    //if there are no/not enough data
    if (!results[2]) {
      res.json({
        headText: 'NOT AVAILABLE',
        subText: 'NOT AVAILABLE',
        bodyText: 'NOT AVAILABLE'
      });
    } else {
      let rows = results.length;
      let bodyString = "";

      for (i = 2; i < rows; i++) {
        bodyString += results[i].body + '\n';
      }
      res.json({
        headText: results[0].body,
        subText: results[1].body,
        bodyText: bodyString
      });
    }
  });
});

router.post('/', function(req, res) {
  console.log(req.body);
  let headText = req.body.headText;
  let subText = req.body.subText;
  let bodyText = req.body.bodyText;

  connection.query('DELETE FROM about WHERE about_id < 5', function(error, results) {
    if (error) throw error;

      connection.query('INSERT INTO about (body) VALUES (?), (?), (?)', [headText, subText, bodyText], function(error, results) {
        if (error) throw error;

      });
    
  });

  connection.query('ALTER TABLE about AUTO_INCREMENT=?', [about_data.length], function(error, results) {
    if (error) throw error;
  });

  res.json({result: 'OK'});
});

router.use(function(req, res, next) {
  res.sendStatus(404);
});


module.exports = router;
