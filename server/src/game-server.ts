import {MovePlayer} from "../../shared/src/packets";
import {WorldState} from "../../shared/src/shared-state";

export class GameServer {

    public worldState: WorldState = {
        playerPos: {x: 0, y: 0}
    };

    public onMessage(message: MovePlayer): void {
        this.worldState.playerPos = message.pos;
    }
}