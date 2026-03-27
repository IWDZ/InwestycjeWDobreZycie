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
    onRoomJoined?: () => void;
    onRoomLeft?: () => void;


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
        this.onRoomJoined?.();
        this.addPlayer(new Player(username, true))

        return Ok(undefined)
    }

    public async joinRoom(username: string, roomId: string): Promise<Result<void>> {
        if (roomId.length == 0) {
            return Err("Zly kod pokoju")
        }
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
        this.onRoomJoined?.();
        this.roomId = roomId;
        this.addPlayer(new Player(username, false))

        return Ok(undefined)
    }

    public async leaveRoom(): Promise<Result<void>> {
        if (!this.roomId || !this.isInRoom) {
            return Err("Nie jestes w pokoju")
        }

        if (!DEBUG) {
            const response = await ws.request("leave_game", {gameCode: this.roomId});

            if (!response.ok) {
                return Err(response.error)
            }
        }

        this.isInRoom = false;
        this.roomId = undefined;
        this.onRoomLeft?.();
        this.playerList = [];

        return Ok(undefined)
    }

    public getPlayers(): Array<Player> {
        return this.playerList
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