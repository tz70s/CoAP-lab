/*
 * Simple CoAP client-server architecture practice
 *
 * Author : Tzu-Chiao Yeh
 *
 */

var coap = require('coap');

var server = coap.createServer();

server.on('request', function(req, res) {
	console.log('\n'+' Packet received ');
	console.log(JSON.parse(req.payload));
	console.log();
	res.write('Hello ' + req.url + '\n');
	res.end();
});

server.listen(function() {
	console.log('server started');
});
