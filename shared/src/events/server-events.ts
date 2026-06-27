const SERVER_EVENTS = {
    CREATE_LOBBY: "lobby:create",
    JOIN_LOBBY: "lobby:join",
    LEAVE_ROOM: "room:leave",
    START_GAME: "game:start"
} as const;

export default SERVER_EVENTS;