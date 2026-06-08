import { showError } from "../components/LobbyService";
import { GameManager } from "./game/GameManager";
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

export type RoomSettings = {
  populationPool: number;
  marketVolatility: number;
};

export class RoomManager {
  public isInRoom: boolean;
  public username: string | undefined;
  public isHost: boolean;
  public roomId: string | undefined;
  public playerList: Array<Player>;
  public roomSettings: RoomSettings;

  onRoomJoined?: () => void;
  onRoomLeft?: () => void;
  onGameStart: (() => void) | null = null;
  onPlayersChanged: () => void = () => {};

  constructor() {
    this.isInRoom = false;
    this.isHost = false;
    this.playerList = [];
    this.roomSettings = {
      populationPool: 60,
      marketVolatility: 1,
    };

    ws.register_handler("player_joined", (data: { players: string[] }) => {
      this.syncPlayers(data.players);
      this.onRoomJoined?.();
    });

    ws.register_handler("player_left", (data) => {
      console.log(data);
      this.syncPlayers(data as string[]);
    });

    ws.register_handler("host_left", () => {
      console.log("kys");
      if (!this.isHost && this.isInRoom) {
        this.isInRoom = false;
        this.onRoomLeft?.();
      }
    });

    ws.register_handler("game_start", (data) => {
      if (!this.isHost) {
        console.log(data);
        GameManager.getInstance().startGame(data);
        this.onGameStart?.();
      }
    });
  }

  public updateSettings(settings: RoomSettings): void {
    if (this.isHost) {
      this.roomSettings = settings;
    }
  }

  public async createRoom(
    username: string,
    playerCount: number,
  ): Promise<Result<void>> {
    if (playerCount > 6 || playerCount < 2) {
      return Err("Niepoprawna ilosc graczy");
    }
    if (username.length > 20 || username.length < 3) {
      return Err("Niepoprawny username");
    }

    const result = await ws.request<
      {},
      { gameCode: string; players: string[] }
    >("create_game", "game_created", { username, playersAmount: playerCount });

    if (!result.ok) return Err(result.error);

    const { gameCode, players } = result.value;

    this.roomId = gameCode;
    this.isHost = true;
    this.isInRoom = true;
    this.playerList = players.map(
      (name) => new Player(name, name === username),
    );
    this.onRoomJoined?.();

    return Ok(undefined);
  }

  public async joinRoom(
    username: string,
    roomId: string,
  ): Promise<Result<void>> {
    if (roomId.length === 0) {
      return Err("Zly kod pokoju");
    }
    if (username.length > 20 || username.length < 3) {
      return Err("Niepoprawny username");
    }

    const result = await ws.request<
      {},
      { host: string; gameCode: string; players: string[] }
    >("join_game", "joined", { gameCode: roomId, username });
    console.log(result);

    if (!result.ok) return Err(result.error);

    const { host, gameCode, players } = result.value;

    this.roomId = gameCode;
    this.isInRoom = true;
    this.isHost = false;
    this.playerList = players.map((name) => new Player(name, name === host));
    this.onRoomJoined?.();

    return Ok(undefined);
  }

  public async leaveRoom(): Promise<Result<void>> {
    if (!this.roomId || !this.isInRoom) {
      return Err("Nie jestes w pokoju");
    }

    const result = await ws.request("leave_game", "left", this.roomId);

    if (!result.ok) return Err(result.error);

    this.isInRoom = false;
    this.isHost = false;
    this.roomId = undefined;
    this.playerList = [];
    this.onRoomLeft?.();

    return Ok(undefined);
  }

  public async startGame(): Promise<Result<void>> {
    if (!this.roomId || !this.isInRoom) {
      return Err("Nie jestes w pokoju");
    }

    if (!this.isHost) {
      return Err("Nie jestes hostem");
    }

    console.log(this.roomSettings.populationPool);
    console.log(this.roomSettings.marketVolatility);

    const result = await ws.request("start_game", "game_start", {
      gameCode: this.roomId,
      populationPool: this.roomSettings.populationPool,
      marketVolatility: this.roomSettings.marketVolatility,
    });

    if (result.ok) {
      console.log(result.value);
      GameManager.getInstance().startGame(result.value);

      return Ok(undefined);
    } else {
      return Err(result.error);
    }
  }

  public getPlayers(): Array<Player> {
    return this.playerList;
  }

  public addPlayer(player: Player): void {
    this.playerList.push(player);
  }

  public removePlayer(playerName: string): void {
    const exists = this.playerList.find((p) => p.name === playerName);
    if (!exists) {
      console.warn(`Gracz o nazwie ${playerName} nie istnieje`);
      return;
    }
    this.playerList = this.playerList.filter((p) => p.name !== playerName);
  }

  private syncPlayers(usernames: string[]): void {
    const currentHost = this.playerList.find((p) => p.isHost)?.name;
    this.playerList = usernames.map(
      (name) => new Player(name, name === currentHost),
    );
    this.onPlayersChanged();
  }
}
