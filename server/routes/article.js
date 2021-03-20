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
router.post('/', function(req, res, next) {
  let url = req.body.url;
  console.log(url);

  let resultIndex = [];
  let resultData = [];

  connection.query('SELECT * FROM article_data WHERE article_url=?',[url], 
  function(error, results) {
    if (error) console.log(error);

    resultData = results;
    console.log('index');

    
  });

  connection.query('SELECT * FROM article_index WHERE article_url=?',[url], 
      function(error, results) {
        if (error) throw error;

        console.log('data');

        resultIndex = results;
        res.json({index: resultIndex, data: resultData});
    });    
});

module.exports = router;
