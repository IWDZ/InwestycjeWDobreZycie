import React, { useEffect, useState } from "react";
import { roomManager, showError } from "./LobbyService";

interface RoomServiceProps {
    onLeave: () => void;
}

export function RoomService({ onLeave }: RoomServiceProps) {
    const [players, setPlayers] = useState<{ name: string, isHost: boolean }[]>([]);
    const [isInRoom, setIsInRoom] = useState(roomManager.isInRoom);

    async function leaveRoom() {
        const response = await roomManager.leaveRoom();
        if (!response.ok) {
            showError(response.error);
        } else {
            onLeave();
        }
    }

    useEffect(() => {
        setPlayers(roomManager.getPlayers());
        roomManager.onRoomJoined = () => {
            setIsInRoom(true)
            setPlayers(roomManager.getPlayers())
        };
        roomManager.onRoomLeft = () => {
            setIsInRoom(false);
            setPlayers([]);
        }
    }, []);

    return (
        <>
            {isInRoom && (<div className="room-modal">
                <div className="room-header">
                    <h1>Pokój</h1>
                    <div className="room-header-room-id">
                        <p className="header-room-id" id="header-room-id">{roomManager.roomId}</p>
                    </div>
                </div>
                <div className="player-list" id="player-list">
                    {players.map((plr, i) => (
                        <div key={i} className={plr.isHost ? "player host" : "player"}>
                            {plr.name} {plr.isHost && "(Host)"}
                        </div>
                    ))}

                </div>
                <div className="setting-preview">
                    {roomManager.isHost && (
                        <button>Zaktualizuj</button>
                    )}
                </div>
                <div className="actions">
                    <button className="room-action-btn"
                        onClick={async () => await leaveRoom()}>Wyjdź</button>
                    {roomManager.isHost && (
                        <button className="room-action-btn">Zacznij grę</button>
                    )}
                </div>
            </div>)}
        </>
    )
}