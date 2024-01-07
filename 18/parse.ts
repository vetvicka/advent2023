import fs from 'fs';

export type Direction = 'U' | 'D' | 'L' | 'R';

export function parseFile(filePath: string) {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const lines = fileContents.split('\n');
    return lines
        .filter(line => line.length > 0)
        .map(line => {
            const [direction, length, color] = line.split(' ');
            return {
                direction: direction as Direction,
                length: parseInt(length, 10),
                color: color.substring(1, 8)
            };
        });
}

export function parseFile2(filePath: string) {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const lines = fileContents.split('\n');
    const directionMap: { [key: number]: Direction } = {
        0: 'R',
        1: 'D',
        2: 'L',
        3: 'U',
    }
    return lines
        .filter(line => line.length > 0)
        .map(line => {
            const [direction, length, color] = line.split(' ');
            const colorHex = color.substring(1, 8);

            return {
                direction: directionMap[parseInt(colorHex[6])] as Direction,
                length: parseInt(colorHex.substring(1, 6), 16),
                color: color.substring(1, 8)
            };
        });
}