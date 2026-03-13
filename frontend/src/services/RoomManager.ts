import { Err, Ok, Result } from "./Utilities";

export class Player {
    name: string;
    isHost: boolean;

    constructor(name: string, isHost: boolean) {
        this.name = name;
        this.isHost = isHost;
    } 
}

export class RoomManager {
    public isInRoom: boolean;
    public roomId: string | undefined;
    public playerList: Array<Player>;
    
    constructor() {
        this.isInRoom = false;
        this.playerList = [];
    }

    public createRoom(username: string, playerCount: number): Result<void> {
        if (playerCount > 6 || playerCount < 2) {
            return Err("Niepoprawna ilosc graczy");
        }

        if (username.length > 20 || username.length < 3) {
            return Err("Niepoprawny username");
        }

        // Ws request do websocketow i potem stworz z tego pokoj

        return Ok(undefined)
    }
    
    public addPlayer(player: Player): void {
        this.playerList.push(player);
    }

    public removePlayer(playerName: string) {
        let player = this.playerList.find((p) => p.name === playerName);
        if (!player) {
            console.warn(`Gracz o nazwie ${playerName} nie istnieje`);
            return;
        }
        this.playerList = this.playerList.filter(p => p.name !== playerName);
    }
}