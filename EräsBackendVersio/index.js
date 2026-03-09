import { Socket } from 'node:dgram';
import http, { globalAgent } from 'node:http';
import * as fs from 'node:fs';
import crypto from 'crypto';

const server = http.createServer();

server.on('request', (request, res) => {
    console.log(request.method);
    console.log("=======REQUEST==================");
    console.log(request.url);
    let data;
    try {
  data = fs.readFileSync('./index.html', 'utf8');
  //console.log(data);
    } catch (err) {
        console.error(err);
    }
  
  res.end(data);
});


function generateAcceptValue(key) {
    const MAGIC_STRING = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11";
    
    return crypto
        .createHash('sha1')
        .update(key + MAGIC_STRING)
        .digest('base64');
}
let wssocket=null;
server.on('upgrade', (req, socket, head) => {
    console.log("upgrade header");
    wssocket=socket;
    console.log(socket);
    console.log(req.headers['sec-websocket-key']);
    console.log(generateAcceptValue(req.headers['sec-websocket-key']));

  socket.write('HTTP/1.1 101 Web Socket Protocol Handshake\r\n' +
               'Upgrade: WebSocket\r\n' +
               'Connection: Upgrade\r\n' +
               'Sec-WebSocket-Accept:'+generateAcceptValue(req.headers['sec-websocket-key'])+'\r\n'+
               '\r\n');

  //socket.pipe(socket); // echo back kaikki clientilta tulevat viestit
  socket.on('data',()=>{console.log("echo\n");console.log("echo\n");console.log(socket);});
});



server.on('connection', (socket) => {
    console.log("tcp connection");
    console.log("socket "+socket.remoteAddress+" "+socket.remotePort+" "+socket.remoteFamily+" ");
    socket.on('close',()=>{console.log("socket closed "+socket.remotePort);});
    //console.log(socket);
  
});

server.on('close', () => {
    console.log("close");
  
});



server.listen(8000, () => {
  console.log('opened server on', server.address());});


setInterval(()=>{
    console.log("----------------");
    server.getConnections((err,count)=>{
        console.log(count);
        console.log(wssocket);
        console.log(wssocket.remoteAddress);
        console.log(count);
    });
    wssocket.write(Buffer.concat([Buffer.from([0x81, 0x03]), Buffer.from("moi")]));
    
    
},10000);