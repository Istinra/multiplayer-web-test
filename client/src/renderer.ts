import {Player} from "./entity";
import {World} from "./game";

export class Renderer {

    private active = new Image();

    constructor(private ctx: CanvasRenderingContext2D,
                private world: World,
                private widthHeight: number) {
        this.active.src = "data:image/png;base64," + this.world[0].imageData;
    }

    public draw(p: Player): void {
        const centre = this.widthHeight / 2 + 8;
        this.drawBackground(p, centre);
        this.drawEntities(p, centre);
    }

    public drawBackground(p: Player, centre: number): void {
        this.ctx.fillRect(0, 0, 600, 600);
        this.ctx.drawImage(this.active, centre - p.position.x, centre - p.position.y);
    }

    public drawEntities(p: Player, centre: number): void {
        this.ctx.fillStyle = "white";
        this.ctx.fillRect(centre, centre, 16, 16);
    }
}