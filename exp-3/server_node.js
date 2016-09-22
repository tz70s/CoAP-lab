/*
 * Running on Raspberry pi as a coap server node
 *
 */

const coap = require('coap'),
	server = coap.createServer(),
	    os = require('os');

function System_Descript(device,data) {
	this.device = device;
	this.data = data || {};
	this.packet_time = '';
}

System_Descript.prototype.update = function() {
	this.packet_time = new Date().toISOString();
	switch(this.device) {
		case 'os_device':
			this.data.cpu_usage = os.loadavg();
			break;
		case 'net_device':
			this.data = os.netInterfaces();
			break;
	}
}

var OS_Data = {
	cpu : os.cpus()[0].model,
	cpu_usage : os.loadavg(),
	arch : os.arch(),
	osplatform : os.platform(),
};

var Net_Interface = os.networkInterfaces();

var tmp_obj = {
	os_deivce : new System_Descript('os_device', OS_Data),
	net_device : new System_Descript('net_device', Net_Interface)
};

server.on('request',function(req,res) {

	var count = 0;
	var device = req.url.split('/')[1] + '';
	console.log(device);
	if( tmp_obj[device] ) return ;
	
	console.log(tmp_obj[device]);

	var interval = setInterval(function() {
		tmp_obj[device].update();
		res.write(JSON.stringify(tmp_obj[device]));
		count++;
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

server.listen(function() {
	console.log('Server start!');
});
