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
        })
        .reduce((acc, curr) => {
            acc[curr.color] = curr.count;
            return acc;
        }, {})
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

function isValidSet(set, ruleSet) {
    return Object.entries(set).every(([color, count]) => {
        return ruleSet[color] >= count;
    });
}

function isValidGame(game, ruleSet) {
    return game.sets.every(set => isValidSet(set, ruleSet));
}

function sumValidGameNumbers(games, ruleSet) {
    return games
        .reduce((acc, curr) => {
            if (!isValidGame(curr, ruleSet)) {
                return acc;
            }
            return acc + curr.number;
        }, 0);

}

function main(fileContents) {
    console.log(parseSet('19 green, 5 red, 23 yellow'))

    // console.log(parseFile(fileContents));

    const ruleSet = {
        red: 12,
        green: 13,
        blue: 14,
    }

    console.log('isValidSet', isValidSet({
        // red: 12,
        // green: 15,
        blue: 12,
    }, ruleSet));

    testSet = {
        // red: 12,
        // green: 15,
        blue: 16,
    }

    const testGame = {
        number: 5,
        sets: [testSet]
    }

    console.log('isValidGame', isValidGame(testGame, ruleSet));


    const parsed = parseFile(fileContents);
    const result = sumValidGameNumbers(parsed, ruleSet);
    console.log("result: ", result);

}

fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    main(data);
  });