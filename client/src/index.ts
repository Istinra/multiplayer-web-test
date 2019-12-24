import {Vec2, WorldState} from "../../shared/src/shared-state";
import {MovePlayer} from "../../shared/src/packets";

const canvas = document.getElementById("renderTarget") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

const socket: WebSocket = new WebSocket("ws://" + location.host + "/");

const state: WorldState = {
    playerPos: {
        x: 0,
        y: 0
    }
};

function drawBg() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, 600, 600);
}

function drawPlayer() {
    ctx.fillStyle = "white";
    ctx.fillRect(state.playerPos.x, state.playerPos.y, 10, 10);
}

function frame(dt: number) {
    drawBg();
    drawPlayer();
    window.requestAnimationFrame(frame);
}

window.requestAnimationFrame(frame);

socket.onmessage = message => {
  let parse = JSON.parse(message.data) as MovePlayer;
};

function movePlayer(pos: Vec2): void {
    state.playerPos = pos;
    const event: MovePlayer = {
        pos: pos
    };
    socket.send(JSON.stringify(event));
}

document.addEventListener("keydown", (event: KeyboardEvent) => {
    if (event.key === "a") {
        movePlayer({
           x: state.playerPos.x - 10,
           y: state.playerPos.y
        });
    }
    if (event.key === "d") {
        movePlayer({
            x: state.playerPos.x + 10,
            y: state.playerPos.y
        });
    }
    if (event.key === "w") {
        movePlayer({
            x: state.playerPos.x,
            y: state.playerPos.y - 10
        });
    }
    if (event.key === "s") {
        movePlayer({
            x: state.playerPos.x,
            y: state.playerPos.y + 10
        });
    }
});