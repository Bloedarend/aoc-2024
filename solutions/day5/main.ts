const input = Deno.readTextFileSync(Deno.args[0]);

let split = false;
const { rules, updates } = input.split("\n")
    .map(line => line.replace(/\s+/g, ""))
    .reduce((acc, line) => {
        if (line === "") {
            split = true;
        } else if (!split) {
            const [key, value] = line.split("|");
            acc.rules.set(key, [...(acc.rules.get(key) ?? []), value]);
        } else {
            acc.updates.push(line.split(","));
        }

        return acc;
    }, { rules: new Map(), updates: [] } as { rules: Map<string, string[]>, updates: string[][] });

const valid = updates.filter(update => {
    for (let i = 0; i < update.length; i++) {
        const value = update[i];
        const rule = rules.get(value);

        if (rule) {
            for (const num of rule) {
                const index = update.indexOf(num);
                if (index >= 0 && index < i) {
                    return false;
                }
            }
        }
    }
    
    return true;
});

const invalid = updates.filter(update => !valid.includes(update));
const corrected = invalid.map(update => 
    update.sort((a, b) => {
        const ruleA = rules.get(a);
        if (ruleA) {
            const index = ruleA.indexOf(b);
            if (index >= 0) {
                return -1;
            }
        }

        const ruleB = rules.get(b);
        if (ruleB) {
            const index = ruleB.indexOf(a);
            if (index >= 0) {
                return 1;
            }
        }

        return 0;
    })
);

function getSum(updates: string[][]) {
    return updates.map(update => update[Math.ceil((update.length - 1) / 2)]).reduce((acc, value) => acc + Number(value), 0);
}

const sum = getSum(valid);
console.log("Part 1:", sum);

const ordered = getSum(corrected);
console.log("Part 2:", ordered);
