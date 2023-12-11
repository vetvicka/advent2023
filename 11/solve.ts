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

function distance(a: position, b: position) {
    return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
}

function solveFile(filePath: string) {
    const parsed = parseFile(filePath);
    // console.log(parsed.map(line => line.join('')).join('\n')) 

    const galaxies = allGalaxies(parsed);
    const pairs = allGalaxyPairs(galaxies);
    const sumAll = pairs
        .map(pair => distance(pair[0], pair[1]))
        .reduce((a, b) => a + b, 0);

    console.log("part1: ", sumAll);
}

solveFile('input.txt');