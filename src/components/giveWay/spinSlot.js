const symbols = ["STAR", "GIFT", "MONEY", "GOLD", "BELL", "BAR", "COIN"];

export const spinSlot = ({
  isSpinning,
  setIsSpinning,
  setAnticipation,
  setJackpot,
  setReel1,
  setReel2,
  setReel3,
}) => {
  if (isSpinning) return;

  setIsSpinning(true);
  setAnticipation(false);
  setJackpot(false);

  setReel1((p) => ({ ...p, spinning: true }));
  setReel2((p) => ({ ...p, spinning: true }));
  setReel3((p) => ({ ...p, spinning: true }));

  const getResult = () =>
    Math.random() < 0.18
      ? "MONEY"
      : symbols[Math.floor(Math.random() * symbols.length)];

  const result1 = getResult();
  const result2 = getResult();
  const result3 = getResult();

  const makeSymbols = (result) => [
    symbols[Math.floor(Math.random() * symbols.length)],
    result,
    symbols[Math.floor(Math.random() * symbols.length)],
  ];

  const newSymbols1 = makeSymbols(result1);
  const newSymbols2 = makeSymbols(result2);
  const newSymbols3 = makeSymbols(result3);

  setTimeout(() => {
    setReel1({ symbols: newSymbols1, spinning: false });
  }, 1500);

  setTimeout(() => {
    setReel2({ symbols: newSymbols2, spinning: false });
    if (result1 === "MONEY" && result2 === "MONEY") {
      setAnticipation(true);
    }
  }, 2300);

  const finalDelay = result1 === "MONEY" && result2 === "MONEY" ? 4500 : 3100;

  setTimeout(() => {
    setReel3({ symbols: newSymbols3, spinning: false });
    setIsSpinning(false);
    setAnticipation(false);

    if (result1 === "MONEY" && result2 === "MONEY" && result3 === "MONEY") {
      setTimeout(() => setJackpot(true), 400);
    }
  }, finalDelay);
};
