const fs = require('fs');

const filePath = './input.txt';

function parseSet(setText) {
    const cubes = setText.split(',');
    return cubes
        .map(cube => cube.match(/(\d+) (\w+)/))
        .map(match => {
            const [_, count, color] = match;
            return {
                count: parseInt(count),
                color,
            }
        });
}

function parseLine(line) {
    const [gameNumberText, gameData] = line.split(':');
    const gameNumber = parseInt(gameNumberText.substring(5));
    const sets = gameData.split(';');


    return {
        number: gameNumber,
        sets: sets.map(parseSet),
    }
}

function parseFile(fileContents) {
    const lines = fileContents.split('\n');
    return lines
        .filter(line => line.startsWith('Game'))
        .map(parseLine);
}

function main(fileContents) {
    console.log(parseSet('19 green, 5 red'))

    console.log(parseFile(fileContents));

}

fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    main(data);
  });