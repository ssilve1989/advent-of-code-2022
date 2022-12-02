import path from 'path';
import { map, reduce } from 'rxjs';
import { match } from 'ts-pattern';
import { getInputStream } from '../common';

enum Hand {
  Rock,
  Paper,
  Scissors,
}

const Scores = {
  Loss: 0,
  Win: 6,
  Draw: 3,
};

const FIRST_COLUMN_STRATEGY: Record<string, Hand> = {
  A: Hand.Rock,
  B: Hand.Paper,
  C: Hand.Scissors,
};

const getScore = (theirMove: Hand, myMove: Hand) =>
  match([theirMove, myMove])
    .when(
      ([theirMove, myMove]) => theirMove === myMove,
      () => Scores.Draw
    )
    .when(
      ([theirMove, myMove]) => (theirMove + 1) % 3 === myMove,
      () => Scores.Win
    )
    .otherwise(() => Scores.Loss);

const getMove = (theirMove: Hand, desiredScore: number): Hand =>
  match(desiredScore)
    .with(Scores.Draw, () => theirMove)
    .with(Scores.Win, () => (theirMove + 1) % 3)
    .with(Scores.Loss, () => (theirMove + 2) % 3)
    .run();

// offset result by 1 to account for zero indexing Hands
const round = (theirMove: Hand, myMove: Hand) => getScore(theirMove, myMove) + myMove + 1;

const input$ = getInputStream(path.resolve(__dirname, 'input.txt')).pipe(map((line) => line.split(' ')));

const play = (transformer: (input: string[]) => [Hand, Hand]) =>
  input$.pipe(
    map(transformer),
    map(([theirMove, myMove]) => round(theirMove, myMove)),
    reduce((acc, score) => acc + score, 0)
  );

const part1$ = play(([theirMove, myMove]) => {
  const assumedStrategy: Record<string, Hand> = { X: Hand.Rock, Y: Hand.Paper, Z: Hand.Scissors };
  return [FIRST_COLUMN_STRATEGY[theirMove], assumedStrategy[myMove]];
}).subscribe(console.log);

const part2$ = play((input) => {
  const knownStrategy: Record<string, number> = { X: Scores.Loss, Y: Scores.Draw, Z: Scores.Win };
  const theirs = FIRST_COLUMN_STRATEGY[input[0]];
  const mine = getMove(theirs, knownStrategy[input[1]]);
  return [theirs, mine];
}).subscribe(console.log);
