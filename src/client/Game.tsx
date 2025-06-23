import alsitty from "@/assets/alsitty.png";
import { Button } from "@/components/button/Button";
import type { HattleVid, ValidatedGuess } from "@/lib/boik";
import { format } from "date-fns";
import { type FormEventHandler, useEffect, useRef, useState } from "react";

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

interface Props {
  set: HattleVid[];
  onEnd: () => void;
}


export function Game(props: Props) {
  const formRef = useRef<HTMLFormElement>(null);
  const [answers, setAnswers] = useState<({ year: boolean; month: boolean } | null)[]>([]);
  const [answer, setAnswer] = useState<string | null>(null);
  const [guess, setGuess] = useState<{ year: number; month: number } | null>(null);
  const [question, setQuestion] = useState<number>(0);
  const [showStats, setShowStats] = useState<boolean>(true);
  const video = props.set[question];
  const gameComplete = answers.length === props.set.length;

  // useEffect(() => {
  //   setAnswers([...props.set.map(vid => ({ year: false, month: false }))]);
  //   setQuestion(props.set.length - 1)
  //   setShowStats(true);
  //   console.log('SHOW STS');

  // }, [props.set])

  const resetGame = () => {
    formRef.current?.reset();
    setAnswer(null)
    setAnswers([]);
    setQuestion(0);
    setGuess(null);
  }

  const handleGuess: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    const form = e.target as HTMLFormElement
    const fd = new FormData(form);

    setGuess({ year: +fd.get('year')!, month: +fd.get('month')! })

    const res = await fetch(form.action, {
      method: "POST",
      body: fd,
    })

    if (!res.ok) {
      alert('Bad joojoo');
      return
    }

    const body = await res.json() as { data: ValidatedGuess };

    setAnswer(body.data.published_at);

    setAnswers([...answers, { year: body.data.year, month: body.data.month }]);

    return false;
  }

  const onNextQuestion = () => {
    if (gameComplete) {
      console.log('complete!');
      setAnswer(null);
      setShowStats(true);
      return;
    }

    setGuess(null);
    formRef.current?.reset();
    setAnswer(null);
    setQuestion(question + 1);
  }


  return (
    <div id="game" className={`${gameComplete ? 'complete' : ''}`}>
      <nav>
        <h1>HATTLE</h1>
        <div className="progress">
          {props.set.map((vid, i) => (
            <div key={vid.vid} className={`${answers[i] ? 'played' : ''} ${answers[i]?.year ? 'year' : ''} ${answers[i]?.month ? 'month' : ''}`}></div>
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
                <input key={yr} type="radio" name="year" value={yr} required />
              </label>
            ))}
          </fieldset>
          <fieldset className="radio-group">
            {months.map((mnth, i) => (
              <label className="radio-group-option" key={mnth}>
                <span>{mnth}</span>
                <input key={mnth} type="radio" name="month" value={i + 1} required />
              </label>
            ))}
          </fieldset>
          <Button type="submit">GUESS</Button>
        </form>
      </main>

      {answer !== null && (
        <div className="modal">
          <div className="answer">
            {(answers[question]?.month && answers[question]?.year) ? (
              <div className="cokhex">WELL MET!</div>
            ) : (
              <div className="cokhex">munter</div>
            )}
            <div>
              <div>Released:</div>
              <div>{format(answer, 'yyy-MM-dd')}</div>
              <a target="_BLANK" href={props.set[question].video_url}>Watch Video</a>
            </div>
            <div className="chips">
              <div className={`chip ${answers[question]?.year ? 'correct' : 'wrong'}`}>{guess?.year}</div>
              <div className={`chip ${answers[question]?.month ? 'correct' : 'wrong'}`}>{months[+guess?.month!]}</div>
            </div>
            <Button type="button" onClick={() => onNextQuestion()}>
              NEXT
            </Button>
          </div>
        </div>
      )}

      {showStats ?? (
        <div className="modal">
          <div className="body">
            <div>Accuracy: 69%</div>
            <div>Months: 69%</div>
            <div>Years: 69%</div>

            <div className="coxhex">DO IT YOU PUSSY!</div>
            <Button type="button" onClick={() => props.onEnd()}>
              Home
            </Button>
          </div>
        </div>
      )}

      <img id="alsitty" src={alsitty} alt="" />
    </div>
  );
}

export default Game;
