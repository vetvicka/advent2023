import { parseFile, parseLine } from './parse'

const parsed = parseFile('input.txt');

function allZeroes(numbers: number[]) {
    return numbers.every(number => number === 0);
}

const example = parseLine("10 13 16 21 30 45")
const example2 = parseLine("-10 -13 -16 -21 -30 -45")


function calcDiffs(numbers: number[]) {
    const res = [numbers]
    while(!allZeroes(res[res.length - 1])) {
        const next: number[] = []
        const last = res[res.length - 1];
        for (let i = 0; i < last.length - 1; i++) {
            const element = last[i];
            const nextElement = last[i + 1];
            next.push(nextElement - element)    
        }
        res.push(next)
    }
    return res
}

function sumDiffs(diffs: number[][]) {
    return diffs.reduceRight((acc, curr) => {
        return acc + curr[curr.length - 1]
    }, 0)
}

const result = parsed
    .map(calcDiffs)
    .map(sumDiffs)
    .reduce((acc, curr) => acc + curr, 0);

console.log("part1: ", result);