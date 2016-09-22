/*
 * Running on Raspberry pi as a coap server node
 *
 */

const coap = require('coap'),
	server = coap.createServer();

server.on('request',function(req,res) {

	var count = 0;
	var device = req.url.split('/')[1];
	var val = req.url.split('e')[1]*2000;

	var interval = setInterval(function() {
		res.write('Hello, this is a server ' + device);
		count++;
		if(count === 10) {
			clearInterval(interval);
			res.end();
		}
	}, val);

	res.on('finish', function(err) {
		console.log('finish');
		res.end();
	});
});

server.listen(function() {
	console.log('Server start!');
});
