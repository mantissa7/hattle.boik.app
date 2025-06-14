import alsitty from "@/assets/alsitty.png";
import { Button } from "@/components/button/Button";
import type { Session } from "@/lib/boik";
import { type FormEventHandler, useEffect, useRef, useState } from "react";

type Video = {
  set_id: string;
  vid: number;
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



export function App() {
  const formRef = useRef<HTMLFormElement>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [answers, setAnswers] = useState<(boolean | null)[]>([]);
  const [answer, setAnswer] = useState<boolean | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [question, setQuestion] = useState<number>(0);
  const video = videos[question];
  const gameComplete = answers.length === videos.length;



  useEffect(() => {
    (async () => {
      const videoResp = await fetch('/api/set');
      const videos = await videoResp.json();
      setVideos(videos);
    })();
  }, []);


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
    const is_correct = Boolean(body.result);

    setAnswer(is_correct);

    setAnswers([...answers, is_correct]);

    return false;
  }

  const resetGame = () => {
    formRef.current?.reset();
    setAnswer(null)
    setAnswers([]);
    setQuestion(0);
  }

  const onNextQuestion = () => {
    if (gameComplete) {
      resetGame();
      return;
    }
    
    formRef.current?.reset();
    setAnswer(null);
    setQuestion(question + 1);
  }


  return (
    <div id="game" className={`${gameComplete ? 'complete' : ''}`}>
      <nav>
        <h1>HATTLE</h1>
        <div className="progress">
          {videos.map((vid, i) => (
            <div key={vid.vid} className={`${answers[i] ? 'good' : (answers[i] === false ? 'bad' : '')}`}></div>
          ))}
        </div>
        <div className="meta">
          <div className="help">
            Rules
          </div>
        </div>
      </nav>

      <main>
        <div className="image-area">
          <div className="thumbnail">
            <img src={video?.thumbnails.maxres.url} alt="" />
          </div>
        </div>

        <form ref={formRef} className="guesses" action="/api/set" onSubmit={handleGuess}>
          <input type="hidden" name="set_id" value={video?.set_id} />
          <input type="hidden" name="vid" value={video?.vid} />
          <fieldset className="radio-group">
            {years.map(yr => (
              <label className="radio-group-option" key={yr}>
                <span>{yr}</span>
                <input key={yr} type="radio" name="year" value={yr} required/>
              </label>
            ))}
          </fieldset>
          <fieldset className="radio-group">
            {months.map((mnth, i) => (
              <label className="radio-group-option" key={mnth}>
                <span>{mnth}</span>
                <input key={mnth} type="radio" name="month" value={i + 1} required/>
              </label>
            ))}
          </fieldset>
          <Button type="submit">PLAY</Button>
        </form>
      </main>

      {answer !== null && (
        <div className="answer">
          {answer === true && (
            <div className="cokhex">correct!</div>
          )}
          {answer === false && (
            <div className="cokhex">munter</div>
          )}
          <Button type="button" onClick={() => onNextQuestion()}>
            {gameComplete ? 'RESTART' : 'NEXT'}
          </Button>
          {/* <button type="button" onClick={() => onNextQuestion()}>
            {gameComplete ? 'RESTART' : 'NEXT'}
          </button> */}
        </div>
      )}

      {session && (
        <img id="alsitty" src={alsitty} alt=""/>
      )}
    </div>
  );
}

export default App;
