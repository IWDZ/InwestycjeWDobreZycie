const CLIENT_EVENTS = {
    LOBBY_CREATED: "lobby:created",
    LOBBY_JOINED: "lobby:joined",
    PLAYER_JOINED: "lobby:player_joined",
    HOST_CHANGED: "lobby:host_changed", 
    PLAYER_LEFT: "room:player_left",
} as const;

export default CLIENT_EVENTS;