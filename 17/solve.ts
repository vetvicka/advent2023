import { parseFile } from './parse'

const parsed = parseFile('input.txt');

type Path = {
    cost: number,
    destination: string,
}
type Node = {
    x: number,
    y: number,
    neighbours: Path[],
    distance: number,
    prev: null | string,
}
const unvisitedNodes: {[key: string]: Node} = {}
const visitedNodes: {[key: string]: Node} = {}

function getNeighbour(fromX: number, fromY: number, toX: number, toY: number, direction: string) {
    if (!parsed[toY] || !parsed[toY][toX]) {
        return [];
    }
    let cost = 0;
    if (toX > fromX) {
        for (let x = fromX + 1; x <= toX; x++) {
            cost += parsed[fromY][x];
        }
    }
    if (toX < fromX) {
        for (let x = fromX - 1; x >= toX; x--) {
            cost += parsed[fromY][x];
        }
    }
    if (toY > fromY) {
        for (let x = fromY + 1; x <= toY; x++) {
            cost += parsed[x][fromX];
        }
    }
    if (toY < fromY) {
        for (let x = fromY - 1; x >= toY; x--) {
            cost += parsed[x][fromX];
        }
    }
    return [{
        cost, 
        destination: `${toX},${toY},${direction}`,
    }]
}

for (let y = 0; y < parsed.length; y++) {
    for (let x = 0; x < parsed[y].length; x++) {
        const horizontalNeighbours: Path[] = [];
        const verticalNeighbours: Path[] = [];
        for (let i = 1; i <= 3; i++) {
            horizontalNeighbours.push(...getNeighbour(x,y,x + i, y, 'right'));
            horizontalNeighbours.push(...getNeighbour(x,y,x - i, y, 'left'));
            verticalNeighbours.push(...getNeighbour(x,y,x, y + i, 'down'));
            verticalNeighbours.push(...getNeighbour(x,y,x, y - i, 'up'));
        }
        
        unvisitedNodes[`${x},${y},up`] = {x, y, neighbours: horizontalNeighbours, distance: Infinity, prev: null};
        unvisitedNodes[`${x},${y},right`] = {x, y, neighbours: verticalNeighbours, distance: Infinity, prev: null};
        unvisitedNodes[`${x},${y},down`] = {x, y, neighbours: horizontalNeighbours, distance: Infinity, prev: null};
        unvisitedNodes[`${x},${y},left`] = {x, y, neighbours: verticalNeighbours, distance: Infinity, prev: null};
    }
}


unvisitedNodes['0,0,right'].distance = 0;
unvisitedNodes['0,0,down'].distance = 0;

const unvisitedArray = Object.entries(unvisitedNodes);

function pickNextNode3() {
    let bestIndex: number | null = null;
    for (let i = 0; i < unvisitedArray.length; i++) {
        const [key, node] = unvisitedArray[i];
        if (bestIndex === null || node.distance < unvisitedArray[bestIndex][1].distance) {
            bestIndex = i;
        }
    }
    if (bestIndex === null) {
        return null;
    }
    const bestNode = unvisitedArray.splice(bestIndex, 1)[0] || null;
    return bestNode;
}

function pickNextNode2() {
    unvisitedArray.sort((a,b) => a[1].distance - b[1].distance);
    const result = unvisitedArray.shift() || null;
    return result;
}

function pickNextNode() {
    let bestNode: [string, Node] | null = null;
    for (const [key, node] of Object.entries(unvisitedNodes)) {
        if (bestNode === null || node.distance < bestNode[1].distance) {
            bestNode = [key, node];
        }
    }
    if (bestNode && bestNode[1].distance === Infinity) {
        return null;
    }
    return bestNode;
}

function result() { 
    return Math.min(
            visitedNodes[`${parsed[0].length - 1},${parsed.length - 1},right`].distance,
            visitedNodes[`${parsed[0].length - 1},${parsed.length - 1},down`].distance
    );
}
let counter = 0;
while(true) {
    counter += 1;
    if (counter % 1000 === 0) {
        console.log("unvisited nodes: ", unvisitedArray.length);
    }
    const pickedNode = pickNextNode3();
    if (!pickedNode) {
        console.log('part1: ', result());
        break;
    }
    const [currentKey,currentNode] = pickedNode;
    const neighbours = currentNode.neighbours.filter(neighbour => unvisitedNodes[neighbour.destination]);
    for (const neighbour of neighbours) {
        const neighbourNode = unvisitedNodes[neighbour.destination];
        if (currentNode.distance + neighbour.cost < neighbourNode.distance) {
            neighbourNode.distance = currentNode.distance + neighbour.cost;
            neighbourNode.prev = currentKey;
        }
    }
    visitedNodes[currentKey] = currentNode;
    delete unvisitedNodes[currentKey];
}
