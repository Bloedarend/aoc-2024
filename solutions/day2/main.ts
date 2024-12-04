const input = Deno.readTextFileSync(Deno.args[0]);

const MIN = 1;
const MAX = 3;

function isSafe(levels: number[], leniency: number = 0): boolean {
    const allDecrementing = isSafeRecursive(levels, leniency, (step) => step >= -1 * MAX && step <= -1 * MIN);
    const allIncrementing = isSafeRecursive(levels, leniency, (step) => step >= MIN && step <= MAX);

    return allDecrementing || allIncrementing;
}

function isSafeRecursive(levels: number[], leniency: number, condition: (step: number) => boolean): boolean {
    for (let i = 0; i < levels.length - 1; i++) {
        const current = levels[i];
        const next = levels[i + 1];

        if (!condition(next - current)) {
            if (leniency > 0) {
                const withoutCurrent = isSafeRecursive(levels.slice(0, i + 1).concat(levels.slice(i + 2)), leniency - 1, condition);
                const withoutNext = isSafeRecursive(levels.slice(0, i).concat(levels.slice(i + 1)), leniency - 1, condition);

                return withoutCurrent || withoutNext;
            }

            return false;
        }
    }

    return true;
}

const safe = input.split("\n").filter((report) => isSafe(report.split(" ").map(Number))).length;
console.log("Part 1:", safe);

const lenient = input.split("\n").filter((report) => isSafe(report.split(" ").map(Number), 1)).length;
console.log("Part 2:", lenient);