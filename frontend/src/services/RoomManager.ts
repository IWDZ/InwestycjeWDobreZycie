import { Err, Ok, Result } from "./Utilities";
import { ws } from "./WebsocketManager";

export class Player {
    name: string;
    isHost: boolean;

    constructor(name: string, isHost: boolean) {
        this.name = name;
        this.isHost = isHost;
    }
}

const DEBUG = true;

export class RoomManager {
    public isInRoom: boolean;
    public isHost: boolean;
    public roomId: string | undefined;
    public playerList: Array<Player>;

    constructor() {
        this.isInRoom = false;
        this.isHost = false;
        this.playerList = [];
    }

    public async createRoom(username: string, playerCount: number): Promise<Result<void>> {
        if (playerCount > 6 || playerCount < 2) {
            return Err("Niepoprawna ilosc graczy");
        }

        if (username.length > 20 || username.length < 3) {
            return Err("Niepoprawny username");
        }

        if (!DEBUG) {
            const response = await ws.request("create_room", { username: username, playersAmount: playerCount });
            console.log(response);

            if (!response.ok) {
                return Err(response.error)
            }

            this.roomId = (response.value as any).gameCode;
        } else {
            this.roomId = "temp"
        }

        // Ws request do websocketow i potem stworz z tego pokoj

        this.isHost = true;
        this.isInRoom = true;
        return Ok(undefined)
    }

    public async joinRoom(username: string, roomId: string): Promise<Result<void>> {
        if (username.length > 20 || username.length < 3) {
            return Err("Niepoprawny username");
        }

        if (!DEBUG) {
            const response = await ws.request("join_game", { username: username, gameCode: roomId });
            console.log(response);

            if (!response.ok) {
                return Err(response.error)
            }
        }

        this.isInRoom = true;
        this.roomId = roomId;
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