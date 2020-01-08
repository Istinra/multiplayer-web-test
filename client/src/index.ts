import {InputHandler} from "./input-handler";
import {Player, PlayerState} from "./entity";
import {Renderer} from "./renderer";
import {Direction} from "./game";

const inputHandler = new InputHandler();

const player = new Player(0);

const canvas = document.getElementById("renderTarget") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
const renderer = new Renderer(ctx);

let lastFrame = 0;

function doPhysics(dt: number) {
    if (player.state === PlayerState.MOVING) {
        switch (player.facing) {
            case Direction.NORTH:
                player.position.y += (dt / 100);
                break;
            case Direction.SOUTH:
                player.position.y -= (dt / 100);
                break;
            case Direction.EAST:
                player.position.x += (dt / 100);
                break;
            case Direction.WEST:
                player.position.x -= (dt / 100);
                break;
        }
    }
}

function frame(totalTime: number) {
    const dt = totalTime - lastFrame;
    lastFrame = totalTime;
    inputHandler.applyInputs(player);
    doPhysics(dt);
    renderer.drawBackground();
    renderer.drawEntities(player);
    window.requestAnimationFrame(frame);
}

window.requestAnimationFrame(frame);

document.addEventListener("keydown", (event: KeyboardEvent) => inputHandler.keyDown(event.key));
document.addEventListener("keyup", (event: KeyboardEvent) => inputHandler.keyUp(event.key));