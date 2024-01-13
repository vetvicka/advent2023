import fs from 'fs';

function inititalState(type: string, inputs: string[]) {
    if (type === "%") {
        return "off";
    }
    if (type === "&") {
        return Object.fromEntries(inputs.map(input => [input, "low"]));
    }
    return null;
}
const inputMap: any = {};
function parseModule(line: string) {
    const [name, def] = line.split(" -> ");
    const module = {
        name: name[0] === "b" ? name : name.substring(1),
        type: name[0],
        outputs: def.split(", "),
        firstHigh: -1,
    }
    module.outputs.forEach(output => {
        inputMap[output] = inputMap[output] || [];
        inputMap[output].push(module.name);
    })
    return module;
}

export type Module = {
    name: string,
    type: string,
    outputs: string[],
    state: any,
    firstHigh: number,
}

export function parseFile(filePath: string) {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const lines = fileContents.split('\n');
    const entries = lines
        .filter(line => line.length > 0)
        .map(parseModule)
        .map(module => ([module.name, module]));
    const modules: {[key: string]: any} = Object.fromEntries(entries);
    for (const module of Object.values(modules)) {
        const inputs = inputMap[module.name];
        module.state = inititalState(module.type, inputs);
    }
    return modules as {[key: string]: Module};
}