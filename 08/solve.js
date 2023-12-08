const fs = require('fs');

const filePath = './input.txt';

function parseNode(line) {
  return {
    id: line.substring(0,3),
    L: line.substring(7,10),
    R: line.substring(12,15),
  }
}

function parseNodes(lines) {
  return lines.map(parseNode).reduce((acc, node) => {
    acc[node.id] = node;
    return acc;
  }, {});
}

function parseFile(fileContents) {
    const lines = fileContents.split('\n');
    const filtered = lines
        .filter(line => line.length > 0)

    return {
      instructions: filtered.shift(),
      nodes: parseNodes(filtered),
    }
}

function* instructionGen(instructions) {
  let index = 0;
  while(true) {
    yield instructions[index];
    index = (index + 1) % instructions.length;
  }
}

function traverse(nodes, instructions) {
  const instruction = instructionGen(instructions);
  let counter = 0;
  let currentNode = nodes['AAA'];
  while (currentNode.id !== 'ZZZ') {
    counter++;
    const nextInstruction = instruction.next().value;
    currentNode = nodes[currentNode[nextInstruction]];
  }
  return counter;
}

function getStartingNodes(nodes) {
  const entries = Object.entries(nodes).filter(([key, _]) => key[2] === 'A');
  return entries.map(([key, value]) => value)
}

function areAllIntervalsKnown(currentNodes, diffs) {  
  if (Object.entries(diffs).length < currentNodes.length) {
    return false;
  }
  return Object.values(diffs).every(arr => arr.length > 2 && arr[0] === arr[1]);
}

function gcd(a, b) {
  while (b !== 0) {
    const temp = b;
    b = a % b;
    a = temp;
  }
  return a;
}

function lcm(a, b) {
  return a*b/gcd(a,b);
}

function traverse2(nodes, instructions) {
  const instruction = instructionGen(instructions);
  let counter = 0;
  let currentNodes = getStartingNodes(nodes);
  const endingNumbers = {};
  let diffs = [];
  while (!areAllIntervalsKnown(currentNodes, diffs) && counter < 100_000) {
    counter++;
    const nextInstruction = instruction.next().value;
    currentNodes = currentNodes.map(node => nodes[node[nextInstruction]]);
    currentNodes.forEach((node, index) => {
      if (node.id[2] === 'Z') {
        endingNumbers[index] = endingNumbers[index] || [];
        endingNumbers[index].push(counter);
        diffs = Object.values(endingNumbers).map((arr) => arr.map((num, index) => arr[index+1] - num));
      }
    })
  }
  const flatDiffs = diffs.map(arr => arr[0]);
  return flatDiffs.reduce(lcm);
}

function main(fileContents) {
    const parsed = parseFile(fileContents);
    const steps = traverse(parsed.nodes, parsed.instructions);
    console.log("part1: ", steps);

    const steps2 = traverse2(parsed.nodes, parsed.instructions);
    console.log('part2', steps2);
}

fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    main(data);
  });