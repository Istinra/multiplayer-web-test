import {InputHandler} from "./input-handler";
import {Player, PlayerState} from "./entity";
import {Renderer} from "./renderer";
import {Direction, MapArea, WorldState} from "./game";

let world = require("./world.json");

const inputHandler = new InputHandler();

const state: WorldState = {
    player: new Player(0),
    activeMap: 0
};

const canvas = document.getElementById("renderTarget") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
const renderer = new Renderer(ctx, world, 600);

let lastFrame = 0;

function doPhysics(dt: number, mapArea: MapArea) {
    if (state.player.state === PlayerState.MOVING) {
        let xMod = 0, yMod = 0;
        switch (state.player.facing) {
            case Direction.NORTH:
                yMod = -1;
                break;
            case Direction.SOUTH:
                yMod = 1;
                break;
            case Direction.EAST:
                xMod = 1;
                break;
            case Direction.WEST:
                xMod = -1;
                break;
        }
        if (willCollide(mapArea, xMod * 16, yMod * 16)) {
            state.player.stop()
        } else {
            state.player.position.x += (dt / 50) * xMod;
            state.player.position.y += (dt / 50) * yMod;
        }
    }
}

function willCollide(mapArea: MapArea, xMov: number, yMov: number): boolean {
    let xCheck = Math.floor((state.player.position.x + xMov) / 16);
    let yCheck = Math.floor((state.player.position.y + yMov) / 16);
    return mapArea.collisionData[mapArea.width * yCheck + xCheck] === 0;
}

function frame(totalTime: number) {
    const dt = totalTime - lastFrame;
    lastFrame = totalTime;
    inputHandler.applyInputs(state.player);
    doPhysics(dt, world[0]);
    renderer.draw(state);
    window.requestAnimationFrame(frame);
}

window.requestAnimationFrame(frame);

document.addEventListener("keydown", (event: KeyboardEvent) => inputHandler.keyDown(event.key));
document.addEventListener("keyup", (event: KeyboardEvent) => inputHandler.keyUp(event.key));