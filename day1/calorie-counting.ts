import fs from 'fs';
import {
  share,
  fromEvent,
  scan,
  takeUntil,
  filter,
  bufferWhen,
  map,
  takeLast,
  reduce,
  distinct,
  toArray,
  mergeMap,
  take,
} from 'rxjs';
import path from 'path';
import readline from 'readline';

const rl = readline.createInterface({
  input: fs.createReadStream(path.resolve(`${__dirname}/input.txt`)),
  crlfDelay: Infinity,
});

const close$ = fromEvent(rl, 'close');
const lines$ = fromEvent(rl, 'line').pipe(share(), takeUntil(close$));

const calories$ = lines$.pipe(
  filter((value) => value !== ''),
  bufferWhen(() => lines$.pipe(filter((value) => value === ''))),
  map((calories) =>
    calories
      .map((value) => Number.parseInt(value as string))
      .filter((value) => !Number.isNaN(value))
      .reduce((acc, value) => (acc += value))
  )
);

const mostCalories$ = calories$.pipe(
  scan((prev, curr) => Math.max(prev, curr), 0),
  distinct(),
  takeLast(1)
);

const topThreeCombinedCalories$ = calories$.pipe(
  toArray(),
  map((calories) => calories.sort((a, b) => b - a)),
  mergeMap((calories) => calories),
  take(3),
  reduce((acc, curr) => (acc += curr))
);

mostCalories$.subscribe({
  next: (calories) =>
    console.log(`The elf with the most calories has ${calories} calories`),
});

topThreeCombinedCalories$.subscribe({
  next: (calories) =>
    console.log(`The top three elves are carrying ${calories} calories `),
});
