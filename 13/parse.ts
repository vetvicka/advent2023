import fs from 'fs';

export function flip(map: string[]) {
    const res = Array(map[0].length).fill('');
    map.forEach((row, i) => {
        const splitted = row.split('');
        splitted.forEach((char, j) => {
            res[j] += char;
        });
    });
    return res;
}

export function parseFile(filePath: string) {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const lines = fileContents.split('\n');
    return lines
        .reduce((acc, line) => {
            if (line === '') {
                return [...acc, []];
            }
            acc[acc.length - 1].push(line);
            return acc;
        }, [[]] as string[][])
        .map(map => ({ original: map, flipped: flip(map) }))
}