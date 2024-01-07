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
            };
        });
}

export function normalizeMapDimensions(maxDimensions: {[key in Direction]: number}) {
    return {
        map: {
            y: maxDimensions.U - maxDimensions.D + 1, // +1 because 0 is a valid coordinate
            x: maxDimensions.R - maxDimensions.L + 1,
        },
        startingPosition: {
            y: maxDimensions.U,
            x: -maxDimensions.L,
        }
    };
}

export type Instruction = {
    direction: Direction;
    length: number;
}

export function mapDimensions(instructions: Instruction[]) {
    const maxDimensions = {
        U: 0,
        R: 0,
        D: 0,
        L: 0,
    }
    const current = { x: 0, y: 0 };

    instructions.forEach(instruction => {
        switch (instruction.direction) {
            case 'U':
                current.y += instruction.length;
                if (current.y > maxDimensions.U) {
                    maxDimensions.U = current.y;
                }
                break;
            case 'R':
                current.x += instruction.length;
                if (current.x > maxDimensions.R) {
                    maxDimensions.R = current.x;
                }
                break;
            case 'D':
                current.y -= instruction.length;
                if (current.y < maxDimensions.D) {
                    maxDimensions.D = current.y;
                }
                break;
            case 'L':
                current.x -= instruction.length;
                if (current.x < maxDimensions.L) {
                    maxDimensions.L = current.x;
                }
                break;
        }
    });
    return maxDimensions;
}

function toLine({ direction, length }: Instruction, x: number, y: number) {
    if (direction === 'U') {
        return [{ x, y1: y - length, y2: y}];
    }
    if (direction === 'D') {
        return [{ x, y1: y, y2: y + length}];
    }
    return null;
}

export type Line = { x: number, y1: number, y2: number };

function instructionsToLines(instructions: Instruction[], startingPosition: { x: number, y: number }) {
    let currentPosition = { ...startingPosition };
    const lines: Line[] = [];
    instructions.forEach(instruction => {
        const line = toLine(instruction, currentPosition.x, currentPosition.y);
        if (line) {
            lines.push(...line);
        }
        const {direction, length} = instruction;
        if (direction === 'U') {
            currentPosition.y -= length;
        } else if (direction === 'R') {
            currentPosition.x += length;
        } else if (direction === 'D') {
            currentPosition.y += length;
        } else if (direction === 'L') {
            currentPosition.x -= length;
        }
    });
    return lines;
}

export function parseFile2(filePath: string) {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const fileLines = fileContents.split('\n');
    const directionMap: { [key: number]: Direction } = {
        0: 'R',
        1: 'D',
        2: 'L',
        3: 'U',
    }
    const instructions = fileLines
        .filter(line => line.length > 0)
        .map(line => {
            const [direction, length, color] = line.split(' ');
            const colorHex = color.substring(1, 8);

            return {
                direction: directionMap[parseInt(colorHex[6])] as Direction,
                length: parseInt(colorHex.substring(1, 6), 16),
            };
        });
    const dimensions = mapDimensions(instructions);
    const normalisedDimensions = normalizeMapDimensions(dimensions);
    console.log(normalisedDimensions)
    const lines = instructionsToLines(instructions, normalisedDimensions.startingPosition);
    return {
        lines: lines
            .sort((a, b) => a.x - b.x),
        dimensions: normalisedDimensions.map,
    }
    
    ;
}