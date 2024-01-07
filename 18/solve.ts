import { parseFile, parseFile2, normalizeMapDimensions, Instruction, mapDimensions, Line, Direction } from './parse'

const parsed = parseFile('input.txt');

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
                allTiles.push(neighbour);
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

function isLineInRange(line: Line, y: number) {
    return line.y1 <= y && line.y2 >= y;
}

function lineDirection(line: Line, y: number) {
    if (line.y1 !== y && line.y2 !== y) {
        return null
    }
    if (line.y1 === y && line.y2 < y) { return "U"; }
    if (line.y2 === y && line.y1 < y) { return "U"; }
    return "D";
}

function solve2(parsed: ReturnType<typeof parseFile2>) {
    const {lines, dimensions} = parsed;
    let result = 0;
    let progress;
    for(let i = 0; i < dimensions.y; i++) {
        const relevantLines = lines.filter(line => isLineInRange(line, i));
        if (!relevantLines.length) {
            continue;
        }
        let lineResult = 0
        

        while (relevantLines.length) {
            let from = relevantLines.shift()!;
            let to: Line | null = null;
            let prevDirection: Direction | null = lineDirection(from, i);
            let ups = 0;
            let downs = 0;
            if (prevDirection) {
                prevDirection === 'U' ? ups++ : downs++;
            } else {
                ups++;
                downs++;
            }
            while (relevantLines.length) {
                to = relevantLines.shift()!;
                if (to.y1 !== i && to.y2 !== i) {
                    break;
                }
                let direction: Direction | null = lineDirection(to, i);
                if (direction) {
                    direction === 'U' ? ups++ : downs++;
                }
                if (ups % 2 === 0 && downs % 2 === 0) {
                    break;
                }
            }
            if (!to) {
                throw new Error('oooops');
            }
            lineResult += to.x - from.x + 1;
        }
        if (i % 1000 === 0) {
            const newProgress = Math.round(i / dimensions.y * 100);
            if (newProgress !== progress && newProgress % 10 === 0) {
                progress = newProgress;
                console.log('Progress: ', progress)
            }
        }
        result += lineResult;
    }

    console.log('part 2: ', result)
}



const parsed2 = parseFile2('input.txt');
solve2(parsed2)

solve("part 1", parsed)