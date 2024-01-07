import { parseFile, parseFile2, Direction } from './parse'

const parsed = parseFile('input.txt');

type Instruction = {
    direction: Direction;
    length: number;
    color: string;

}

function normalizeMapDimensions(maxDimensions: {[key in Direction]: number}) {
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

function mapDimensions(instructions: Instruction[]) {
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

function drawMap(map: string[][]) {
    return;
    console.log(map.map(line => line.join('')).join('\n'));
    console.log('\n')
}

function initMap(x: number, y: number) {
    return Array(y).fill([]).map(_ => Array(x).fill('.'));
}

function digTrenches(map: string[][], instructions: Instruction[], x: number, y: number) {
    const currentPosition = { x, y };
    instructions.forEach(({ direction, length }, instructionIndex) => {
        for (let i = 0; i < length; i++) {
            map[currentPosition.y][currentPosition.x] = '#';
            if (direction === 'U') {
                currentPosition.y--;
            } else if (direction === 'R') {
                currentPosition.x++;
            } else if (direction === 'D') {
                currentPosition.y++;
            } else if (direction === 'L') {
                currentPosition.x--;
            }
        }
    })
}

type Position = { x: number, y: number}

function getNeighbours(map: string[][], x: number, y: number) {
    const neighbours: Position[] = [];
    if (map[y][x + 1] === '.') {
        neighbours.push({ x: x + 1, y });
    } 
    if (map[y][x - 1] === '.') {
        neighbours.push({ x: x - 1, y });
    } 
    if (map[y + 1] && map[y + 1][x] === '.') {
        neighbours.push({ x, y: y + 1 });
    } 
    if (map[y - 1] && map[y - 1][x] === '.') {
        neighbours.push({ x, y: y - 1 });
    } 
    

    return neighbours;
}

function isEdgeOfMap(map: string[][], x: number, y: number) {
    return x === 0 || y === 0 || x === map[0].length - 1 || y === map.length - 1;
}

function digInsideTrenches(map: string[][], x: number, y: number) {
    const allTiles: Position[] = [];
    const neighbours: Position[] = [];
    if (map[y][x] !== '.') {
        return;
    }
    let isInsideTrench = true;
    allTiles.push({ x, y });
    neighbours.push({ x, y });
    if (isEdgeOfMap(map, x, y)) {
        isInsideTrench = false;
    }
    while (neighbours.length > 0) {
        const neighbour = neighbours.pop();
        if (neighbour) {
            const newNeighbours = getNeighbours(map, neighbour.x, neighbour.y);
            newNeighbours.forEach(neighbour => {
                map[neighbour.y][neighbour.x] = '?';
                neighbours.push(neighbour);
                allTiles.push(neighbour); // TODO
                if (isEdgeOfMap(map, neighbour.x, neighbour.y)) {
                    isInsideTrench = false;
                }
            })
        }
    }
    allTiles.forEach(({x, y}) => {
        map[y][x] = isInsideTrench ? '#' : '_';
    })
}

function traverseMap(map: string[][]) {
    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[0].length; x++) {
            digInsideTrenches(map, x, y);
        }
    }
}

function solve(name: string, parsed: Instruction[]) {
    // return
    const dimensions = mapDimensions(parsed);
    const normalised = normalizeMapDimensions(dimensions);
    const map = initMap(normalised.map.x, normalised.map.y);
    drawMap(map);
    digTrenches(map, parsed, normalised.startingPosition.x, normalised.startingPosition.y);
    drawMap(map);
    traverseMap(map);
    drawMap(map);

    const answer = map.reduce((acc, line) => acc + line.reduce((acc, char) => acc + (char === '#' ? 1 : 0), 0), 0);
    console.log(`${name}: `, answer)
}

solve("part 1", parsed)

const parsed2 = parseFile2('example2.txt');
// solve("part 2", parsed2)