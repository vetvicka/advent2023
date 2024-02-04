import fs from 'fs';

export type Point = {
    x: number;
    y: number;
    z: number;
}

export type Brick = [Point, Point];

function parseBrick(line: string) {
    const [a, b] = line.split('~');
    const [x1, y1, z1] = a.split(',').map(x => parseInt(x, 10));
    const [x2, y2, z2] = b.split(',').map(x => parseInt(x, 10));
    return [
        {x: x1, y: y1, z: z1},
        {x: x2, y: y2, z: z2},
    ] as Brick;
}

export function parseFile(filePath: string) {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const lines = fileContents.split('\n');
    const bricks: Brick[] = lines
        .filter(line => line.length > 0)
        .map(parseBrick);
    
    const maxX = Math.max(...bricks.map(brick => Math.max(brick[0].x, brick[1].x)));
    const maxY = Math.max(...bricks.map(brick => Math.max(brick[0].y, brick[1].y)));

    return {
        bricks,
        maxX,
        maxY
    }
}