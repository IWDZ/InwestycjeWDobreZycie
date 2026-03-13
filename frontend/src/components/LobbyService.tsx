import { useState } from 'react'
import { RoomService } from './RoomService';

export function LobbyService() {
  const [createOpen, setCreateOpen] = useState(false)
  const [joinOpen, setJoinOpen] = useState(false)
  const [roomStatusOpen, setRoomStatusOpen] = useState(false);
  const [gameName, setGameName] = useState('')
  const [maxPlayers, setMaxPlayers] = useState(2)
  const [joinCode, setJoinCode] = useState('')

  return (
    <>
      <div className="modal">
        <h1>Gra</h1>
        <p>Dołącz do gry lub stwórz nową rozgrywkę</p>
        <div className="btn-container">
          <button className="btn-create" onClick={() => setCreateOpen(true)}>Stwórz grę</button>
          <button className="btn-join" onClick={() => setJoinOpen(true)}>Dołącz do gry</button>
        </div>
      </div>

      {createOpen && (
        <div className="dialog-overlay active">
          <div className="dialog-box">
            <h2>Stwórz nową grę</h2>
            <input
              type="text"
              placeholder="Nazwa gry"
              maxLength={30}
              value={gameName}
              onChange={e => setGameName(e.target.value)}
            />
            <input
              type="number"
              placeholder="Ilość graczy (2-6)"
              min={2}
              max={6}
              value={maxPlayers}
              onChange={e => setMaxPlayers(Number(e.target.value))}
            />
            <div className="dialog-buttons">
              <button className="btn-confirm">Stwórz</button>
              <button className="btn-cancel" onClick={() => {
                setRoomStatusOpen(true);
                setCreateOpen(false)
              }}>Anuluj</button>
            </div>
          </div>
        </div>
      )}

      {roomStatusOpen && (
        <RoomService></RoomService>)}

      {joinOpen && (
        <div className="dialog-overlay active">
          <div className="dialog-box">
            <h2>Dołącz do gry</h2>
            <input
              type="text"
              placeholder="Kod gry"
              maxLength={10}
              value={joinCode}
              onChange={e => setJoinCode(e.target.value)}
            />
            <div className="dialog-buttons">
              <button className="btn-confirm">Dołącz</button>
              <button className="btn-cancel" style={{ width: '100%' }} onClick={() => setJoinOpen(false)}>Zamknij</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}