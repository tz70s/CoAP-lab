# CoAP-lab
CoAP - Node.js practice

### Installation

``` Bash
# Save dependencies
npm install coap --save
# Without
npm install coap
```

### Exp1 - simple coap client-server architecture

Basic practice of simple coap node api

### Exp2 - observation mode

Practice of observation mode

### Exp3 - Multiple devices monitoring based on CoAP observation mode

The experiment based on CoAP observation mode to retrieve data : os information and network connection. The architecture is a CoAP client and multiple server-node ( sensing device ).

* External installation

``` Bash
npm install socket.io --save
```

* Execute

``` Bash
# on devices
node server_node.js

# pre-config IP address
# on http server
node observ_client.js
```

