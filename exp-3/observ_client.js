/*
 * Observe Client
 * 
 *
 */

var coap = require('coap');
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


for(var i = 0; i < req.length; i++ ) {

	req[i].on('response', function(res) {
	
		var data_count = 0;

		res.on('data',function(data) {
		
			data_count++;

			console.log(JSON.parse(data));
			if(data_count === JSON.parse(data).counter) {
				res.close();
			}
		});
	
	});
	
	req[i].end();
}
