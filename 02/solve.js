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

function findMinSet(sets) {
    const res = {
        red: 0,
        green: 0,
        blue: 0,
    }
    sets.forEach(set => {
        Object.entries(set).forEach(([color, count]) => {
            res[color] = Math.max(res[color], count);
        })
    })
    return res;
}

function setPower(set) {
    return (set.red || 1) * (set.green || 1) * (set.blue || 1);
}

function sumGamesPowers(games) {
    return games.reduce((acc, curr) => {
        return acc + setPower(findMinSet(curr.sets));
    }, 0);

}

function main(fileContents) {
    const ruleSet = {
        red: 12,
        green: 13,
        blue: 14,
    }


    const parsed = parseFile(fileContents);
    const result = sumValidGameNumbers(parsed, ruleSet);
    console.log("result: ", result);

    console.log('sumGamesPowers', sumGamesPowers(parsed))
}

fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    main(data);
  });