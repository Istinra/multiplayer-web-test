import {InputHandler} from "./input-handler";
import {Player, PlayerState} from "./entity";
import {Renderer} from "./renderer";
import {Direction, MapArea, World, WorldState} from "./game";
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
        let target = state.player.target;
            if (willCollide(mapArea, target, world)) {
            state.player.stop(true);
        } else {
            switch (state.player.facing) {
                case Direction.NORTH:
                    position.y -= (dt / 150);
                    if (position.y < state.player.target.y) {
                        state.player.stop(false);
                        if (position.y < 0 && mapArea.northMap) {
                            let mapId = mapArea.northMap.mapId;
                            state.activeMap = mapId;
                            state.player.position.y = world[mapId].height;
                            state.player.position.x -= mapArea.northMap.offset;
                        }
                    }
                    break;
                case Direction.SOUTH:
                    position.y += (dt / 150);
                    if (position.y > state.player.target.y) {
                        state.player.stop(false);
                        if (position.y >= mapArea.height && mapArea.southMap) {
                            state.activeMap = mapArea.southMap.mapId;
                            state.player.position.y = 0;
                            state.player.position.x -= mapArea.southMap.offset;
                        }
                    }
                    break;
                case Direction.EAST:
                    position.x += (dt / 150);
                    if (position.x > state.player.target.x) {
                        state.player.stop(false);
                    }
                    break;
                case Direction.WEST:
                    position.x -= (dt / 150);
                    if (position.x < state.player.target.x) {
                        state.player.stop(false);
                    }
                    break;
            }
        }
    }
}

function willCollide(mapArea: MapArea, target: Vec2, world: World): boolean {
    if (target.y < 0) {
        if (mapArea.northMap) {
            let northMap = world[mapArea.northMap.mapId];
            return northMap.collisionData[northMap.width * (northMap.height - 1) + target.x + mapArea.northMap.offset] === 0;
        }
        return true;
    }
    return mapArea.collisionData[mapArea.width * target.y + target.x] === 0;
}

function frame(totalTime: number) {
    const dt = totalTime - lastFrame;
    lastFrame = totalTime;
    inputHandler.applyInputs(state.player);
    doPhysics(dt, world[state.activeMap]);
    renderer.setActiveMap(state.activeMap);
    renderer.draw(state);
    window.requestAnimationFrame(frame);
}

window.requestAnimationFrame(frame);

document.addEventListener("keydown", (event: KeyboardEvent) => inputHandler.keyDown(event.key));
document.addEventListener("keyup", (event: KeyboardEvent) => inputHandler.keyUp(event.key));