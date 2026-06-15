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
  populationPoolPercent: number;
  marketVolatilityPercent: number;
  gameDurationTicks: number;
};

export class RoomManager {
  public isInRoom: boolean;
  public username: string | undefined;
  public isHost: boolean;
  public roomId: string | undefined;
  public playerList: Array<Player>;
  public roomSettings: RoomSettings;
  public maxPlayerCount: number = 6;

  onRoomJoined?: () => void;
  onRoomLeft?: () => void;
  onGameStart: (() => void) | null = null;
  onPlayersChanged: () => void = () => {};

  constructor() {
    this.isInRoom = false;
    this.isHost = false;
    this.playerList = [];
    this.roomSettings = {
      populationPoolPercent: 60,
      marketVolatilityPercent: 1,
      gameDurationTicks: 240
    };

    ws.register_handler("player_joined", (data: { players: string[] }) => {
      this.syncPlayers(data.players);
      this.onRoomJoined?.();
    });

    ws.register_handler("player_left", (data) => {
      this.syncPlayers(data as string[]);
    });

    ws.register_handler("host_left", () => {
      if (!this.isHost && this.isInRoom) {
        this.isInRoom = false;
        this.onRoomLeft?.();
      }
    });

    ws.register_handler("game_start", (data) => {
      if (!this.isHost) {
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
    if (playerCount > 6 || playerCount < 1) {
      return Err("not_enough_players");
    }
    if (username.length > 20 || username.length < 3) {
      return Err("invalid_username");
    }

    const result = await ws.request<
      {},
      { gameCode: string; players: string[] }
    >("create_game", "game_created", { username, playersAmount: playerCount });

    if (!result.ok) return Err(result.error);

    const { gameCode, players } = result.value;

    this.roomId = gameCode;
    this.isHost = true;
    this.maxPlayerCount = playerCount;
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
      return Err("game_not_found");
    }
    if (username.length > 20 || username.length < 3) {
      return Err("invalid_username");
    }

    const result = await ws.request<
      {},
      { host: string; gameCode: string; players: string[], maxPlayers: number }
    >("join_game", "joined", { gameCode: roomId, username });

    if (!result.ok) return Err(result.error);

    const { host, gameCode, players } = result.value;

    this.roomId = gameCode;
    this.isInRoom = true;
    this.isHost = false;
    this.maxPlayerCount = result.value.maxPlayers;
    this.playerList = players.map((name) => new Player(name, name === host));
    this.onRoomJoined?.();

    return Ok(undefined);
  }

  public async leaveRoom(): Promise<Result<void>> {
    if (!this.roomId || !this.isInRoom) {
      this.onRoomLeft?.();
      return Err("game_not_found");
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
      this.onRoomLeft?.();
      return Err("game_not_found");
    }

    if (!this.isHost) {
      return Err("host_feature");
    }

    let result = await ws.request("start_game", "game_start", {
      populationPoolPercent: this.roomSettings.populationPoolPercent,
      marketVolatility: this.roomSettings.marketVolatilityPercent,
      gameDurationTicks: this.roomSettings.gameDurationTicks
    }, false);

    if (result.ok) {
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
