export interface WorldState {
    player: Entity;
    entities: Entity[];
}

export interface Entity {
    id: number;
    pos: Vec2;
}

export interface Vec2 {
    x: number;
    y: number;
}