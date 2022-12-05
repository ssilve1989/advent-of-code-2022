import fs from 'fs';
import path from 'path';

function simulate(lines: string[], isCrateMover9001: boolean) {
  const stacks = lines
    .slice(0, 8)
    .map((line) =>
      line
        .replaceAll(/\s\s\s\s/g, ' ')
        .replaceAll(/\[|\]/g, '')
        .split(' ')
    )
    .reduce(
      (stacks, line) => {
        line.forEach((char, index) => (char ? stacks[index].push(char) : null));
        return stacks;
      },
      Array.from({ length: 9 }).map(() => [])
    );

  const performMove = ([move, from, to]) => {
    const source = from - 1;
    const target = to - 1;
    const items = stacks[source].splice(0, move);
    const ordered = isCrateMover9001 ? items : items.reverse();
    stacks[target].unshift(...ordered);
  };

  lines
    .slice(10)
    .filter(Boolean)
    .map((line) => line.match(/\d+/g))
    .map((line) => line.map(Number))
    .forEach(performMove);

  return stacks.map((stack) => stack[0]).join('');
}

const lines = fs.readFileSync(path.resolve(__dirname, 'input.txt'), 'utf-8').split('\n');

console.log(simulate(lines, true));
console.log(simulate(lines, false));
