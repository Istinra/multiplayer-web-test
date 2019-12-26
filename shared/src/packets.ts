import {Entity, Vec2, WorldState} from "./shared-state";

export enum PacketType {
    ON_CONNECT_TO_SERVER,
    MOVE_PLAYER,
    CREATE_ENTITY,
    DESTROY_ENTITY,
    UPDATE_ENTITY
}

export interface OnConnectToServer {
    type: typeof PacketType.ON_CONNECT_TO_SERVER;
    clientId: number
    serverState: WorldState;
}

export interface MovePlayer {
    type: typeof PacketType.MOVE_PLAYER;
    id: number;
    pos: Vec2;
}

export interface CreateEntity {
    type: typeof PacketType.CREATE_ENTITY;
    entity: Entity
}

export interface DestroyEntity {
    type: typeof PacketType.DESTROY_ENTITY;
    entityId: number
}

export interface UpdateEntity {
    type: typeof PacketType.UPDATE_ENTITY;
    entity: Entity
}

export type Packet = OnConnectToServer | MovePlayer | CreateEntity | DestroyEntity | UpdateEntity;