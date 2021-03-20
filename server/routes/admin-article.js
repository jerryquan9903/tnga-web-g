var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var connection = mysql.createConnection({

});

var cors = require('cors');
var bodyParser = require('body-parser');

router.use(cors());
router.use(bodyParser.json({limit: '50mb'}));
router.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.sendStatus(200);
});

router.get('/add', function(req, res, next) {
  console.log(req.body);
  res.sendStatus(200);
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
});

router.post('/add', function(req, res, next) {
  console.log(req.body);
  let title = req.body.title;
  let sub = req.body.sub;
  let image = [];
  let text = [];
  let num = req.body.num;
  let date = req.body.date;

  let articleId = title.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
  articleId = articleId.replace(/đ/g, "d");
  articleId = articleId.replace(/Đ/g, "D");
  articleId = articleId.replace(/[^\w\s]/gi, '');
  articleId = articleId.replace(/ /g, "-");

  for (let i = 1; i <= num; i++) {
    let imageKey = 'image' + i;
    let textKey = 'text' + i;
    image.push(req.body[imageKey]);
    text.push(req.body[textKey]);
  }

  console.log("test");

  connection.query('INSERT INTO article_index (article_url, article_title, article_sub, article_date, thumbnail) VALUES(?,?,?,?)',
  [articleId, title, sub, date, image[0]],
  function(error, results) {
    if (error) throw error;
    
    let databaseID = 0;

    connection.query('SELECT * FROM article_index WHERE article_url=?',
    [articleId],
    function(error, results) {
      if (error) throw error;

      databaseID = results[0].article_id;

      for (let i = 0; i < num; i++) {
        connection.query('INSERT INTO article_data (article_id, article_url, article_text, article_image) VALUES (?,?,?,?) ',
        [databaseID, articleId, text[i], image[i]],
        function(error, results) {
          if (error) throw error;

        });    
      }
    });
  });
  
  res.json({result: 'OK'});
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
});

function decodeBase64Image(dataString) {
  let result = [];
  if (dataString != undefined || dataString != null) {
    for (let i = 0; i < dataString.length; i++) {
      if(dataString[i] != 'undefined') {
        var matches = dataString[i].match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
        response = {};
  
        if (matches.length !== 3) {
          return new Error('Invalid input string');
        }
  
        response.type = matches[1];
        response.data = new Buffer.from(matches[2], 'base64');
        result.push(response);
      } else {
        result.push(null);
      }

    }
  }

  return result;
}


router.get('/delete', function(req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  connection.query('SELECT * FROM article_index ORDER BY article_id DESC', function(error, results) {
    if (error) throw error;

    if (results[0]) {
      let resultArray = [];
      for (let i = 0; i < results.length; i++) {
        if (results[i].article_date)
          resultArray.push({id: results[i].article_id, title: results[i].article_title, date: results[i].article_date});
        else
          resultArray.push({id: results[i].article_id, title: results[i].article_title, date: 'Unknown'});
      }

      res.json(resultArray);
    } else {
      res.json({result: 'Failed'});
    }
  });
});

router.post('/delete', function(req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  let id = req.body.id;
  
  connection.query('DELETE FROM article_data WHERE article_id=?', [id],
  function(error, results) {
    if (error) throw error;

    connection.query('DELETE FROM article_index WHERE article_id=?', [id],
    function(error, results) {
      if (error) throw error;

      res.json({result: "OK"});
    });
  });
});

router.post('/edit', function(req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  let id = req.body.id;

  let resultIndex = [];
  let resultData = [];

  connection.query('SELECT * FROM article_data WHERE article_id=?',[id], 
  function(error, results) {
    if (error) throw error;

    if (results) {
      resultData = results;

      connection.query('SELECT * FROM article_index WHERE article_id=?',[id], 
        function(error, results) {
          if (error) throw error;

          resultIndex = results;
          res.json({index: resultIndex, data: resultData});
      });
    }
  });
})

router.post('/saveedit', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  let id = req.body.id;
  let title = req.body.title;
  let sub = req.body.sub;
  let image = [];
  let text = [];
  let num = req.body.num;

  let articleId = title.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
  articleId = articleId.replace(/đ/g, "d");
  articleId = articleId.replace(/Đ/g, "D");
  articleId = articleId.replace(/[^\w\s]/gi, '');
  articleId = articleId.replace(/ /g, "-");

  for (let i = 1; i <= num; i++) {
    let imageKey = 'image' + i;
    let textKey = 'text' + i;
    image.push(req.body[imageKey]);
    text.push(req.body[textKey]);
  }

  console.log(image);

  let imagesWithBlank = [];

  for (let i = 0; i < image.length; i++) {
    if (image[i] == 'undefined' || image[i] == null || image[i] == "") {
      connection.query('SELECT * FROM article_data WHERE article_id=?', [id], function(error, results) {
        if (error) {
          console.log(error);
          throw error;
        }

        imagesWithBlank.push(results[i].article_image);
      });
    } else {
      imagesWithBlank.push(image[i]);
    }
  }

  connection.query('UPDATE article_index SET article_title=?, article_sub=? WHERE article_id=?',
  [title, sub, id],
  function(error, results) {
    if (error) {
      console.log(error);
      throw error;
    }

    connection.query('SELECT * FROM article_data WHERE article_id=?',
    [id],
    function(error, results) {
      if (error) {
        console.log(error);
        throw error;
      }

      let incrementArray = [];
      for (let i = 0; i < results.length; i++) {
        incrementArray.push(results[i].increment_id);
      }

      console.log(incrementArray);

      if (incrementArray.length > text.length) {      
        for (let i = 0; i < text.length; i++) {
          connection.query('UPDATE article_data SET article_text=?, article_image=? WHERE increment_id=? ',
          [text[i], imagePath[i], incrementArray[i]],
          function(error, results) {
            if (error) {
              console.log(error);
              throw error;
            }         
            
            for (let i = text.length; i < incrementArray.length; i++) {
              connection.query('DELETE FROM article_data WHERE increment_id=?', [incrementArray[i]], function(error, results) {
                if (error) {
                  console.log(error);
                  throw error;
                }
              })
            }
          });
        }   
      } else if (incrementArray.length < text.length) {
        for (let i = 0; i < incrementArray.length; i++) {
          connection.query('UPDATE article_data SET article_text=?, article_image=? WHERE increment_id=? ',
          [text[i], image[i], incrementArray[i]],
          function(error, results) {
            if (error) {
              console.log(error);
              throw error;
            }         
              
            connection.query('SELECT * FROM article_index WHERE article_id=?', [id], function(error, results) {
              if (error) {
                console.log(error);
                throw error;
              }

              let url = results[0].article_url;
              for (let i = incrementArray.length; i < text.length; i++) {
                connection.query('INSERT INTO article_data (article_id, article_url, article_text, article_image) VALUES (?,?,?,?)',
                [id, url, text[i], image[i]],
                function(error, results) {
                  if (error) {
                    console.log(error);
                    throw error;
                  }
                });
              }  
            });                            
          });
        }   
      } else {
        for (let i = 0; i < text.length; i++) {
          connection.query('UPDATE article_data SET article_text=?, article_image=? WHERE increment_id=? ',
          [text[i], image[i], incrementArray[i]],
          function(error, results) {
            if (error) {
              console.log(error);
              throw error;
            }         
           
          });
        } 
      }
    });
  });  
  
  res.json({result: 'OK'})
});

module.exports = router;
