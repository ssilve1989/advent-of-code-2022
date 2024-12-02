import { createReadStream } from "node:fs";
import { join } from "node:path";
import { createInterface } from "node:readline";

function* generateSampleSet() {
	yield [7, 6, 4, 2, 1];
	yield [1, 2, 7, 8, 9];
	yield [9, 7, 6, 2, 1];
	yield [1, 3, 2, 4, 5];
	yield [8, 6, 4, 4, 1];
	yield [1, 3, 6, 7, 9];
}

async function* parseInput(filePath: string) {
	const fileStream = createReadStream(join(__dirname, filePath));
	const rl = createInterface({
		input: fileStream,
		crlfDelay: Number.POSITIVE_INFINITY,
	});

	for await (const line of rl) {
		const numbers = line.trim().split(/\s+/).map(Number);
		yield numbers;
	}
}

function isGradual(levels: number[]): boolean {
	if (levels.length < 2) return true;

	// Check if all increasing or all decreasing
	let increasing = true;
	let decreasing = true;

	for (let i = 1; i < levels.length; i++) {
		const diff = levels[i] - levels[i - 1];

		// Check if difference is between 1 and 3
		if (diff < 1 || diff > 3) increasing = false;
		if (diff > -1 || diff < -3) decreasing = false;

		// Early exit if neither pattern is possible
		if (!increasing && !decreasing) return false;
	}

	return increasing || decreasing;
}

function isSafeWithDampener(levels: number[]): boolean {
	// First check if it's already safe without removing any level
	if (isGradual(levels)) return true;

	// Try removing each level one at a time
	for (let i = 0; i < levels.length; i++) {
		const withoutLevel = [...levels.slice(0, i), ...levels.slice(i + 1)];
		if (isGradual(withoutLevel)) {
			return true;
		}
	}

	return false;
}

async function main() {
	// Initialize counters for safe reports
	let safeCount = 0;
	let safeWithDampenerCount = 0;

	// Use the async generator to process reports one by one
	for await (const report of parseInput("input.txt")) {
		if (isGradual(report)) {
			safeCount++;
		}
		if (isSafeWithDampener(report)) {
			safeWithDampenerCount++;
		}
	}

	console.log("Part 1:", safeCount);
	console.log("Part 2:", safeWithDampenerCount);
}

main();
