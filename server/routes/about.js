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

/* GET home page. */
router.get('/', function(req, res) {
  //res.render('index', { title: 'Express' });

  //get all the texts from the database
  connection.query('SELECT * FROM about', function(error, results) {
    if (error) console.log(error);

    console.log(results);

    //if there are no/not enough data
    if (!results[0]) {
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

router.use(function(req, res, next) {
  res.sendStatus(404);
});


module.exports = router;
