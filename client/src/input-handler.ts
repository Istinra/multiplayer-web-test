import {Direction} from "./game";
import {Player} from "./entity";

export class InputHandler {

    private activeDirection: Direction = Direction.SOUTH;
    private active: boolean = false;

    public applyInputs(player: Player): void {
        if (this.active) {
            player.move(this.activeDirection);
        } else {
            player.stop();
        }
    }

    public keyDown(key: string): void {
        if (key === "a") {
            this.activeDirection = Direction.WEST;
            this.active = true;
        }
        if (key === "d") {
            this.activeDirection = Direction.EAST;
            this.active = true;
        }
        if (key === "w") {
            this.activeDirection = Direction.NORTH;
            this.active = true;
        }
        if (key === "s") {
            this.activeDirection = Direction.SOUTH;
            this.active = true;
        }
    }

    public keyUp(key: string): void {
        if (key === "a") {
            if (this.activeDirection === Direction.WEST) {
                this.active = false;
            }
        }
        if (key === "d") {
            if (this.activeDirection === Direction.EAST) {
                this.active = false;
            }
        }
        if (key === "w") {
            if (this.activeDirection === Direction.NORTH) {
                this.active = false;
            }
        }
        if (key === "s") {
            if (this.activeDirection === Direction.SOUTH) {
                this.active = false;
            }
        }
    }

}