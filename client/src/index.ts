import {State} from "./state";

const canvas = document.getElementById("renderTarget") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

const state: State = {
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

document.addEventListener("keydown", (event: KeyboardEvent) => {
    if (event.key === "a") {
        state.playerPos.x -= 10;
    }
    if (event.key === "d") {
        state.playerPos.x += 10;
    }
    if (event.key === "w") {
        state.playerPos.y -= 10;
    }
    if (event.key === "s") {
        state.playerPos.y += 10;
    }
});