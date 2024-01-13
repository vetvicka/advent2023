import { parseFile } from './parse'

const {map, startingPosition} = parseFile('input.txt');

function isOutOfBounds(x: number, y: number) {
    return x < 0 || y < 0 || y >= map.length || x >= map[y].length;
}

function isWalkable(x: number, y: number) {
    if (isOutOfBounds(x, y)) {
        return false;
    }
    return map[y][x] !== '#';
}

function mark(x: number, y: number, symbol: string) {
    if (!isWalkable(x, y)) {
        return;
    }
    map[y][x] = symbol;
}

function move(x: number, y: number, symbol: string) {
    if (map[y][x] !== 'O') {
        return;
    }
    mark(x + 1, y, symbol);
    mark(x, y + 1, symbol);
    mark(x - 1, y, symbol);
    mark(x, y - 1, symbol);
}

function mapForEach(callback: (cell: string, x: number, y: number) => void) {
    map.forEach((row, y) => {
        row.forEach((cell, x) => {
            callback(cell, x, y);
        })
    })
}

function markNextPossibleMoves() {
    mapForEach((cell, x, y) => move(x, y, 'o'));
    const tileMap: {[key: string]: string} = {
        '.': '.',
        'o': 'O',
        'O': '.',
        '#': '#',
    }
    mapForEach((cell, x, y) => mark(x, y, tileMap[cell]));
}

function solve() {
    map[startingPosition.y][startingPosition.x] = 'O'
    for (let i = 0; i < 64; i++) {
        markNextPossibleMoves();
    }
    let count = 0;
    mapForEach((cell) => { if (cell === "O") count++; })
    console.log("part 1: ", count);
}

solve();