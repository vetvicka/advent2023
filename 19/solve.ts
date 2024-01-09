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

function invertRule(rule: Rule): Rule {
    switch (rule.operator) {
        case "<":
            return {
                ...rule,
                operator: ">",
                value: rule.value - 1,
            }
        case ">":
            return {
                ...rule,
                operator: "<",
                value: rule.value + 1,
            }
    }
    throw new Error("Cannot invert redirect rule")
}

function instructionChains(instructions: { [key: string]: Rule[] }, currentKey: string = "in", chain: Rule[] = []) {
    const chains: Rule[][] = [];
    const rules = instructions[currentKey];
    rules.forEach(rule => {
        if (rule.operator === "redirect") {
            if (["A", "R"].includes(rule.target)) {
                chains.push([...chain, rule])
            } else {
                chains.push(...instructionChains(instructions, rule.target, [...chain, rule]))
            }
        } else if(["A", "R"].includes(rule.target)){
            chains.push([...chain, rule])
        } else {
            chains.push(...instructionChains(instructions, rule.target, [...chain, rule]))
        }
        if (rule.operator !== "redirect") {
            chain.push(invertRule(rule))
        }
    })
    return chains;
}

function solve2() {
    const res = instructionChains(parsed.instructions)
        .filter(chain => chain[chain.length - 1].target === "A")
    const ranges = res.map(chain => {
        const propertyRanges = {
            x: [1, 4000],
            m: [1, 4000],
            a: [1, 4000],
            s: [1, 4000],
        }
        chain.filter(rule => rule.operator !== "redirect")
            .forEach(rule => {
                if (rule.operator === "<") {
                    propertyRanges[rule.property][1] = Math.min(propertyRanges[rule.property][1], rule.value - 1)
                }
                if (rule.operator === ">") {
                    propertyRanges[rule.property][0] = Math.max(propertyRanges[rule.property][0], rule.value + 1)
                }
            })
        return propertyRanges;
    })
    const product = ranges.map(({x,m,a,s}) => {
        return (x[1] - x[0] + 1) * (m[1] - m[0] + 1) * (a[1] - a[0] + 1) * (s[1] - s[0] + 1);
    })
    console.log("part2: ", product.reduce((acc, x) => acc + x, 0))
}

solve()

solve2();