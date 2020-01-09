import {Player} from "./entity";
import world from "./world.json";
import {MapArea} from "./game";

export class Renderer {

    private maps: { [key: number]: MapArea};


    constructor(private ctx: CanvasRenderingContext2D) {
        const a: any = world;
        this.maps = JSON.parse(world);
    }

    public drawBackground(): void {

        let image = new Image();
        // image.src = Pallet;
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0, 0, 600, 600);
        this.ctx.drawImage(image, 0, 0);
    }

    public drawEntities(p: Player): void {
        this.ctx.fillStyle = "white";
        this.ctx.fillRect(p.position.x, p.position.y, 8, 8);
    }
}