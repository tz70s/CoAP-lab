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
var use_flag = 0;


req[0].on('response', function(res) {
		
		var data_count = 0;
			
		res.on('data',function(data) {
			
			data_count++;
			//console.log({ index:0, d : JSON.parse(data) });
			
			//while(use_flag === 1);
			//use_flag = 1;
			obj_queue.push({ index:0, d : JSON.parse(data)});
			//use_flag = 0;
			if(data_count === JSON.parse(data).counter) {
				res.close();
			}
		});
	
	});

req[0].end();

req[1].on('response', function(res) {
		
		var data_count = 0;
			
		res.on('data',function(data) {
			
			data_count++;
			//console.log({ index:0, d : JSON.parse(data) });
			
			obj_queue.push({ index:0, d : JSON.parse(data)});
			if(data_count === JSON.parse(data).counter) {
				res.close();
			}
		});
	
	});

req[1].end();

req[2].on('response', function(res) {
		
		var data_count = 0;
			
		res.on('data',function(data) {
			
			data_count++;
			//console.log({ index:1, d : JSON.parse(data) });
			
			obj_queue.push({ index:1, d : JSON.parse(data)});
			if(data_count === JSON.parse(data).counter) {
				res.close();
			}
		});
	
	});

req[2].end();

req[3].on('response', function(res) {
		
		var data_count = 0;
			
		res.on('data',function(data) {
			
			data_count++;
			//console.log({ index:1, d : JSON.parse(data) });
			
			obj_queue.push({ index:1, d : JSON.parse(data)});
			if(data_count === JSON.parse(data).counter) {
				res.close();
			}
		});
	
	});

req[3].end();



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
		if(obj_queue[0] && obj_queue[0] !== tmp)  {
			socket.emit('message', obj_queue[0]);
			console.log(obj_queue[0].d);
			tmp = obj_queue[0];
			obj_queue.shift();
		}
	},0);
});


