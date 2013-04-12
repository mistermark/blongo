
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , ArticleProvider = require('./articleprovider-mongodb').ArticleProvider;

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
}

// production only
if ('production' == app.get('env')) {
  app.use(express.errorHandler());
}

var ArticleProvider = new ArticleProvider('localhost', 27017);

app.get('/', function(req, res){
  ArticleProvider.findAll(function(error, docs){
    res.render('index', {
      locals: {
        title: 'Blog',
        articles: docs
      }
    });
  })
});

app.get('/blog/new', function(req, res){
  res.render('blog_new', {
    locals: {
      title: "New Post"
    }
  });
});

app.post('/blog/new', function(req, res) {
  ArticleProvider.save({
    title: req.param('title'),
    content: req.param('content')
  }, function(error, docs) {
    res.redirect('/')
  });
});

app.get('/blog/:id', function(req,res){
  ArticleProvider.findById(req.params.id, function(error, article) {
    res.render('blog_show',{
      locals: {
        title: article.title,
        aticle: article
      }
    });
  });
});

app.post('/blog/addComment', function(req,res){
  ArticleProvider.addCommentToArticle(req.param('_id'))
})

app.listen(app.get('port'));

// app.get('/users', user.list);

// http.createServer(app).listen(app.get('port'), function(){
//   console.log('Express server listening on port ' + app.get('port'));
// });
