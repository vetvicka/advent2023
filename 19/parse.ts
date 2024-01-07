import fs from 'fs';

export type Part = {
    x: number,
    m: number,
    a: number,
    s: number,
}

export type Rule = {
    operator: "redirect",
    target: string,
} | {
    operator: "<" | ">",
    property: keyof Part,
    value: number,
    target: string,
}

function parseRule(input: string): Rule {
    if (!input.includes(":")) {
        return {
            operator: "redirect",
            target: input,
        };
    }
    const [rule, target] = input.split(":");
    const opIndex = rule.search(/[<>]/);
    const operator = rule[opIndex] as "<" | ">";
    const property = rule.slice(0, opIndex) as keyof Part;
    const value = parseInt(rule.slice(opIndex + 1));
    return {
        operator,
        property,
        value,
        target,
    }
}

function parseInstruction(rule: string) {
    const [key, rest] = rule.split("{")
    const rules = rest.slice(0, -1)
        .split(",")
        .map(parseRule)
    return {
        key,
        rules
    }
}

function parsePart(part: string) {
    const entries =  part.slice(1, -1)
        .split(",")
        .map(property => {
            const [key, value] = property.split("=");
            return [key, parseInt(value)];
        })
    return Object.fromEntries(entries);
}



export function parseFile(filePath: string) {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const lines = fileContents.split('\n');
    const gapIndex = lines.findIndex(line => line === "");
    const parts = lines.slice(gapIndex + 1);
    const instructions = lines.slice(0, gapIndex)
        .filter(line => line.length > 0)
        .map(parseInstruction)
        .map(({key, rules}) => [key, rules]);
    return {
        instructions: Object.fromEntries(instructions), 
        parts: parts.filter(line => line.length > 0).map(parsePart), 
    }
}