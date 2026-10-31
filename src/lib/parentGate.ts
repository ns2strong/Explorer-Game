/**
 * A grown-up check: a simple addition question a pre-reader can't read or solve,
 * with four number buttons. Generated fresh each time so it can't be memorized.
 */
export interface GateQuestion {
  a: number;
  b: number;
  answer: number;
  /** Four distinct choices, one of them the answer, in random order. */
  choices: number[];
}

export function makeGateQuestion(rand: () => number = Math.random): GateQuestion {
  const pick = (lo: number, hi: number) => lo + Math.floor(rand() * (hi - lo + 1));
  const a = pick(3, 9);
  const b = pick(3, 9);
  const answer = a + b;
  const choices = new Set([answer]);
  // Nearby wrong answers, so guessing by "biggest number" doesn't work.
  let guard = 0;
  while (choices.size < 4 && guard++ < 100) {
    const wrong = answer + pick(-4, 4);
    if (wrong > 0 && wrong !== answer) choices.add(wrong);
  }
  for (let n = 1; choices.size < 4; n++) choices.add(answer + n * 5);
  const list = [...choices];
  for (let i = list.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [list[i], list[j]] = [list[j], list[i]];
  }
  return { a, b, answer, choices: list };
}
