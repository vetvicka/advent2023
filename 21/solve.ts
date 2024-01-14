import fs from 'fs';

import { parseFile } from './parse'

const {map: parsedMap, startingPosition} = parseFile('input.txt');
let map = parsedMap;

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

function copyMap(xOffset: number, yOffset:number, newMap: string[][]) {
    const size = map.length;
    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            newMap[y + yOffset][x + xOffset] = map[y][x];
        }
    }
}

function sumSquare(xOffset: number, yOffset:number, size: number) {
    let count = 0;
    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            count += map[y + yOffset][x + xOffset] === 'O' ? 1 : 0;
        }
    }
    return count
}

function numberOfSquaresToSum(horzintalSquares: number) {
    const offCenterCount = horzintalSquares - 2;
    const centerCount = horzintalSquares - 4;

    const offCenter = (Math.floor(offCenterCount / 2) / 2) * (Math.floor(offCenterCount / 2) + 1) +
        (Math.ceil(offCenterCount / 2) / 2) * (Math.ceil(offCenterCount / 2) + 1)
    const center = (Math.floor(centerCount / 2) / 2) * (Math.floor(centerCount / 2) + 1) +
        (Math.ceil(centerCount / 2) / 2) * (Math.ceil(centerCount / 2) + 1)
    return {
        offCenter,
        center,
    }
}

function solve2() {
    const {map: parsedMap, startingPosition} = parseFile('input.txt');
    map = parsedMap;
    map[startingPosition.y][startingPosition.x] = '.'
    // grow the map to 5x5
    const originalSize = map.length;
    const size5 = originalSize * 5;
    const map5: string[][] = new Array(size5).fill(0).map(() => new Array(size5).fill('?'));
    for (let y = 0; y < size5; y += originalSize) {
        for (let x = 0; x < size5; x += originalSize) {
            copyMap(x, y, map5);
        }
    }
    map5[startingPosition.y + 2 * originalSize][startingPosition.x + 2 * originalSize] = 'O'
    map = map5;
    for (let i = 0; i < 65 + originalSize * 2; i++) {
        markNextPossibleMoves();
    }
    fs.writeFileSync('map5.txt', map5.map(row => row.join('')).join('\n'));
    const centerSquare = sumSquare(originalSize * 2, originalSize * 2, originalSize);
    const offCenterSquare = sumSquare(originalSize, originalSize * 2, originalSize);
    const topSquare = sumSquare(originalSize * 2, 0, originalSize);
    const rightSquare = sumSquare(originalSize * 4, originalSize * 2, originalSize);
    const bottomSquare = sumSquare(originalSize * 2, originalSize * 4, originalSize);
    const leftSquare = sumSquare(0, originalSize * 2, originalSize);

    const topRightDiagonal = sumSquare(originalSize * 3, originalSize, originalSize);
    const topLeftDiagonal = sumSquare(originalSize, originalSize, originalSize);
    const bottomRightDiagonal = sumSquare(originalSize * 3, originalSize * 3, originalSize);
    const bottomLeftDiagonal = sumSquare(originalSize, originalSize * 3, originalSize);
    
    const topRightCorner = sumSquare(originalSize * 3, 0, originalSize);
    const topLeftCorner = sumSquare(originalSize, 0, originalSize);
    const bottomRightCorner = sumSquare(originalSize * 3, originalSize * 4, originalSize);
    const bottomLeftCorner = sumSquare(originalSize, originalSize * 4, originalSize);

    const totalSteps = 26501365;
    const totalMapSize = totalSteps * 2 + 1;
    const horzintalSquares = totalMapSize / originalSize;
    let sum = 0;
    const {offCenter: offCenterCount, center: centerCount} = numberOfSquaresToSum(horzintalSquares);
    sum += centerSquare * centerCount + offCenterCount * offCenterSquare;
    sum += topSquare + rightSquare + bottomSquare + leftSquare;

    const corners = Math.floor(horzintalSquares / 2);
    const diagonals = corners - 1;

    sum += topRightCorner * corners + topLeftCorner * corners + bottomRightCorner * corners + bottomLeftCorner * corners;
    sum += topRightDiagonal * diagonals + topLeftDiagonal * diagonals + bottomRightDiagonal * diagonals + bottomLeftDiagonal * diagonals;

    console.log("part 2: ", sum);

}

solve();
solve2();