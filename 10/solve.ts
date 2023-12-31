import { parseFile } from './parse'

const parsed = parseFile('input.txt');

function findS(pipes: string[][]) {
    for (let i = 0; i < pipes.length; i++) {
        for (let j = 0; j < pipes[i].length; j++) {
            if (pipes[i][j] === 'S') {
                return [i, j]
            }
        }
    }
    throw new Error('No S found')
}


const up = [-1, 0];
const down = [1, 0];
const left = [0, -1];
const right = [0, 1];

function connections(pipe: string) {
    switch (pipe) {
        case '|':
            return [up, down]
        case '-':
            return [left, right]
        case 'L':
            return [up, right]
        case 'J':
            return [up, left]
        case '7':
            return [down, left]
        case 'F':
            return [down, right]
        case 'S':
            return [left, right] // input
            // return [down, right] // example
        default:
            throw new Error(`Unknown pipe: ${pipe}`)
    }
}

function calcPosition(pos: number[], move: number[]) {
    return [pos[0] + move[0], pos[1] + move[1]]
}

function isSame(a: number[], b: number[]) {
    return a[0] === b[0] && a[1] === b[1]
}

function nextStep(previousPosition: number[], currentPosition: number[], pipes: string[][]) {
    const currentPipe = pipes[currentPosition[0]][currentPosition[1]];
    const possibleMoves = connections(currentPipe)
        .map(move => calcPosition(currentPosition, move))
    const nextMove = possibleMoves.find(move => !isSame(move, previousPosition))
    if (!nextMove) {
        throw new Error(`No next move from ${currentPosition}`)
    }
    return nextMove
}

let history: number[][] = [findS(parsed)];
const iterationLimit = 1_000_000;
for (let i = 0; i < iterationLimit; i++) {
    const currentPosition = history[history.length - 1];
    const previousPosition = history[history.length - 2] || [];
    const next = nextStep(previousPosition, currentPosition, parsed);
    if (isSame(next, history[0])) {
        break;
    }
    history.push(next);
}

history.forEach(pos => {
    const pipe = parsed[pos[0]][pos[1]]
    if (["|", "L", "J"].includes(pipe)) {
        parsed[pos[0]][pos[1]] = 'X'
    } else {
        parsed[pos[0]][pos[1]] = 'x'
    }
})

console.log("part1: ", history.length / 2)

function countLoopCrossings(currentPos: number[], pipes: string[][]) {
    let counter = 0;
    for(let i = currentPos[1]; i >= 0; i--) {
        if (pipes[currentPos[0]][i] === 'X') {
            counter++;
        }
    } 
    return counter;
}

let part2 = 0;
for (let line = 0; line < parsed.length; line++) {
    for (let col = 0; col < parsed[0].length; col++) {
        if (["x", "X", "S"].includes(parsed[line][col])) {
            continue;
        }
        const crossings = countLoopCrossings([line, col], parsed);
        if (crossings % 2 === 1) {
            part2++;
            parsed[line][col] = 'I'
        } else {
            parsed[line][col] = 'O'
        }
    }
    const element = parsed[line];
}

console.log("part2: ", part2)
    