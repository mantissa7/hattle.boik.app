import "./index.css";
import alsitty from "@/assets/alsitty.png";
import type { User } from "@/lib/db";
import { type FormEventHandler, useEffect, useMemo, useRef, useState } from "react";

type Video = {
  id: string;
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

const setQuery = (params: Record<string, string | null | undefined>, dispatch = true) => {
  const s = Object.entries(params).filter(([k, v]) => v !== null && v !== undefined) as [string, string][];
  const state = new URLSearchParams(s).toString();

  history.replaceState(null, '', `?${state}`);
  if (dispatch) {
    dispatchEvent(new PopStateEvent('popstate', { state: null }));
  }
}

export function App() {
  const formRef = useRef<HTMLFormElement>(null);
  const [user, setUser] = useState<User | null>(null);
  const [searchParams, setSearchParams] = useState<URLSearchParams>(new URLSearchParams(window.location.search));
  const [answer, setAnswer] = useState<boolean | null>(null);
  const [videos, setVideos] = useState<Video[]>();
  const [question, setQuestion] = useState<number>(0);
  // const video = useMemo((vids) => vids[question], [videos, question])
  const video = videos?.[question];

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
      setVideos(videos);


      setUser(user);
    })();
  }, []);

  // useEffect(() => {
    
  // }, [question]);

  const handleGuess: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    const form = e.target as HTMLFormElement
    const fd = new FormData(form);

    const res = await fetch(form.action, {
      method: "POST",
      body: fd
    })

    if (!res.ok) {
      alert('Bad joojoo');
      return
    }

    const body = await res.json();

    setAnswer(Boolean(body));

    return false;
  }

  const onNextQuestion = () => {
    console.log(question)
    const q = question + 1;
    formRef.current?.reset();
    setQuestion(q);
    setAnswer(null);
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
        <div className="image-area">
          <div className="thumbnail">
            <img src={video?.thumbnails.maxres.url} alt="" />
          </div>
        </div>

        <form ref={formRef} className="guesses" action="/api/videos" onSubmit={handleGuess}>
          <input type="hidden" name="id" value={video?.id} />
          <input type="hidden" name="question" value={1} />
          <h2>Year</h2>
          {/* <input type="range" name="" id="" min={2013} max={2025} step={1} /> */}
          <fieldset className="radio-group">
            {years.map(yr => (
              <label className="radio-group-option" key={yr}>
                <span>{yr}</span>
                <input key={yr} type="radio" name="year" value={yr} />
              </label>
            ))}
          </fieldset>
          <h2>Month</h2>
          <fieldset className="radio-group">
            {months.map((mnth, i) => (
              <label className="radio-group-option" key={mnth}>
                <span>{mnth}</span>
                <input key={mnth} type="radio" name="month" value={i + 1} />
              </label>
            ))}
          </fieldset>
          <input type="submit" value="Guess!" />
        </form>
      </main>

      {answer !== null && (
        <div className="answer">
          {answer === true && (
            <div className="cokhex">CORRECT!</div>
          )}
          {answer === false && (
            <div className="cokhex">MUNTER</div>
          )}
          <button type="button" onClick={() => onNextQuestion()}>NEXT</button>
        </div>
      )}

      {user && (
        <img id="alsitty" src={alsitty} alt=""/>
      )}
    </div>
  );
}

export default App;
