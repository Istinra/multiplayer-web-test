import * as express from 'express';
import * as http from 'http';
import * as WebSocket from 'ws';
import {GameServer} from "./game-server";

const app = express();
const port = 3000;

const server = http.createServer(app);
// app.get('/request', (req: Request, res: Response) => res.send('Hello World!'));
app.use(express.static('../client/dist'));
app.listen(port, () => console.log(`Example app listening on port ${port}!`));

const gs = new GameServer();

const wss = new WebSocket.Server({server});

wss.on('connection', (ws: WebSocket) => {
    ws.on('message', (message: string) => {
        gs.onMessage(JSON.parse(message));
        for (let client of wss.clients) {
            if (client !== ws) {
                client.send(message);
            }
        }
    });
});

server.listen(process.env.PORT || 3000, () => {
    //@ts-ignore
    console.log(`Server started on port ${server.address().port} :)`);
});