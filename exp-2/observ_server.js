var coap = require('coap');

var server = coap.createServer();

server.listen(function() {
	console.log('Server start!');
});

var action_arr = ['cpu_info','platform','hostname','arch'];

function generator(arr) {
	var arr_index = Math.floor(Math.random()*4);
	return arr[arr_index];
};

server.on('request', function(req, res) {
	
	var count = 0;
	
	var interval = setInterval(function() {
		count++;
		res.write(generator(action_arr));

		if(count === 10) {
			clearInterval(interval);
			res.end();
		}
	}, 2000);
	
	res.on('finish', function(err) {
		console.log('finish');
		res.end();
	});

});
