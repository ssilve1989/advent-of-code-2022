import { intersection } from 'mnemonist/set';
import path from 'path';
import { bufferCount, map, mergeMap, reduce } from 'rxjs';
import { getInputStream } from '../common/get-input-stream';

const LOWERCASE_OFFSET = -96;
const UPPERCASE_OFFSET = -38;

const getPriority = (char: string) => {
  const code = char.charCodeAt(0);
  return code >= 65 && code <= 90 ? code + UPPERCASE_OFFSET : code + LOWERCASE_OFFSET;
};

const input$ = getInputStream(path.resolve(__dirname, 'input.txt'));

const part1$ = input$
  .pipe(
    map((line) => [new Set(line.slice(0, line.length / 2)), new Set(line.slice(line.length / 2))]),
    mergeMap(([left, right]) => intersection(left, right)),
    reduce((acc, char) => acc + getPriority(char), 0)
  )
  .subscribe(console.log);

const part2$ = input$
  .pipe(
    bufferCount(3),
    map((lines) => lines.map((s) => new Set(s.split('')))),
    mergeMap((sets) => intersection(...sets)),
    reduce((acc, char) => acc + getPriority(char), 0)
  )
  .subscribe(console.log);
