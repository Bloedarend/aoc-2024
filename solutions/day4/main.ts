const input = Deno.readTextFileSync(Deno.args[0]);

const WORD = "XMAS";
const CROSS_WORD = "MAS";

const grid = input.split("\n").map(line => line.replace(/\s+/g, "").split(""));
const horizontal = grid.map(row => row.join(''));
const vertical = grid.map((_, i) => grid.map(row => row[i]).join(""));
const diagonal = toDiagonals(grid);
const diagonalReversed = toDiagonals(grid.reverse());

function toDiagonals(grid: string[][]): string[] {
    const lines = [];

    for (let i = 1; i < horizontal.length; i++) {
        let line = "";
        for (let j = i; j < vertical.length; j++) {
            line += grid[j][j - i];
        }

        lines.push(line);
    }

    for (let i = 0; i < vertical.length; i++) {
        let line = "";
        for (let j = i; j < horizontal.length; j++) {
            line += grid[j - i][j];
        }

        lines.push(line);
    }

    return lines
}

function getWordCount(lines: string[]) {
    return lines.reduce((acc, line) => acc + (line.matchAll(new RegExp(`(?=${WORD})|(?=${WORD.split("").reverse().join("")})`, 'g')).toArray().length), 0);
}

const wordCount = getWordCount(horizontal) + getWordCount(vertical) + getWordCount(diagonal) + getWordCount(diagonalReversed);
console.log("Part 1:", wordCount);

const crossWordCount = grid.flatMap((row, i) => row.filter((_, j) => {
    let TlToBr, BrToTl, TrToBl, BlToTr;

    try {
        TlToBr = grid[i - 1][j - 1] + grid[i][j] + grid[i + 1][j + 1];
        BrToTl = grid[i + 1][j + 1] + grid[i][j] + grid[i - 1][j - 1];
        TrToBl = grid[i - 1][j + 1] + grid[i][j] + grid[i + 1][j - 1];
        BlToTr = grid[i + 1][j - 1] + grid[i][j] + grid[i - 1][j + 1];
    } catch(_) { /* Ignored */ }

    return (TlToBr === CROSS_WORD || BrToTl === CROSS_WORD) && (TrToBl === CROSS_WORD || BlToTr === CROSS_WORD);
}), [] as string[]).length;
console.log("Part 2:", crossWordCount);