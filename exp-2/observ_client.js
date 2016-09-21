var coap = require('coap');
var req = coap.request({
				observe: true
			});

var os = require('os');

req.on('response', function(res) {
	
	var data_count = 0;

	res.on('data',function(data) {
		
		data_count++;

		console.log('\nAction -> ' + data);
		action_handler(''+data);
		console.log();

		if(data_count === 10) {
			res.close();
		}
	});
	
});

req.end();

function action_handler(action) {
	switch(action) {
		case 'cpu_info': 
			console.log('The cpu info is : ' + os.cpus()[0].model);
			break;
		case 'platform':
			console.log('The os platform is ' + os.platform());
			break;
		case 'hostname':
			console.log('The host name is ' + os.hostname());
			break;
		case 'arch':
			console.log('The cpu architecture is ' + os.arch());
			break;
		default:
			console.log('cant read action');
			break;
	}
}

