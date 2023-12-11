import fs from 'fs';

const expansionSymbol = '*';

function expandLines(lines: string[][]) {
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.some(char => char === '#')) {
            continue;
        }
        const emptyLine = new Array(line.length).fill(expansionSymbol);
        lines.splice(i, 1, emptyLine);
    }
}

function expandColumns(lines: string[][]) {
    for (let col = 0; col < lines[0].length; col++) {
        let hasGalaxy = false;
        for (let line = 0; line < lines.length; line++) {
            if (lines[line][col] === '#') {
                hasGalaxy = true;
                break;
            }
        }
        if (hasGalaxy) {
            continue;
        }
        for (let line = 0; line < lines.length; line++) {
            lines[line].splice(col, 1, expansionSymbol);
        }
    }
}

export function parseFile(filePath: string) {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const lines = fileContents.split('\n');
    const data = lines
        .filter(line => line.length > 0)
        .map(line => line.split(''));
    expandLines(data);
    expandColumns(data);
    return data;
}