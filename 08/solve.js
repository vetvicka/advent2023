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

function main(fileContents) {
    const parsed = parseFile(fileContents);
    const steps = traverse(parsed.nodes, parsed.instructions);
    console.log("part1: ", steps);
}

fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    main(data);
  });