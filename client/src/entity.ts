import {Direction} from "./game";
import {Vec2} from "../../shared/src/shared-state";

export class Entity {
    id: number;
    mapIndex: number = 0;
    position: Vec2 = {x: 7, y: 7};

    constructor(id: number) {
        this.id = id;
    }
}

export enum PlayerState {
    STILL,
    MOVING
}

export class Player extends Entity {
    facing: Direction = Direction.SOUTH;
    state: PlayerState = PlayerState.STILL;
    target?: Vec2;

    public move(direction: Direction): void {
        if (this.state === PlayerState.STILL) {
            this.state = PlayerState.MOVING;
            this.facing = direction;
            switch (direction) {
                case Direction.NORTH:
                    this.target = {x: this.position.x, y: this.position.y - 1};
                    break;
                case Direction.SOUTH:
                    this.target = {x: this.position.x, y: this.position.y + 1};
                    break;
                case Direction.EAST:
                    this.target = {x: this.position.x + 1, y: this.position.y};
                    break;
                case Direction.WEST:
                    this.target = {x: this.position.x - 1, y: this.position.y};
                    break;

            }
        }
    }

    public stop(collision: boolean): void {
        if (this.state === PlayerState.MOVING) {
            this.state = PlayerState.STILL;
            if (this.target && !collision) {
                this.position = this.target;
            } else {
                this.position.x = Math.round(this.position.x);
                this.position.y = Math.round(this.position.y);
            }
        }
    }
}

export class WarpPoint extends Entity {
    toMapIndex: number;
    toPosition: Vec2;

    constructor(id: number, toMapIndex: number, toPosition: Vec2) {
        super(id);
        this.toMapIndex = toMapIndex;
        this.toPosition = toPosition;
    }
}