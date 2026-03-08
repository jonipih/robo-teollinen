import express from  'express';
import { WebSocketServer } from 'ws';
import http from 'node:http';
import * as fs from 'node:fs';//ei käytössä
import path from 'node:path';
import cors from 'cors';
import { Socket } from 'node:net';


const app = express();
app.use(express.json()); // Parses JSON request bodies
app.use(cors());//tarvitaan vain kehitysvaiheessa ja testauksessa
const port = 3000;

// Standard HTTP Route
app.get('/', (req, res) => {
  res.send('Hello! This is an HTTP response.');
});

app.get('/wstesti', (req, res) => {
  res.send(fs.readFileSync('./index.html', 'utf8'));
});

// app.get('/myScript.js', (req, res) => {// tässä pitää laittaa erikseen headerit
//     res.set('Content-Type', 'text/javascript; charset=utf-8');
//   res.send(fs.readFileSync('./myScript.js', 'utf8'));
// });
app.get('/:file', (req, res) => {
    
        console.log("try alku");
        console.log(path.resolve(req.params.file));
        res.sendFile(path.resolve(req.params.file),(err) => {
    if (err) {
      res.sendStatus(404);//equivalent to res.status(404).send('Not Found')
    } else {
      console.log('Sent:', req.params.file);
      
    }
  });
  
        
    
});

app.get('/test/:file', (req, res) => {
    console.log(req.params.file);
    console.log(path.resolve(req.params.file));
    console.log(path.resolve('./'));
  res.sendFile(path.resolve('./')+'/test/'+req.params.file,(err) => {
    if (err) {
      res.sendStatus(404);
    } else {
      console.log('Sent:', req.params.file)
    }
  });



});

//post metodi pitää olla content-type:application/json ja body {"arvostr":"str", "arvonum":22,   }
app.post('/abbdata', (req, res, next) => {
  console.log(req.body);
//   req.on('data', (data)=>{  //ilman middlewarea datan lukeminen
//     console.log(   typeof(JSON.parse(decodeURIComponent(data))  )   );
//     console.log(   JSON.parse(decodeURIComponent(data)  )   );
// });
  
  //console.log(req);
        wss.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(req.body));
                
                //client.send("hello from post");
                console.log("post lähettää websoketilla req.body tyyppi ",typeof(req.body) );            
            }
            });

  res.json(req.body);
});

// 1. Create the HTTP server using the Express app
const server = http.createServer(app);

// 2. Initialize the WebSocket server instance
const wss = new WebSocketServer({ server });

// 3. Handle WebSocket connections
wss.on('connection', (ws) => {
  console.log('New client connected via WebSocket');
  console.log(wss.clients);

  ws.on('message', (message) => {
    console.log(`Received: ${message}`);
    ws.send(`Echo: ${message}`);

  });

  ws.on('close', () => console.log('Client disconnected'));
});

// 4. Start the server
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});