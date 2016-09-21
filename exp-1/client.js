/*
 * Simple CoAP client-server architecture
 *
 * Author : Tzu-chiao Yeh
 *
 */

var coap = require('coap');
var os = require('os');

var URI = 'coap://localhost/tzuchiao';
var req = coap.request(URI);

/* payload */

function DataPacket(device, time, data) {
	this.device = device || 'device';
	this.time = time || '';
	this.data = data || {};
	this.uri = URI;
}

/* transfer os information */

function RecordData(hostname, cpuinfo, osplatform, arch) {
	this.hostname = hostname || os.hostname();
	this.cpuinfo = cpuinfo || os.cpus()[0].model;
	this.osplatform = osplatform || os.platform();
	this.arch = arch || os.arch();
} 

var payload = new DataPacket('Testing device', 
	new Date().toISOString().replace(/T/,' ').replace(/\..+/, ''), 
	new RecordData());

req.write(JSON.stringify(payload));

req.on('response', function(res) {
	res.pipe(process.stdout);
	res.on('end', function() {
		console.log('close response');
		process.exit(0);
	});
});

req.end();

console.log('close request');
