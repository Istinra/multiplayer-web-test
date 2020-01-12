import {Direction} from "./game";
import {Vec2} from "../../shared/src/shared-state";

export class Entity {
    id: number;
    mapIndex: number = 0;
    position: Vec2 = {x: 112, y: 112};

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

    public move(direction: Direction): void {
        if (this.state === PlayerState.STILL) {
            this.state = PlayerState.MOVING;
            this.facing = direction;
        }
    }

    public stop(): void {
        if (this.state === PlayerState.MOVING && this.position.x % 16 < 0.001 && this.position.y % 16 < 0.001) {
            this.state = PlayerState.STILL;
            this.position.x = Math.floor(this.position.x);
            this.position.y = Math.floor(this.position.y);
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