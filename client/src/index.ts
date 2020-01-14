import {InputHandler} from "./input-handler";
import {Player, PlayerState} from "./entity";
import {Renderer} from "./renderer";
import {Direction, MapArea, WorldState} from "./game";
import {Vec2} from "../../shared/src/shared-state";

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
    if (state.player.state === PlayerState.MOVING && state.player.target) {
        let position = state.player.position;
        switch (state.player.facing) {
            case Direction.NORTH:
                if (willCollide(mapArea, position, 0, -16)) {
                    state.player.stop(true);
                } else {
                    position.y -= (dt / 50);
                    if (position.y < state.player.target.y) {
                        state.player.stop(false);
                    }
                }
                break;
            case Direction.SOUTH:
                if (willCollide(mapArea, position, 0, 16)) {
                    state.player.stop(true);
                } else {
                    position.y += (dt / 50);
                    if (position.y > state.player.target.y) {
                        state.player.stop(false);
                    }
                }
                break;
            case Direction.EAST:
                if (willCollide(mapArea, position, 16, 0)) {
                    state.player.stop(true);
                } else {
                    position.x += (dt / 50);
                    if (position.x > state.player.target.x) {
                        state.player.stop(false);
                    }
                }
                break;
            case Direction.WEST:
                if (willCollide(mapArea, position, -16, 0)) {
                    state.player.stop(true);
                } else {
                    position.x -= (dt / 50);
                    if (position.x < state.player.target.x) {
                        state.player.stop(false);
                    }
                }
                break;
        }

    }
}

function willCollide(mapArea: MapArea, pos: Vec2, xMov: number, yMov: number): boolean {
    let xCheck = Math.floor((pos.x + xMov) / 16);
    let yCheck = Math.floor((pos.y + yMov) / 16);
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