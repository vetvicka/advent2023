import { parseFile, Brick } from './parse'

const {bricks, maxY, maxX} = parseFile('input.txt');


function isInRange(x: number, a: number, b: number) {
    const min = Math.min(a, b);
    const max = Math.max(a, b);
    return x >= min && x <= max;
}

function brickOrientation(brick: Brick) {
    if (brick[0].x === brick[1].x) {
        return 'vertical';
    } else if (brick[0].y === brick[1].y) {
        return 'horizontal';
    } else {
        throw new Error('Invalid brick orientation');
    }
}

export function canBricksColide(a: Brick, b: Brick) {
    const aOrientation = brickOrientation(a);
    const bOrientation = brickOrientation(b);

    if (aOrientation === 'vertical' && bOrientation === 'vertical') {
        if (a[0].x !== b[0].x) {
            return false;
        }
        return isInRange(a[0].y, b[0].y, b[1].y) || isInRange(a[1].y, b[0].y, b[1].y) || isInRange(b[0].y, a[0].y, a[1].y) || isInRange(b[1].y, a[0].y, a[1].y);
    }

    if (aOrientation === 'horizontal' && bOrientation === 'horizontal') {
        if (a[0].y !== b[0].y) {
            return false;
        }
        return isInRange(a[0].x, b[0].x, b[1].x) || isInRange(a[1].x, b[0].x, b[1].x) || isInRange(b[0].x, a[0].x, a[1].x) || isInRange(b[1].x, a[0].x, a[1].x);
    }

    if (aOrientation === 'vertical' && bOrientation === 'horizontal') {
        return isInRange(a[0].x, b[0].x, b[1].x) && isInRange(b[0].y, a[0].y, a[1].y);
    }

    if (aOrientation === 'horizontal' && bOrientation === 'vertical') {
        return isInRange(b[0].x, a[0].x, a[1].x) && isInRange(a[0].y, b[0].y, b[1].y);
    }
}

function canBrickFall(brick: Brick, bricks: Brick[]) {
    const minZ = Math.min(brick[0].z, brick[1].z);
    if (minZ === 0) {
        return false;
    }
    const bricksBelow = bricks.filter(b => {
        const maxZ = Math.max(b[0].z, b[1].z);
        return maxZ === minZ - 1;
    })
    const canFall = bricksBelow.filter(b => canBricksColide(brick, b)).length === 0;
    return canFall;
}

function canBeRemoved(brick: Brick, bricks: Brick[]) {
    const bricksAfterRemoval = bricks.filter(b => b !== brick);
    return bricksAfterRemoval.every(b => !canBrickFall(b, bricksAfterRemoval));
}

function largestPossibleFall(brick: Brick, bricks: Brick[]) {
    const minZ = Math.min(brick[0].z, brick[1].z);
    const collidingBricks = bricks.filter(b => {
        const maxZ = Math.max(b[0].z, b[1].z);
        return maxZ < minZ && canBricksColide(brick, b);
    });
    const maxZ = Math.max(...collidingBricks.map(b => Math.max(b[0].z, b[1].z)), 0);
    return Math.max(minZ - maxZ - 1, 1);
}

function makeEmFall(originalBricks: Brick[]) {
    const bricks: Brick[] = originalBricks.map(brick => brick.map(p => ({...p})) as Brick);
    const fallenBricks = new Set<number>();
    let counter = 0;
    while(true) {
        let brickFell = false;
        for (let i = 0; i < bricks.length; i++) {
            if (canBrickFall(bricks[i], bricks)) {
                const delta = largestPossibleFall(bricks[i], bricks);
                bricks[i][0].z -= delta;
                bricks[i][1].z -= delta;
                brickFell = true;
                fallenBricks.add(i);
            }
        }

        if(!brickFell || counter++ > 10) {
            break;
        }
    }
    return fallenBricks.size
}

function solve() {
    bricks.sort((a, b) => a[0].z - b[0].z);
    while(true) {
        let brickFell = false;
        for (let i = 0; i < bricks.length; i++) {
            if (canBrickFall(bricks[i], bricks)) {
                const delta = largestPossibleFall(bricks[i], bricks);
                bricks[i][0].z -= delta;
                bricks[i][1].z -= delta;
                brickFell = true;
                break;
            }
        }

        if(!brickFell) {
            break;
        }
    }

    const unRemovableBricks: number[] = [];
    const removableBricksCounts = bricks.reduce((acc, brick, index) => {
        if (canBeRemoved(brick, bricks)) {
            return acc + 1;
        }
        unRemovableBricks.push(index);
        return acc;
    }, 0);

    console.log("part 1: ", removableBricksCounts);

    const chainReactions = unRemovableBricks.map(index => {
        const bricksAfterRemoval = bricks.filter((_, i) => i !== index);
        return makeEmFall(bricksAfterRemoval);
    });

    const sumOfChainReactions = chainReactions.reduce((acc, x) => acc + x, 0);

    console.log("part 2: ", sumOfChainReactions);
}

solve();