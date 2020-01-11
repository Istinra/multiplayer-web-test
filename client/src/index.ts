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
        switch (player.facing) {
            case Direction.NORTH:
                if (willCollide(mapArea, 0, 16)) {

                }
                player.position.y += (dt / 50);
                break;
            case Direction.SOUTH:
                if (willCollide(mapArea, 0, -16)) {

                }
                player.position.y -= (dt / 50);
                break;
            case Direction.EAST:
                if (willCollide(mapArea, 16, 0)) {

                }
                player.position.x += (dt / 50);
                break;
            case Direction.WEST:
                if (willCollide(mapArea, -16, 0)) {

                }
                player.position.x -= (dt / 100);
                break;
        }
    }
}

function willCollide(mapArea: MapArea, xMov: number, yMov: number): boolean {
    let xcheck = Math.floor((player.position.x + xMov) / 16);
    let ycheck = Math.floor((player.position.y + yMov) / 16);
    return mapArea.collisionData[mapArea.width * ycheck + xcheck] === 0;
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