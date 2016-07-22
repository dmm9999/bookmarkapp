var express = require("express");
var app     = express();
var path    = require("path");
var fs      = require('fs');
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

var idIncrementer;

fs.readFile('bookmarks.json', function read(err, data) {
    if (err) {
        throw err;
    }
    var object = JSON.parse(data);
    idIncrementer = Object.keys(object).length + 1;
  });

app.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/index.html'));
});

app.get('/bookmarks', function (req, res) {
  var bookmarks = fs.readFile('bookmarks.json', function (err, data) {
    if (err) {
      console.log("error!");
    }
  res.send(JSON.parse(data));
  });
});

app.post('/bookmarks', function (req, res) {
  var bookmark = {title : req.body.title, url : req.body.url};
  var content;
fs.readFile('bookmarks.json', function (err, data) {
    if (err) {
        throw err;
    }
    content = JSON.parse(data);
    content[idIncrementer] = bookmark;
    idIncrementer += 1;
    fs.writeFile('bookmarks.json', JSON.stringify(content), function(err) {
      if (err) {
        console.log("Error!");
      } else {
        console.log("File updated!");
      }
    });
  });
  res.send(null);
});

app.delete('/bookmarks/:id', function (req, res) {
  var content;
  fs.readFile('bookmarks.json', function (err, data) {
    if (err) {
      console.log('error');
    }
    content = JSON.parse(data);
    delete content[parseInt(req.params.id)];
    fs.writeFile('bookmarks.json', JSON.stringify(content), function(err) {
      if (err) {
        console.log("Error!");
      } else {
        console.log("File deleted!");
      }
    });
  });
  res.send(null);
});

app.listen(3000);

console.log("Running at Port 3000");
