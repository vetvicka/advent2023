import { parseFile } from './parse'

const parsed = parseFile('input.txt');

function isValid(row: string, groups: number[]) {
    let index = 0;
    return groups.every(group => {
        const firstSpring = row.indexOf("#", index);

        for (let i = firstSpring; i < firstSpring + group; i++) {
            if (row[i] !== "#") {
                return false;
            }
        }
        index = firstSpring + group;
        return row[firstSpring + group] === "." || (firstSpring + group) === row.length;
    })
}

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
