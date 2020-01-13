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
    target?: Vec2;

    public move(direction: Direction): void {
        if (this.state === PlayerState.STILL) {
            this.state = PlayerState.MOVING;
            this.facing = direction;
            switch (direction) {
                case Direction.NORTH:
                    this.target = {x: this.position.x, y: this.position.y - 16};
                    break;
                case Direction.SOUTH:
                    this.target = {x: this.position.x, y: this.position.y + 16};
                    break;
                case Direction.EAST:
                    this.target = {x: this.position.x + 16, y: this.position.y};
                    break;
                case Direction.WEST:
                    this.target = {x: this.position.x - 16, y: this.position.y};
                    break;

            }
        }
    }

    public stop(): void {
        if (this.state === PlayerState.MOVING) {
            this.state = PlayerState.STILL;
            if (this.target) {
                this.position = this.target;
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