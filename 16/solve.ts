import { parseFile } from './parse'

import { memoize } from 'lodash';

const parsed = parseFile('input.txt') as Tile[][];

enum Direction {
    Up,
    Down,
    Left,
    Right
}

type Tile = '.' | '-' | '|' | '/' | '\\';

function nextDirectionCoordinates(direction: Direction, x: number, y: number) {
    switch (direction) {
        case Direction.Up:
            return { x, y: y - 1 };
        case Direction.Down:
            return { x, y: y + 1 };
        case Direction.Left:
            return { x: x - 1, y };
        case Direction.Right:
            return { x: x + 1, y };
    }
}

function isOutOfBounds(x: number, y: number, map: string[][]) {
    return x < 0 || y < 0 || y >= map.length || x >= map[y].length;
}

function nextStep(direction: Direction, prevX: number, prevY: number, map: string[][]) {
    const { x, y } = nextDirectionCoordinates(direction, prevX, prevY);
    if (isOutOfBounds(x, y, map)) {
        return [];
    }
    const tile = map[y][x];
    if (direction === Direction.Right) {
        if (tile === '|') {
            return [
                { direction: Direction.Up, x, y },
                { direction: Direction.Down, x, y },
            ];
        }
        if (tile === '\\') {
            return [{ direction: Direction.Down, x, y }];
        }
        if (tile === '/') {
            return [{ direction: Direction.Up, x, y }];
        }
        return [{direction: Direction.Right, x, y}]
    }
    if (direction === Direction.Down) {
        if (tile === '-') {
            return [
                { direction: Direction.Left, x, y },
                { direction: Direction.Right, x, y },
            ];
        }
        if (tile === '\\') {
            return [{ direction: Direction.Right, x, y }];
        }
        if (tile === '/') {
            return [{ direction: Direction.Left, x, y }];
        }
        return [{direction: Direction.Down, x, y}]
    }
    if (direction === Direction.Left) {
        if (tile === '|') {
            return [
                { direction: Direction.Up, x, y },
                { direction: Direction.Down, x, y },
            ];
        }
        if (tile === '\\') {
            return [{ direction: Direction.Up, x, y }];
        }
        if (tile === '/') {
            return [{ direction: Direction.Down, x, y }];
        }
        return [{direction: Direction.Left, x, y}]
    }
    if (direction === Direction.Up) {
        if (tile === '-') {
            return [
                { direction: Direction.Left, x, y },
                { direction: Direction.Right, x, y },
            ];
        }
        if (tile === '\\') {
            return [{ direction: Direction.Left, x, y }];
        }
        if (tile === '/') {
            return [{ direction: Direction.Right, x, y }];
        }
        return [{direction: Direction.Up, x, y}]
    }
    return [];
}

const energize = memoize(({direction, x, y}, energizedTiles, steps) => {
    energizedTiles[y][x] = 1;
    steps.push({direction, x, y});
}, ({direction, x, y}) => `${x},${y} ${direction}`);

function solve(map: Tile[][]) {
    const energizedTiles = map.map(row => row.map(() => 0));
    const steps = [{direction: Direction.Right, x: -1, y: 0}];
    energize.cache.clear?.();
    while (steps.length > 0) {
        const step = steps.pop();
        if (!step) {
            throw new Error('step error should never happen');
        }
        const nextSteps = nextStep(step.direction, step.x, step.y, map);
        nextSteps.forEach(nextStep => energize(nextStep, energizedTiles, steps));
    }
    return energizedTiles.reduce((sum, row) => sum + row.reduce((sum, tile) => sum + tile, 0), 0);
}

console.log('part1: ', solve(parsed))