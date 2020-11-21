#!/usr/bin/env node
var minimist = require('minimist')
var dedent = require('dedent')
var websocket = require('websocket-stream')
var QuickLRU = require('quick-lru');
const swarm = new QuickLRU({maxSize: 1000});

var utils = require('./utils.js');
var help = dedent`
    Usage: echocha <topic> <optional server>
    Examples:
      echo hello | echocha test123
`
var args = minimist(process.argv.slice(2))

// Join Echo Room
var uuid = utils.uuid();
var topic = args._[0] || 'depijp';
var room = args._[1] || 'wss://de.meething.space:443/'+topic;
var mesh = websocket(room, {perMessageDeflate: false })

// Create Pub UUID
var pub = utils.uuid();
var pubSocket = websocket(room+pub, {perMessageDeflate: false, binary: true})
var hello = { uuid: uuid, room: room, pub: pub, type: 0 };
var start = mesh.write(Buffer.from(JSON.stringify(hello)));

// Create Sub UUIDs
var pipe = false;
mesh.on('data', function(data){
  // STDIN input to PubSocket
  if (!pipe) { process.stdin.pipe(pubSocket); pipe = true; }
  try {
	var msg = JSON.parse(data);
	if (!msg.uuid || msg.uuid == uuid) return;
	if (swarm.has(msg.uuid)){
		if (msg.pub == false) swarm.delete(msg.uuid);
	} else {
		var subSocket = websocket(room+msg.pub);
		subSocket.on('end', () => { process.exit(); })
		subSocket.pipe(process.stdout);
		swarm.set(msg.uuid, subSocket);
		mesh.write(Buffer.from(JSON.stringify(hello)));
	}
  } catch(e) { console.log(e) }

})

mesh.on('end', () => {
  // reconnect on end
  mesh = websocket(room, {perMessageDeflate: false })
});

process.on('SIGINT', function() {
    hello.pub = false;
    var exit = mesh.write(Buffer.from(JSON.stringify(hello)));
    process.exit();
});
