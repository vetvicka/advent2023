import fs from 'fs';

function parseLine(line: string) {
    const [row, groups] = line.split(' ');
    return {
        row,
        groups: groups.split(',').map(num => parseInt(num))
    };

}

export function parseFile(filePath: string) {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const lines = fileContents.split('\n');
    return lines
        .filter(line => line.length > 0)
        .map(parseLine);
}

export function timesFive(parsed: {row: string, groups: number[]}[]) {
    return parsed.map(({row, groups}) => {
        return {
            row: row + ("?" + row).repeat(4),
            groups: [...groups, ...groups, ...groups, ...groups, ...groups]
        }
    })  
}

