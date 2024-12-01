import path from "node:path";
import { count, filter, map } from "rxjs";
import { getInputStream } from "../common/get-input-stream";

const input$ = getInputStream(path.resolve(__dirname, "input.txt")).pipe(
	map((line) => line.split(",")),
	map((line) =>
		line.map(
			(item) =>
				item.split("-").map((v) => Number.parseInt(v)) as [number, number],
		),
	),
);

function isSubset(range1: [number, number], range2: [number, number]) {
	return range1[0] >= range2[0] && range1[1] <= range2[1];
}

function hasOverlap(
	range1: [number, number],
	range2: [number, number],
): boolean {
	return range1[0] <= range2[1] && range1[1] >= range2[0];
}

const part1$ = input$
	.pipe(
		filter(
			([first, second]) => isSubset(first, second) || isSubset(second, first),
		),
		count(),
	)
	.subscribe(console.log);

const part2$ = input$
	.pipe(
		filter(([first, second]) => hasOverlap(first, second)),
		count(),
	)
	.subscribe(console.log);
