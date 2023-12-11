import { parseFile } from './parse'

type position = [number, number];

function allGalaxies(lines: string[][]) {
    const result: position[] = [];
    for (let line = 0; line < lines.length; line++) {
        for (let col = 0; col < lines[line].length; col++) {
            if (lines[line][col] === '#') {
                result.push([line, col]);
            }
        
        }
    }
    return result;
}

function allGalaxyPairs(galaxies: position[]) { 
    const result: [position, position][] = [];
    for (let i = 0; i < galaxies.length; i++) {
        for (let j = i + 1; j < galaxies.length; j++) {
            result.push([galaxies[i], galaxies[j]]);
        }
    }
    return result;
}

function distance(a: position, b: position, lines: string[][], expansionMultiplier = 2) {
    let lineDistance = 0;
    let colDistance = 0;
    const lineFrom = Math.min(a[0], b[0]);
    const lineTo = Math.max(a[0], b[0]);
    const colFrom = Math.min(a[1], b[1]);
    const colTo = Math.max(a[1], b[1]);

    for (let line = lineFrom; line < lineTo; line++) {
        lineDistance += lines[line][a[1]] === '*' ? expansionMultiplier : 1;
    }
    for (let col = colFrom; col < colTo; col++) {
        colDistance += lines[a[0]][col] === '*' ? expansionMultiplier : 1;
    }
    return lineDistance + colDistance;
}

function solveFile(filePath: string) {
    const parsed = parseFile(filePath);

    const galaxies = allGalaxies(parsed);
    const pairs = allGalaxyPairs(galaxies);
    const sumAll = pairs
        .map(pair => distance(pair[0], pair[1], parsed))
        .reduce((a, b) => a + b, 0);

    const sumAll2 = pairs
        .map(pair => distance(pair[0], pair[1], parsed, 1000000))
        .reduce((a, b) => a + b, 0);

    console.log("part1: ", sumAll);
    console.log("part2: ", sumAll2);
}

solveFile('input.txt');