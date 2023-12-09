import fs from 'fs';

export function parseLine(line: string) {
    return line.split(' ').map(number => parseInt(number));
}

export function parseFile(filePath: string) {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const lines = fileContents.split('\n');
    return lines
        .filter(line => line.length > 0)
        .map(parseLine)
}