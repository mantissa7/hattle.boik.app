import "./index.css";
import alsitty from "@/assets/alsitty.png";
import type { User } from "@/lib/db";
import { type FormEventHandler, useEffect, useState } from "react";

type Video = {
  video_id: string;
  published_at: string;
  title: string;
  thumbnails: Thumbnails;
}

type Thumbnail = {
  url: string;
  width: number;
  height: number;
}

type Thumbnails = {
  default: Thumbnail;
  medium: Thumbnail;
  high: Thumbnail;
  standard: Thumbnail;
  maxres: Thumbnail;
};

const years = [
  2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019,
  2020, 2021, 2022, 2023, 2024, 2025,
];

const months = [
  'January', 'February', 'March',
  'April', 'May', 'June',
  'July', 'August', 'September',
  'October', 'Novemeber', 'December'
];

const year = (isoDate: string) => {
  console.log(new Date(isoDate).getFullYear());

  return new Date(isoDate).getFullYear();
}

const month = (isoDate: string) => {
  return new Date(isoDate).toLocaleString('default', { month: 'long' });
}

const setQuery = (params: Record<string, string | null | undefined>, dispatch = true) => {
  const s = Object.entries(params).filter(([k, v]) => v !== null && v !== undefined) as [string, string][];
  const state = new URLSearchParams(s).toString();

  history.replaceState(null, '', `?${state}`);
  if (dispatch) {
    dispatchEvent(new PopStateEvent('popstate', { state: null }));
  }
}

export function App() {
  const [user, setUser] = useState<User | null>(null);
  const [searchParams, setSearchParams] = useState<URLSearchParams>(new URLSearchParams(window.location.search));
  const [answer, setAnswer] = useState<boolean | null>(null);
  const [video, setVideo] = useState<Video>();

  useEffect(() => {
    window.addEventListener('popstate', (e) => {
      setSearchParams(new URLSearchParams(window.location.search));
    });
  }, []);

  useEffect(() => {
    (async () => {
      const userResp = await fetch('/api/me');
      const user = await userResp.json();
      const videosResp = await fetch('/api/videos');
      const videos = await videosResp.json() as Video[];
      setVideo(videos[0]);


      setUser(user);
    })();
  }, []);

  const handleGuess: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    const form = new FormData(e.target);
    const y = year(video?.published_at);
    const m = month(video?.published_at);

    const fy = form.get('year')!;
    const fm = form.get('month')!;

    if (y === +fy && m === fm) {
      setAnswer(true);
      return;
    }

    setAnswer(false);

    return false;
  }

  const closeBanner = () => {
    setQuery({ submitted: null });
  }

  // if (!user?.id) {
  //   return (
  //     <div className="app">
  //       <h1>HAT FINGLES</h1>
  //       <div className="login">
  //         <h4>Login to upload your fingle</h4>
  //         <a className="login-btn" href={process.env.BUN_PUBLIC_DISCORD_OAUTH_URL}>LOGIN</a>
  //       </div>
  //     </div>
  //   )
  // }

  return (
    <div className="app">
      <h1>HATTLE</h1>

      <main>
        <div className="thumb">
          <img src={video?.thumbnails.maxres.url} alt="" />
        </div>
        <form className="guesses" onSubmit={handleGuess}>
          <select name="year" id="year">
            {years?.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          <select name="month" id="month">
            {months?.map(month => (
              <option key={month} value={month} >{month}</option>
            ))}
          </select>
          <input type="submit" value="Guess!" />
        </form>
      </main>

      {answer !== null && (
        <div className="answer">
          {answer === true && (
            <h1>WOO</h1>
          )}
          {answer === false && (
            <h1>MUNTER</h1>
          )}
        </div>
      )}

      {user && (
        <img id="alsitty" src={alsitty} alt="" />
      )}
    </div>
  );
}

export default App;
