//Input Handler to translate keys presses into events and forward event onto game
//Network Handler to accept incoming events from the server and translate them into game events
//Game main container for all entities in the game including the player, enforces game rules
/// Player updated by input handler
/// Entities updated by network, includes other players and warp points
//Renderer accepts the state of the game and attempts to render an the world, players and entities
//Build
//1 State design
///Outline structure of entities
//2 Game Main Controller
///1 Process Inputs from Keyboard + Network
///2 Update individual Entity State
///3 Check World for collisions and run movement/physics simulation
///4 Check if the world needs to be transitioned to a new map
//3 Input Handler
//4 Player

export enum Direction {
    NORTH,
    SOUTH,
    EAST,
    WEST
}
