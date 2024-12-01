import fs from "node:fs";
import path from "node:path";
import readline from "node:readline";
import { type Observable, fromEvent, share, takeUntil } from "rxjs";

export function getInputStream(file: string): Observable<string> {
	const rl = readline.createInterface({
		input: fs.createReadStream(path.resolve(file)),
		crlfDelay: Number.POSITIVE_INFINITY,
	});

	const close$ = fromEvent(rl, "close");
	const lines$ = fromEvent(rl, "line") as Observable<string>;
	return lines$.pipe(share(), takeUntil(close$)) as Observable<string>;
}
