var express 	= require ('express');
var bodyParser 	= require('body-parser');
var path		= require('path');
var fs          = require('fs');
var app 		= express();
var port 		= process.env.PORT || 3000;
var env 		= process.env.NODE_ENV || 'development';

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/bower_components',  express.static( path.join(__dirname, '/bower_components')));
app.use(function (error, req, res, next) {
	if (error instanceof SyntaxError) {
		res.status(409).json({ error: 'Wrong Syntax' });
	} else {
		next();
	}
});


app.get('/', function(req, res){
	res.render('index');
})
app.get('*', function(req, res){
	res.render('index');
});
app.listen(port, function(){
	console.log('Lookat HUB is running on '+port+' '+env);
})
