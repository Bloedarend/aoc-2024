const input = Deno.readTextFileSync(Deno.args[0]);

function mul(a: number, b: number) {
    return a * b;
}

function getSum(string: string) {
    const regex = /mul\(\d{1,3},\d{1,3}\)/g;
    const matches = string.matchAll(regex).toArray().map((match) => match[0]);
    
    return matches.reduce((acc, match) => acc + eval(match), 0);
}

const sum = getSum(input);
console.log("Part 1:", sum);

const enabled = input
    .split(/(?=do\(\))|(?=don't\(\))/g)
    .filter((line) => !line.startsWith("don't()"))
    .join("");

const accurate = getSum(enabled);
console.log("Part 2:", accurate);