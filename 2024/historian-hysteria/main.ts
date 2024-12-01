import { createReadStream } from "node:fs";
import { createInterface } from "node:readline";
import { join } from "node:path";

async function parseInputStream(
	filePath: string,
): Promise<[number[], number[]]> {
	const leftList: number[] = [];
	const rightList: number[] = [];

	try {
		const fileStream = createReadStream(join(__dirname, filePath));
		const rl = createInterface({
			input: fileStream,
			crlfDelay: Number.POSITIVE_INFINITY,
		});

		for await (const line of rl) {
			const numbers = line.trim().split(/\s+/);

			if (numbers.length !== 2) {
				throw new Error(`Invalid line format: ${line}`);
			}

			const [left, right] = numbers.map((n) => {
				const num = Number(n);
				if (Number.isNaN(num)) {
					throw new Error(`Invalid number: ${n}`);
				}
				return num;
			});

			leftList.push(left);
			rightList.push(right);
		}

		if (leftList.length === 0 || rightList.length === 0) {
			throw new Error("Empty input lists");
		}

		return [leftList, rightList];
	} catch (error) {
		console.error("Error reading or parsing input:", error);
		process.exit(1);
	}
}

function calculateTotalDistance(
	leftList: number[],
	rightList: number[],
): number {
	const sortedLeft = [...leftList].sort((a, b) => a - b);
	const sortedRight = [...rightList].sort((a, b) => a - b);

	let totalDistance = 0;
	for (let i = 0; i < sortedLeft.length; i++) {
		totalDistance += Math.abs(sortedLeft[i] - sortedRight[i]);
	}

	return totalDistance;
}

function calculateSimilarityScore(
	leftList: number[],
	rightList: number[],
): number {
	let totalScore = 0;

	// Count occurrences in right list
	const rightCounts = new Map<number, number>();
	for (const num of rightList) {
		rightCounts.set(num, (rightCounts.get(num) || 0) + 1);
	}

	// Calculate score for each number in left list
	for (const leftNum of leftList) {
		const occurrences = rightCounts.get(leftNum) || 0;
		totalScore += leftNum * occurrences;
	}

	return totalScore;
}

async function main() {
	const [leftList, rightList] = await parseInputStream("input.txt");

	// Part One
	const distance = calculateTotalDistance(leftList, rightList);
	console.log("Part 1 - Total distance:", distance);

	// Part Two
	const similarity = calculateSimilarityScore(leftList, rightList);
	console.log("Part 2 - Similarity score:", similarity);
}

main().catch((error) => {
	console.error("Error:", error);
	process.exit(1);
});
