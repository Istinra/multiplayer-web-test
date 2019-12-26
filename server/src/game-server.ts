import {Packet, PacketType} from "../../shared/src/packets";
import {Entity, WorldState} from "../../shared/src/shared-state";

export class GameServer {

    public worldState: WorldState = {
        player: {
            id: -1,
            pos: {x: 0, y: 0}
        },
        entities: []
    };

    public addEntity(entity: Entity): void {
        this.worldState.entities.push(entity);
    }

    public removeEntity(id: number) {
        this.worldState.entities.splice(this.worldState.entities.findIndex(e => e.id === id), 1);
    }

    public onClientMove(message: Packet): Entity | undefined {
        if (message.type === PacketType.MOVE_PLAYER) {
            const player = this.worldState.entities.find(e => e.id === message.id);
            if (player) {
                player.pos = message.pos;
            }
            return player;
        }
    }
}