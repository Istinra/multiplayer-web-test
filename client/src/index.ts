import {Vec2, WorldState} from "../../shared/src/shared-state";
import {MovePlayer, Packet, PacketType} from "../../shared/src/packets";

import Pallet from "./images/eh0.png";

const canvas = document.getElementById("renderTarget") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

// const socket: WebSocket = new WebSocket("ws://" + location.host + "/");

const state: WorldState = {
    player: {
        id: -1,
        pos: {
            x: 0,
            y: 0
        }
    },
    entities: []
};

function drawBg() {
    let image = new Image();
    image.src = Pallet;
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, 600, 600);
    ctx.drawImage(image, 0, 0);
}

function drawPlayer() {
    ctx.fillStyle = "white";
    ctx.fillRect(state.player.pos.x, state.player.pos.y, 10, 10);
}

function drawEntities() {
    ctx.fillStyle = "red";
    for (let entity of state.entities) {
        ctx.fillRect(entity.pos.x, entity.pos.y, 10, 10);
    }
}

function frame() {
    drawBg();
    drawPlayer();
    drawEntities();
    window.requestAnimationFrame(frame);
}

window.requestAnimationFrame(frame);

// socket.onmessage = message => {
//     const event: Packet = JSON.parse(message.data);
//     switch (event.type) {
//         case PacketType.ON_CONNECT_TO_SERVER:
//             state.player.id = event.clientId;
//             state.entities = event.serverState.entities;
//             break;
//         case PacketType.CREATE_ENTITY:
//             state.entities.push(event.entity);
//             break;
//         case PacketType.DESTROY_ENTITY:
//             state.entities.splice(state.entities.findIndex(e => e.id === event.entityId), 1);
//             break;
//         case PacketType.UPDATE_ENTITY:
//             state.entities[state.entities.findIndex(e => e.id === event.entity.id)] = event.entity;
//             break;
//     }
// };

function movePlayer(pos: Vec2): void {
    state.player.pos = pos;
    const event: MovePlayer = {
        type: PacketType.MOVE_PLAYER,
        id: state.player.id,
        pos: pos
    };
    // socket.send(JSON.stringify(event));
}

document.addEventListener("keydown", (event: KeyboardEvent) => {
    if (event.key === "a") {
        movePlayer({
            x: state.player.pos.x - 10,
            y: state.player.pos.y
        });
    }
    if (event.key === "d") {
        movePlayer({
            x: state.player.pos.x + 10,
            y: state.player.pos.y
        });
    }
    if (event.key === "w") {
        movePlayer({
            x: state.player.pos.x,
            y: state.player.pos.y - 10
        });
    }
    if (event.key === "s") {
        movePlayer({
            x: state.player.pos.x,
            y: state.player.pos.y + 10
        });
    }
});