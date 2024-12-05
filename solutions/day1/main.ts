const input = Deno.readTextFileSync(Deno.args[0]);

const { left, right } = input
    .split("\n")
    .reduce((acc: { left: number[], right: number[] }, cur: string) => {
        const matches: string[] = cur.match(/\d+/g) as string[];

        return {
            left: [...acc.left, Number(matches[0])],
            right: [...acc.right, Number(matches[1])],
        }
    }, { left: [], right: [] });

left.sort((a, b) => a - b);
right.sort((a, b) => a - b);

const distance = left.reduce((sum, cur, i) => sum + Math.abs(cur - right[i]), 0);
console.log(`Distance: ${distance}`);

const similarity = left.reduce((sum, cur) => sum + cur * right.filter(el => el === cur).length, 0);
console.log(`Similarity: ${similarity}`);