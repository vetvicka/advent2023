import fs from 'fs';

export function parseFile(filePath: string) {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const lines = fileContents.split('\n');
    return lines
        .filter(line => line.length > 0)
        .map(line => line.split('').map(x => parseInt(x)));
}