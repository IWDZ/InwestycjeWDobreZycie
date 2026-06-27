import { GameMode } from "../../../shared/dist/types/types.js";
import lobbyManager from "../managers/LobbyManager.js";
import { RoomCode, SocketId } from "../types/types.js";
import Player from "./Player.js";
import Room from "./Room.js";

class Lobby extends Room {
    private _hostId: SocketId;
    public readonly maxPlayers: number;
    public readonly gameMode: GameMode;

    constructor(roomCode: RoomCode, host: Player, maxPlayers: number, gameMode: GameMode) {
        const players = new Map<SocketId, Player>();
        players.set(host.socketId, host);

        super(roomCode, players, lobbyManager);

        this._hostId = host.socketId;
        this.maxPlayers = maxPlayers;
        this.gameMode = gameMode;
    }

    public isPlayerHost(socketId: SocketId) {
        return this._hostId === socketId;
    }

    public addPlayer(player: Player) {
        this.players.set(player.socketId, player);
    }

    public getPlayers() {
        return [...this.players.values()];
    }

    public hasPlayerWithUsername(username: string) {
        return this.getPlayers().some(player => player.username === username)
    }

    public isFull() {
        return this.players.size >= this.maxPlayers;
    }

    public toDTO() {
        const host = this.players.get(this._hostId)?.username;
        const players = [...this.players.values()].map(player => player.username);
        return {
            roomCode: this.roomCode,
            host,
            players,
            maxPlayers: this.maxPlayers
        }
    }

    public changeHost() {
        const player = this.getPlayers()[0];
        this._hostId = player.socketId;
        return player.username;
    }
}

export default Lobby;