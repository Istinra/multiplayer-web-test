import {Player} from "./entity";
import Pallet from "./images/eh0.png";

export class Renderer {

    constructor(private ctx: CanvasRenderingContext2D) {
    }

    public drawBackground(): void {
        let image = new Image();
        image.src = Pallet;
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0, 0, 600, 600);
        this.ctx.drawImage(image, 0, 0);
    }

    public drawEntities(p: Player): void {
        this.ctx.fillStyle = "white";
        this.ctx.fillRect(p.position.x, p.position.y, 8, 8);
    }
}