import { useEffect, useState } from 'react'
import './style/lobby.css'
import './style/error.css'
import './style/room.css'
import { LobbyService } from './components/LobbyService.tsx';
import { useRef } from "react";
import { ErrorNotif, ErrorNotifRef } from "./components/ErrorNotif";

export const errorNotif = { current: null as ErrorNotifRef | null };

export default function App() {
  const [lobbyServiceOpen, _] = useState(true);
  const ref = useRef<ErrorNotifRef>(null);

  useEffect(() => {
    errorNotif.current = ref.current;
  }, []);


  return (
    <>
      <ErrorNotif ref={ref} />
      {lobbyServiceOpen && (
        <LobbyService></LobbyService>
      )}
    </>
  )
}