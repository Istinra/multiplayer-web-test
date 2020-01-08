import {Direction} from "./game";
import {Vec2} from "../../shared/src/shared-state";

export class Entity {
    id: number;
    mapIndex: number = 0;
    position: Vec2 = {x: 0, y: 0};

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