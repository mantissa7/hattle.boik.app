import { useEffect, useState } from "react";
import "./index.css";
import type { Session } from "@/lib/boik";
import Game from "./Game";
import { Button } from "@/components/button/Button";

export function App() {
  const [playing, setPlaying] = useState<boolean>(false);
  // const [session, setSession] = useState<Session | null>(null);


  // useEffect(() => {
  //   (async () => {
  //     const seshResp = await fetch('/api/me');
  //     const sesh = await seshResp.json();

  //     setSession(sesh);
  //   })();
  // }, []);

  return (
    <div id="app">
      {playing ? (
        <Game />
      ) : (
        <main>
          <h1>HATTLE</h1>
          <h2>BETA</h2>

          <Button onClick={() => setPlaying(true)}>
            PLAY
          </Button>
        </main>
      )}
    </div>
  );
}

export default App;
