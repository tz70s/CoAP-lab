/*
 * Http server to show the data
 *
 */

const express = require('express');
const bodyParser = require('body-parser');
const app = express();

/* set the view engine to ejs */

app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use('/css',express.static('css'));

app.get('/', function(req, res) {
	res.render('pages/index', {name: 'JONNN'} );
});

app.post('/',function(req, res) {
	console.log(req.body);
	res.render('pages/index', {name:req.body.name});
	//res.send('end');
});

app.listen(8080);

console.log('http server start!');
