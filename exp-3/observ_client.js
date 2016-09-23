/*
 * Observe Client and Express Framework
 */

const coap = require('coap');
var req = [
		coap.request({
				host: 'localhost',
				observe: true,
				pathname: '/os_device'
			}),
		coap.request({
			host: 'localhost',
			observe: true,
			pathname:'/net_device'
			}),
		coap.request({
			host: '192.168.1.105',
			observe: true,
			pathname: '/os_device'
			}),
		coap.request({
			host: '192.168.1.105',
			observe: true,
			pathname: '/net_device'
			}),
];
var obj_queue = [];

for(var i = 0; i < req.length; i++ ) {
	
	var host_addr = req[i].url.host;	
	req[i].on('response', function(res) {
			
		var data_count = 0;
			
		res.on('data',function(data) {
			data_count++;
			console.log({index:host_addr, d : JSON.parse(data)});
			obj_queue.push({ index:host_addr, d : JSON.parse(data)});
			if(data_count === JSON.parse(data).counter) {
				res.close();
			}
		});
	
	});
	req[i].end();
}

/*
 *
 * http server
 *
 */

const http = require("http"),
	   url = require("url"),
	    fs = require("fs"),
	    io = require("socket.io");

var static_html;

fs.readFile('index.html', function(err, data) {
	if (err) {
		throw err;
	}
	static_html = data;	
});

var static_css;

fs.readFile('bootstrap.min.css',function(err, data) {
	if(err) {
		throw err;
	} 
	static_css = data;
});

var server = http.createServer(function(request, response) {
	console.log('Build http server');
	response.writeHead(200, {"Content-Type": "text/html"});
	response.write(static_html);
	response.end();

});

server.listen(8080);


var serv_io = io.listen(server);

serv_io.sockets.on('connection', function(socket) {
	var tmp = {};

	setInterval(function() {
		if(obj_queue[0] !== {} && obj_queue[0] !== tmp)  {
			socket.emit('message', obj_queue[0]);
			tmp = obj_queue[0];
			obj_queue.shift();
		}
	},500);
});


