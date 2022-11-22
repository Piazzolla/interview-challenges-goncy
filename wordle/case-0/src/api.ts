const WORDS = ["WRONG", "RIGHT", "WORLD", "WORMS", "GONCY", "BELEN"];
const min = 0;
const max = WORDS.length - 1;

const api = {
  word: {
    random: (): Promise<string> => // CANDIDATE
      new Promise((resolve) =>
        setTimeout(() => resolve(WORDS[Math.floor(Math.random() * (max - min + 1) + min)]), 1000),
      ),
  },
};

export default api;
