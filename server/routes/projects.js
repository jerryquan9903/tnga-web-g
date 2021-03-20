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
router.get('/', function(req, res, next) {
  connection.query('SELECT COUNT(*) from article_index', function(error, results) {
    if (error) console.log(error);

    let field = 'COUNT(*)';
    let articleCount = results[0][field];

    res.json({count: articleCount});
  });
});

router.post('/single-page', function(req, res, next) {
  let page = req.body.page;

  connection.query('SELECT COUNT(*) from article_index', function(error, results) {
    if (error) console.log(error);

    let field = 'COUNT(*)';
    let lastItem = results[0][field];

    console.log(lastItem);

    let limit = 0;
    let offset = 0;

    if (lastItem % 6 == 0 || lastItem >= (page*6)) {
      limit = lastItem - page*6;
      offset = 6;

    } else {
      limit = 0;
      offset = lastItem % 6;
    }

    connection.query('SELECT * FROM article_index LIMIT ?,?', [limit, offset],
      function(error, results) {
        if (error) console.log(error);

        let reversed = results.reverse();
        console.log("reverse");

        res.json(reversed);
  
      /*
      for (let i = 0; i < reversed.length; i++) {
        connection.query('SELECT * FROM article_data WHERE article_id=?',[reversed[i].article_id], function(error, results) {
          if (error) throw error;

          reversed[i].article_image = results[0].article_image;
          console.log("add img");

          if (i == reversed.length - 1)
            res.json(reversed);
        })
      }
      */
    });
  });
});


module.exports = router;