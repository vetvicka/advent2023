import { parseFile, Part, Rule } from './parse'

const parsed = parseFile('input.txt');

function evalRule(part: Part, rule: Rule) {
    switch (rule.operator) {
        case "<":
            return part[rule.property] < rule.value;
        case ">":
            return part[rule.property] > rule.value;
        case "redirect":
            return true;
    }
}

function evalInstruction(part: Part, instructions: { [key: string]: Rule[] }, currentKey: string = "in") {
    const rules = instructions[currentKey];
    const match = rules.find(rule => evalRule(part, rule))
    if (!match) {
        throw new Error(`No match for ${currentKey} in ${JSON.stringify(part)}`)
    }
    if (["A", "R"].includes(match.target)) {
        return match.target;
    }
    return evalInstruction(part, instructions, match.target);
}

function solve() {
    const { instructions, parts } = parsed;
    const result = parts.filter(part => evalInstruction(part, instructions) === "A")
        .reduce((acc, {x,m,a,s}) => acc + x + m + a + s, 0)

    console.log("part1: ", result)
}

solve()