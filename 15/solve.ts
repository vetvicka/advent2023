import { parseFile } from './parse'

const parsed = parseFile('input.txt');

function hash(input: string) {
    return input.split('').reduce((acc, curr) => {
        const withAscii = acc + curr.charCodeAt(0);
        return (withAscii * 17) % 256;
    }, 0);
}

const part1 = parsed.map(hash).reduce((acc, curr) => acc + curr, 0);

console.log('part1', part1);