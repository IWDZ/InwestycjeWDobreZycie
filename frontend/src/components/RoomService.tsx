import React, { useEffect, useState } from "react";
import { roomManager } from "./LobbyService";

export function RoomService() {
    return (
        <>
            {roomManager.isInRoom && (<div className="room-modal">
                <div className="room-header">
                    <h1>Pokój</h1>
                    <div className="room-header-room-id">
                        <p className="header-room-id" id="header-room-id">{roomManager.roomId}</p>
                    </div>
                </div>
                <div className="player-list" id="player-list">

                </div>
                <div className="setting-preview">
                    {roomManager.isHost && (
                        <button>Zaktualizuj</button>
                    )}
                </div>
                <div className="actions">
                    <button className="room-action-btn">Wyjdź</button>
                    {roomManager.isHost && (
                        <button className="room-action-btn">Zacznij grę</button>
                    )}
                </div>
            </div>)}
        </>
    )
}