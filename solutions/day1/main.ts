const input = Deno.readTextFileSync(Deno.args[0]);

const { left, right } = input
    .split("\n")
    .reduce((acc: { left: number[], right: number[] }, line: string) => {
        const matches: string[] = line.match(/\d+/g) as string[];

        return {
            left: [...acc.left, Number(matches[0])],
            right: [...acc.right, Number(matches[1])],
        }
    }, { left: [], right: [] });

left.sort((a, b) => a - b);
right.sort((a, b) => a - b);

const distance = left.reduce((acc, cur, i) => acc + Math.abs(cur - right[i]), 0);
console.log(`Part 1: ${distance}`);

const similarity = left.reduce((acc, cur) => acc + cur * right.filter(num => num === cur).length, 0);
console.log(`Part 2: ${similarity}`);