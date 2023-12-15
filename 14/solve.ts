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

rollAll(parsed);

console.log("part1: ", sumRocks(parsed))

