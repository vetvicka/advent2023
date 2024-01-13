import fs from 'fs';

export function parseFile(filePath: string) {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const lines = fileContents.split('\n');
    const map = lines
        .filter(line => line.length > 0)
        .map(line => line.split(''));
    const startingPosition = {x: 0, y: 0};
    map.forEach((row, y) => {
        row.forEach((cell, x) => {
            if (cell === 'S') {
                startingPosition.x = x;
                startingPosition.y = y;
            }
        })
    })
    return {map, startingPosition}
}