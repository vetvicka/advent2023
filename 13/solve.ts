import { parseFile, flip } from './parse'

const parsed = parseFile('input.txt');

function findReflections(map: string[]) {
    const edge = map[0];
    const candidates: number[] = [];
    for (let i = 1; i < map.length; i += 2) {
        const row = map[i];
        if (row[0] === edge[0]) {
            candidates.push(i);
        }
    }
    return candidates.reduce((acc, candidate) => {
        let isMirror = true;
        for (let i = 0; i < candidate / 2; i++) {
            const front = map[i];
            const back = map[candidate - i];
            if (front !== back) {
                isMirror = false;
                break;
            }
        }
        if (isMirror) {
            acc.push(candidate);
        }
        return acc;
    }, [] as any);
}

function bothDirections(map: string[]) {
    const flipped = flip(map);
    const results = findReflections(map)
        .map((i: number) => Math.ceil(i / 2));
    const reversedResults = findReflections((map as any).toReversed())
        .map((i: number) => map.length - Math.ceil(i / 2));
    return new Set([...results, ...reversedResults]);
}

function bothOrientations(data: { original: string[], flipped: string[] }) {
    const original = bothDirections(data.original);
    const flipped = bothDirections(data.flipped);
    const both = [...flipped, ...[...original].map(value => value * 100)]
    return both.reduce((acc, value) => acc + value, 0);
}

function bothOrientations2(data: { original: string[], flipped: string[] }) {
    const original = bothDirections(data.original);
    const flipped = bothDirections(data.flipped);
    return [...flipped, ...[...original].map(value => value * 100)]
}

const part1Results = parsed.map(bothOrientations);
console.log("part1: ", part1Results.reduce((acc, value) => acc + value, 0));

function findSmudge(map: string[], mapIndex = 0) {
    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[i].length; j++) {
            const originalElement = map[i][j];
            const originalLine = map[i];
            const newElement = originalElement === '#' ? '.' : '#';
            map[i] = map[i].substring(0, j) + newElement + map[i].substring(j + 1);
            const exampleDataInner = {
                original: map,
                flipped: flip(map),
            }
            const changedCharResult = bothOrientations2(exampleDataInner);
            const newResult = changedCharResult.find((el) => part1Results[mapIndex] !== el)
            map[i] = originalLine;
            if (newResult) {
                return newResult
            }
        }    
    }
}

const part2Results = parsed.map((data, i) => findSmudge(data.original, i));
console.log("part2:", part2Results.reduce((acc, value) => acc + value, 0))