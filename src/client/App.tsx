import { useEffect, useState } from "react";
import "./index.css";
import type { HattleVid, Session } from "@/lib/boik";
import Game from "./Game";
import { Button } from "@/components/button/Button";

export function App() {
  // const [session, setSession] = useState<Session | null>(null);
  const [videos, setVideos] = useState<HattleVid[]>([]);


  const fetchSet = async (type: string) => {
    const videoResp = await fetch(`/api/set?type=${type}`);
    const videos = await videoResp.json();
    setVideos(videos);
  }

  // useEffect(() => {
  //   (async () => {
  //     const seshResp = await fetch('/api/me');
  //     const sesh = await seshResp.json();

  //     setSession(sesh);
  //   })();
  // }, []);

  return (
    <div id="app">
      {videos.length ? (
        <Game set={videos} />
      ) : (
        <main>
          <h1>HATTLE</h1>
          <h2>BETA</h2>

          <Button onClick={() => fetchSet('daily')}>
            PLAY DAILY
          </Button>
          <Button onClick={() => fetchSet('random')}>
            PRACTICE
          </Button>
        </main>
      )}
    </div>
  );
}

export default App;
