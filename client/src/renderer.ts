import {Player} from "./entity";
import {MapArea} from "./game";

let world = require("./world.json");

export class Renderer {

    private maps: { [key: number]: MapArea };


    constructor(private ctx: CanvasRenderingContext2D) {
        this.maps = world
    }

    public drawBackground(): void {

        let image = new Image();
        image.src = "data:image/png;base64," + this.maps[0].imageData;
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0, 0, 600, 600);
        this.ctx.drawImage(image, 0, 0);
    }

    public drawEntities(p: Player): void {
        this.ctx.fillStyle = "white";
        this.ctx.fillRect(p.position.x, p.position.y, 8, 8);
    }
}