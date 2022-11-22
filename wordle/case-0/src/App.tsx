import {KeyboardEvent, useCallback, useEffect, useState} from "react";
import Confetti from "react-confetti";

function App() {
  const answer = "RIGHT";
  const [turn, setTurn] = useState<number>(0);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [status, setStatus] = useState<"playing" | "finished">("playing");
  const [words, setWords] = useState<string[][]>(() =>
    Array.from({length: 6}, () => new Array(5).fill("")),
  );

  useEffect(() => {
    if (status === "finished") {
      setShowConfetti(true);
    }
  }, [status]);

  function restartGame() {
    console.log("restarting game");
    setTurn(0);
    setWords(() => Array.from({length: 6}, () => new Array(5).fill("")));
    setStatus("playing");
    setShowConfetti(false);
  }

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      //alert("hola");
      //console.log("Key down: " + event.key);
      switch (event.key) {
        case "Enter": {
          if (status === "finished") {
            restartGame();
          }
          if (words[turn].join("") === answer) {
            setStatus("finished");

            return;
          }

          const filledLetters = words[turn].filter((letter) => letter !== "");

          if (filledLetters.length === words[turn].length) {
            setTurn((turn) => turn + 1);
          }

          return;
        }
        case "Backspace": {
          let firstEmptyIndex = words[turn].findIndex((letter) => letter === "");

          if (firstEmptyIndex === -1) {
            firstEmptyIndex = words[turn].length;
          }

          words[turn][firstEmptyIndex - 1] = "";

          setWords(words.slice());

          return;
        }
        default: {
          if (event.key.length === 1 && event.key.match(/[a-z]/i)) {
            const firstEmptyIndex = words[turn].findIndex((letter) => letter === "");

            if (firstEmptyIndex === -1) return;

            words[turn][firstEmptyIndex] = event.key.toUpperCase();
            if (firstEmptyIndex === words[turn].length) {
              setTurn(turn + 1);
            }

            setWords(words.slice());

            return;
          }
        }
      }
    },
    [turn, words, answer],
  );

  return (
    <>
      <main className="board" tabIndex={-1} onKeyDown={(e) => handleKeyDown(e)}>
        {showConfetti ? (
          <>
            <Confetti
              colors={["#73ACDF", "#FFFFFF"]}
              drawShape={(ctx) => {
                ctx.beginPath();
                for (let i = 0; i < 22; i++) {
                  const angle = 0.35 * i;
                  const x = (0.2 + 1.5 * angle) * Math.cos(angle);
                  const y = (0.2 + 1.5 * angle) * Math.sin(angle);

                  ctx.lineTo(x, y);
                }
                ctx.stroke();
                ctx.closePath();
              }}
              numberOfPieces={200}
            />
            <h1>Enter para jugar de nuevo</h1>
          </>
        ) : null}
        {words.map((word, wordIndex) => (
          <section key={wordIndex} className="word">
            {word.map((letter, letterIndex) => {
              const isCorrect = answer.charAt(letterIndex) === letter.toUpperCase();
              const isPresent =
                letter &&
                wordIndex < turn &&
                letter !== answer[letterIndex] &&
                answer.includes(letter);

              return (
                <article
                  key={letterIndex}
                  className={`letter ${isPresent && "present"} ${isCorrect && "correct"}`}
                >
                  {letter}
                </article>
              );
            })}
          </section>
        ))}
      </main>
    </>
  );
}

export default App;
