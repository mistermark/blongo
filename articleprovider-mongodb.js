//- articleprovider-mongodb.js
var Db = require('mongodb').Db
  , Connection = require('mongodb').Connection
  , Server = require('mongodb').Server
  , BSON = require('mongodb').BSON
  , ObjectID = require('mongodb').ObjectID;

ArticleProvider = function(host, port) {
  this.db = new Db('blongo-blog', new Server(host, port, { auto_reconnect: true }), { safe: true });
  this.db.open(function(){
    console.log('>> Access to mongodb open');
  });
};

ArticleProvider.prototype.getCollection = function(callback) {
  this.db.collection('articles', function(error, article_collection){
    if(error) callback(error)
    else callback(null, article_collection);
  });
};

ArticleProvider.prototype.findAll = function(callback) {
  this.getCollection(function(error, article_collection) {
    if(error) callback(error)
    else {
      
      article_collection.find().toArray(function(error, results) {
        if(error) callback(error)
        else {
          //- console.log(results);
          callback(null, results)
        }
      })
    }
  })
};

ArticleProvider.prototype.findById = function(id, callback) {
  this.getCollection(function(error, article_collection) {
    if(error) callback(error)
    else {
      console.log("ArticleProvider.prototype.findById");
      article_collection.findOne({
        _id: article_collection.db.bson_serializer.ObjectId.createFromHexString(id)
      },
      function(error, result){
        if(error) callback(error)
        else callback(null, result)
      });
    }
  });
};

ArticleProvider.prototype.save = function(articles, callback) {
  this.getCollection(function(error, article_collection){
    if(error) callback(error)
    else {
      console.log("ArticleProvider.prototype.save");
      if(typeof(articles.length) == "undefined")
        articles = [articles];
      for( var i=0; i<articles.length; i++) {
        article = articles[i];
        article.created_at = new Date();
        if(article.comments === undefined) article.comments = [];
        for( var j=0; j < article.comments.length; j++) {
          article.comments[j].created_at = new Date();
        }
      }

      article_collection.insert(articles, function(){
        callback(null, articles);
      });
    }
  });
};

exports.ArticleProvider = ArticleProvider;





