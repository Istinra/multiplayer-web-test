import {InputHandler} from "./input-handler";
import {Player} from "./entity";
import {Renderer} from "./renderer";

const inputHandler = new InputHandler();

const player = new Player(0);

const canvas = document.getElementById("renderTarget") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
const renderer = new Renderer(ctx);

function doPhysics(dt: number) {

}

function frame(dt: number) {
    inputHandler.applyInputs(player);
    doPhysics(dt);
    renderer.drawBackground();
    renderer.drawEntities(player);
    window.requestAnimationFrame(frame);
}

window.requestAnimationFrame(frame);

document.addEventListener("keydown", (event: KeyboardEvent) => inputHandler.keyDown(event.key));
document.addEventListener("keyup", (event: KeyboardEvent) => inputHandler.keyUp(event.key));