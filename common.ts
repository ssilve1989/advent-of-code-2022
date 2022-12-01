import readline from 'readline';
import fs from 'fs';
import path from 'path';
import { fromEvent, Observable, share, takeUntil } from 'rxjs';

export function getInputStream(file: string): Observable<string> {
  const rl = readline.createInterface({
    input: fs.createReadStream(path.resolve(file)),
    crlfDelay: Infinity,
  });

  const close$ = fromEvent(rl, 'close');
  const lines$ = fromEvent(rl, 'line') as Observable<string>;
  return lines$.pipe(share(), takeUntil(close$)) as Observable<string>;
}
