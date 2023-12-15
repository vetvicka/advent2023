import { parseFile } from './parse'

const parsed = parseFile('input.txt');

function rollColumn(map: string[][], column: number){
    let emptyIndex: number[] = [];
    for(let row = 0; row < map.length; row++){
        if(map[row][column] === '.'){
            emptyIndex.push(row);
        }
        if(map[row][column] === '#'){
            emptyIndex = [];
        }
        if(map[row][column] === 'O'){
            const emptyRow = emptyIndex.shift();
            if (emptyRow === undefined) {
                continue;
            }
            map[row][column] = '.';
            map[emptyRow][column] = 'O';
            emptyIndex.push(row);
            emptyIndex.sort((a, b) => a - b);
        }
    }
}

function rollAll(map: string[][]){
    for(let i = 0; i < map[0].length; i++){
        rollColumn(map, i);
    }
}

function sumRocks(map: string[][]){
    return map.reduce((sum, row, rowIndex) => {
        return sum + row.reduce((rowSum, char) => {
            const add = char === 'O' ? map.length - rowIndex : 0;
            return rowSum + add;
        }, 0)
    }, 0);
}



function rotateMap(map: string[][]){
    const rotated: string[][] = [];
    for(let i = 0; i < map[0].length; i++){
        rotated[i] = [];
        for(let j = map.length - 1; j >= 0; j--){
            rotated[i].push(map[j][i]);
        }
    }
    return rotated;
}

let prev = 0;
let rotatedMap: string[][];
function cycle(){
    for(let i = 0; i < 4; i++){
        rollAll(rotatedMap);
        rotatedMap = rotateMap(rotatedMap);
    }
    return sumRocks(rotatedMap);
}

function infiniteCycle(map: string[][]) {
    rotatedMap = map;
    let cycleCount = 1;
    const history: number[][] = [];
    let double: number;
    while(true) {
        const current = cycle();
        if (cycleCount > 1000) {
            history.push([cycleCount, current]);
        }
        if (cycleCount > 2000) {
            break;
        }
        cycleCount++;
        if (current === prev) {
            double = current;
        }
        prev = current;
    }
    const recentHistory = history.slice(-100);
    const first = recentHistory.findIndex(([cycle, sum]) => sum === double);
    const second = recentHistory.findIndex(([cycle, sum], i) => i > first + 1 && sum === double );
    const interval = second - first;

    let totalCycles = 1000000000;
    while(totalCycles > 2000){
        totalCycles -= interval;
    }
    const res = history.find(([cycle, sum]) => cycle === totalCycles);

    return res![1];
}


rollAll(parsed);
console.log("part1: ", sumRocks(parsed))

const parsed2 = parseFile('input.txt');
console.log("part2: ", infiniteCycle(parsed2))