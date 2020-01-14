import {Player} from "./entity";
import {MapArea, World, WorldState} from "./game";

export class Renderer {

    private active = new Image();
    private north = new Image();
    private south = new Image();
    private east = new Image();
    private west = new Image();

    private activeMapId: number = -1;

    private activeMap: MapArea;

    constructor(private ctx: CanvasRenderingContext2D,
                private world: World,
                private widthHeight: number) {
        this.activeMap = this.world[0];
        this.setActiveMap(0);
    }

    public setActiveMap(activeMapId: number): void {
        if (activeMapId === this.activeMapId) {
            return;
        }
        this.activeMapId = activeMapId;
        this.activeMap = this.world[activeMapId];
        this.active.src = "data:image/png;base64," + this.activeMap.imageData;
        if (this.activeMap.northMap) {
            let northMap = this.world[this.activeMap.northMap.mapId];
            this.north.src = "data:image/png;base64," + northMap.imageData;
        }
        if (this.activeMap.southMap) {
            let southMap = this.world[this.activeMap.southMap.mapId];
            this.south.src = "data:image/png;base64," + southMap.imageData;
        }
        if (this.activeMap.eastMap) {
            let eastMap = this.world[this.activeMap.eastMap.mapId];
            this.east.src = "data:image/png;base64," + eastMap.imageData;
        }
        if (this.activeMap.westMap) {
            let westMap = this.world[this.activeMap.westMap.mapId];
            this.west.src = "data:image/png;base64," + westMap.imageData;
        }

    }

    public draw(state: WorldState): void {
        const centre = this.widthHeight / 2 + 8;
        this.drawBackground(state.player, centre);
        this.drawEntities(state.player, centre);
    }

    public drawBackground(p: Player, centre: number): void {
        this.ctx.fillRect(0, 0, 600, 600);
        const px = p.position.x * 16;
        const py = p.position.y * 16;
        this.ctx.drawImage(this.active, centre - px, centre - py);

        if (this.activeMap.northMap) {
            let northMap = this.world[this.activeMap.northMap.mapId];
            this.ctx.drawImage(
                this.north, centre - px + this.activeMap.northMap.offset,
                centre - py - northMap.height * 16
            );
        }
        if (this.activeMap.southMap) {
            this.ctx.drawImage(
                this.south, centre - px + this.activeMap.southMap.offset,
                centre - py + this.activeMap.height * 16
            );
        }
    }

    public drawEntities(p: Player, centre: number): void {
        this.ctx.fillStyle = "red";
        this.ctx.fillRect(centre, centre, 16, 16);
    }
}