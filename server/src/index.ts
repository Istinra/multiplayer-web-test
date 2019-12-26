import * as express from 'express';
import * as http from 'http';
import * as WebSocket from 'ws';
import {GameServer} from "./game-server";
import {PacketType} from "../../shared/src/packets";
import {Entity} from "../../shared/src/shared-state";

const app = express();

const server = http.createServer(app);
// app.get('/request', (req: Request, res: Response) => res.send('Hello World!'));
app.use(express.static('../client/dist'));

const gs = new GameServer();

const wss = new WebSocket.Server({server});

const clientTable: { [key: number]: WebSocket } = {};

let clientCount = 0;

wss.on('connection', (ws: WebSocket) => {
    const clientId = clientCount++;
    clientTable[clientId] = ws;

    //Notify client of their ID
    ws.send(JSON.stringify({
        type: PacketType.ON_CONNECT_TO_SERVER,
        clientId: clientId,
        serverState: gs.worldState
    }));

    //Notify other clients of the new player
    const entity: Entity = {
        id: clientId,
        pos: {x: 0, y: 0}
    };
    gs.addEntity(entity);
    let createEntityMessage = JSON.stringify({
        type: PacketType.CREATE_ENTITY,
        entity: entity
    });
    for (let client of wss.clients) {
        if (client !== ws) {
            client.send(createEntityMessage);
        }
    }

    ws.on('message', (message: string) => {
        let entity = gs.onClientMove(JSON.parse(message));
        if (entity) {
            let update = JSON.stringify({
                type: PacketType.UPDATE_ENTITY,
                entity: entity
            });
            for (let client of wss.clients) {
                if (client !== ws) {
                    client.send(update);
                }
            }
        }

    });

    ws.on('close', () => {
        gs.removeEntity(clientId);
        let destroyEntityMessage = JSON.stringify({
            type: PacketType.DESTROY_ENTITY,
            entityId: clientId
        });
        for (let client of wss.clients) {
            if (client !== ws) {
                client.send(destroyEntityMessage);
            }
        }
    });
});

server.listen(process.env.PORT || 3000, () => {
    //@ts-ignore
    console.log(`Server started on port ${server.address().port} :)`);
});