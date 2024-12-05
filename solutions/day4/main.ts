const input = Deno.readTextFileSync(Deno.args[0]);

const WORD = "XMAS";
const CROSS_WORD = "MAS";

const grid = input.split("\n").map(line => line.replace(/\s+/g, "").split(""));
const horizontal = grid.map(row => row.join(''));
const vertical = grid.map((_, i) => grid.map(row => row[i]).join(""));
const diagonal = [grid, [...grid].reverse()].flatMap(grid => 
    grid.reduce((acc, row, i) => {
        let lower = "", upper = "";
        for (let j = i; j < row.length; j++) {
            lower += grid[j][j - i];
            upper += i !== 0 ? grid[j - i][j] : "";
        }
        
        return acc.concat(lower, upper);
    }, [] as string[])
);

function getWordCount(lines: string[]) {
    return lines.reduce((acc, line) => acc + (line.matchAll(new RegExp(`(?=${WORD})|(?=${WORD.split("").reverse().join("")})`, 'g')).toArray().length), 0);
}

function getCrossWordCount() {
    return grid.flatMap((row, i) => row.filter((_, j) => {
        let TlToBr, BrToTl, TrToBl, BlToTr;
    
        try {
            TlToBr = grid[i - 1][j - 1] + grid[i][j] + grid[i + 1][j + 1];
            BrToTl = grid[i + 1][j + 1] + grid[i][j] + grid[i - 1][j - 1];
            TrToBl = grid[i - 1][j + 1] + grid[i][j] + grid[i + 1][j - 1];
            BlToTr = grid[i + 1][j - 1] + grid[i][j] + grid[i - 1][j + 1];
        } catch(_) { /* Ignored */ }
    
        return (TlToBr === CROSS_WORD || BrToTl === CROSS_WORD) && (TrToBl === CROSS_WORD || BlToTr === CROSS_WORD);
    }), [] as string[]).length;
}

const wordCount = getWordCount(horizontal) + getWordCount(vertical) + getWordCount(diagonal);
console.log("Part 1:", wordCount);

const crossWordCount = getCrossWordCount();
console.log("Part 2:", crossWordCount);