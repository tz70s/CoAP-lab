var coap = require('coap');
var req = [
		coap.request({
				host: 'localhost',
				observe: true,
				pathname: '/node2'
			}),
		coap.request({
			host: 'localhost',
			observe: true,
			pathname:'/node1'
	})];


for(var i = 0; i < req.length; i++ ) {

	req[i].on('response', function(res) {
	
		var data_count = 0;

		res.on('data',function(data) {
		
			data_count++;

			console.log('' + data);
			if(data_count === 10) {
				res.close();
			}
		});
	
	});
	
	req[i].end();
}
