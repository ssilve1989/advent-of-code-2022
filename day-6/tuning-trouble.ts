import fs from 'fs';
import path from 'path';
import { EMPTY, from, mergeMap, of, take, toArray, windowCount } from 'rxjs';

const [chars] = fs.readFileSync(path.resolve(__dirname, 'input.txt'), 'utf8').split('\n');

const findMarkerAfter = (at: number, chars: string) =>
  from(chars).pipe(
    windowCount(at + 1, 1),
    mergeMap((v) => v.pipe(toArray())),
    mergeMap((values, index) => {
      const set = new Set(values.slice(0, at));
      return set.size === at ? of(index + at) : EMPTY;
    }),
    take(1)
  );

findMarkerAfter(4, chars).subscribe(console.log);
findMarkerAfter(14, chars).subscribe(console.log);
