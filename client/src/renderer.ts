import {Player} from "./entity";
import {World} from "./game";

export class Renderer {



    constructor(private ctx: CanvasRenderingContext2D, private world: World) {
    }

    public drawBackground(): void {

        let image = new Image();
        image.src = "data:image/png;base64," + this.world[0].imageData;
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0, 0, 600, 600);
        this.ctx.drawImage(image, 0, 0);
    }

    public drawEntities(p: Player): void {
        this.ctx.fillStyle = "white";
        this.ctx.fillRect(p.position.x, p.position.y, 16, 16);
    }
}