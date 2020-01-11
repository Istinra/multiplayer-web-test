import {InputHandler} from "./input-handler";
import {Player, PlayerState} from "./entity";
import {Renderer} from "./renderer";
import {Direction, MapArea} from "./game";

let world = require("./world.json");

const inputHandler = new InputHandler();

const player = new Player(0);

const canvas = document.getElementById("renderTarget") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
const renderer = new Renderer(ctx, world);

let lastFrame = 0;

function doPhysics(dt: number, mapArea: MapArea) {
    if (player.state === PlayerState.MOVING) {
        let xMod = 0, yMod = 0;
        switch (player.facing) {
            case Direction.NORTH:
                yMod = 1;
                break;
            case Direction.SOUTH:
                yMod = -1;
                break;
            case Direction.EAST:
                xMod = 1;
                break;
            case Direction.WEST:
                xMod = -1;
                break;
        }
        if (willCollide(mapArea, xMod * 16, yMod * 16)) {
            player.stop()
        } else {
            player.position.x += (dt / 100) * xMod;
            player.position.y += (dt / 100) * yMod;
        }
    }
}

function willCollide(mapArea: MapArea, xMov: number, yMov: number): boolean {
    let xCheck = Math.floor((player.position.x + xMov) / 16);
    let yCheck = Math.floor((player.position.y + yMov) / 16);
    return mapArea.collisionData[mapArea.width * yCheck + xCheck] === 0;
}

function frame(totalTime: number) {
    const dt = totalTime - lastFrame;
    lastFrame = totalTime;
    inputHandler.applyInputs(player);
    doPhysics(dt, world[0]);
    renderer.drawBackground();
    renderer.drawEntities(player);
    window.requestAnimationFrame(frame);
}

window.requestAnimationFrame(frame);

document.addEventListener("keydown", (event: KeyboardEvent) => inputHandler.keyDown(event.key));
document.addEventListener("keyup", (event: KeyboardEvent) => inputHandler.keyUp(event.key));