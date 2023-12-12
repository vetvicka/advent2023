import { memoize } from 'lodash';
import { parseFile, timesFive } from './parse'

const parsed = parseFile('input.txt');

function minGroupsLength(groupStrings: string[]) {
    return groupStrings.reduce((acc, group) => acc + group.length, 0);
}

function possiblePlacements(totalLength: number, springsToPlace: string, restOfGroups: string[]) {
    if (totalLength === 0) { return [""]; }
    const results: string[] = []
    const restLength = minGroupsLength(restOfGroups);
    const gaps = totalLength - springsToPlace.length - restLength;
    for (let i = 0; i <= gaps; i++) {
        const before = ".".repeat(i);
        const after = restOfGroups.length === 0 ? ".".repeat(gaps - i) : "";
        const result = before + springsToPlace + after;
        const allAfter = possiblePlacements(totalLength - result.length, restOfGroups[0], restOfGroups.slice(1));
        results.push(...allAfter.map(after => result + after));
    }

    return results;
}

const numberOfPlacements = memoize((row: string, groups: number[], matchLength: number = 0): number => {
    const current = row[0];
    if (matchLength > groups[0]) { 
        return 0;
    }
    if (!current) {
        if (groups.length === 1 && matchLength === groups[0]) {
            return 1;
        }
        if (groups.length === 0 && matchLength === 0) { 
            return 1
        }
        return 0;
    }

    const rest = row.slice(1);
    function leDot() {
        if (matchLength === groups[0]) {
            return numberOfPlacements(rest, groups.slice(1), 0);
        }
        if (matchLength === 0) {
            return numberOfPlacements(rest, groups, 0);
        }
        return 0;
    }
    if (current === "#") {
        return numberOfPlacements(rest, groups, matchLength + 1);
    }
    if (current === ".") {
        return leDot();
    }
    if (current === "?") {
        return numberOfPlacements(rest, groups, matchLength + 1) + leDot();
    }
    return 0;
}, (row: string, groups: number[], matchLength) => `${row} ${groups.join(",")} ${matchLength}`);

function isPermutationValidForRow(row: string, perm: string) {
    for (let i = 0; i < row.length; i++) {
        if (row[i] === "#" && perm[i] !== "#") {
            return false;
        }
        if (row[i] === "." && perm[i] !== ".") {
            return false;
        }
    }
    return true;
}

function allPermutations(row: string, groups: number[]) {
    const groupStrings = groups.map((group, i) => (i > 0 ? "." : "") + "#".repeat(group));
    return possiblePlacements(row.length, groupStrings[0], groupStrings.slice(1))
        .filter(perm => isPermutationValidForRow(row, perm));
}

const part1 = parsed
    .map(({row, groups}) => allPermutations(row, groups).length)
    .reduce((acc, val) => acc + val, 0);

console.log("part1", part1)

const parsed2 = timesFive(parsed);

const part2 = parsed2
    .map(({row, groups}) => numberOfPlacements(row, groups))
    .reduce((acc, val) => acc + val, 0);

console.log("part2: ", part2)

