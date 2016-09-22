/*
 * Running on Raspberry pi as a coap server node
 *
 */

const coap = require('coap'),
	server = coap.createServer(),
	    os = require('os');

function System_Descript(device,data,observ_time) {
	this.device = device || '';
	this.data = data || {};
	this.packet_time = '';
	this.observ_time = 3000;
	this.counter = 10;
}

System_Descript.prototype.update = function() {

	this.packet_time = new Date().toISOString();

	switch(this.device) {
		case 'os_device':
			this.data.cpu_usage = os.loadavg()[0];
			this.data.free_memory = os.freemem() / os.totalmem();
			break;
		case 'net_device':
			this.data = os.networkInterfaces()['eth0'] || (os.networkInterfaces()['wlan0'] || os.networkInterfaces()['wlp2s0']);
			break;
		default:
			console.log('Cant update');
	}
}

System_Descript.prototype.set_observ_time = function() {
	switch(this.device) {
		case 'os_device' :
			this.observ_time = 2000;
			this.counter = 10;
			break;
		case 'net_device':
			this.observ_time = 10000;
			this.counter = 3;
			break;
	}
}

function init(device) {

	var obj = {};
	switch(device) {
		case 'os_device':
			obj = {
				cpu : os.cpus()[0].model,
				arch : os.arch(),
				osplatform : os.platform(),
				cpu_usage : os.loadavg()[0],
				free_memory : os.freemem() / os.totalmem(),
			}
			break;
		case 'net_device':
			obj = os.networkInterfaces()['eth0'] || ( os.networkInterfaces()['wlan0'] || os.networkInterfaces()['wlp2s0'] );
			break;
		default:
			console.log('Unknown device');

	}
	return obj;
}

server.on('request',function(req,res) {

	var count = 0;
	var device = req.url.split('/')[1] + '';
	
	var data_pack = new System_Descript(device, init(device));
	
	if(data_pack.data === {}) {
		console.log('init failed');
		server.close();
		return ;
	}

	data_pack.set_observ_time();

	var interval = setInterval(function() {
		data_pack.update();
		res.write(JSON.stringify(data_pack));
		count++;
		if(count === data_pack.counter) {
			clearInterval(interval);
			res.end();
		}
	}, data_pack.observ_time);

	res.on('finish', function(err) {
		console.log('finish');
		res.end();
	});
});

server.listen(function() {
	console.log('Server start!');
});
