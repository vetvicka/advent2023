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

const operations = parsed.map(op => {
    const operation = op.includes('=') ? '=' : '-';
    const [label, focus] = op.split(operation);
    return {
        operation,
        label,
        hash: hash(label),
        focus: parseInt(focus)
    }
})

const boxes: typeof operations[] = new Array(256).fill([]).map(() => []);

operations.forEach(op => {
    if (op.operation === '-') {
        boxes[op.hash] = boxes[op.hash].filter(({ label }) => label !== op.label);
    } else {
        const found = boxes[op.hash].find(({ label }) => label === op.label);
        if (found) {
            found.focus = op.focus;
        } else {
            boxes[op.hash].push(op)
        }
    }
})

const focusingPower = boxes
    .flatMap((box, boxIndex) => box
        .map(({ focus }, lensIndex) => (boxIndex + 1) * (lensIndex + 1) * focus)
    )
    .reduce((acc, curr) => acc + curr, 0);

console.log('part2', focusingPower);