const fs = require('fs');

const filePath = './input.txt';

function parseLine(lineText) {
  return [...lineText.matchAll(/(\d+)/g)].map(match => parseInt(match[0]));
}

function zipLines(lines) {
    const zipped = [];
    const [times, distances] = lines;
    for (let i = 0; i < times.length; i++) {
      zipped.push({
        time: times[i],
        distance: distances[i],
      })
    }
    return zipped;
}

function parseFile(fileContents) {
    const lines = fileContents.split('\n');
    const parsedLines = lines
        .filter(line => line.length > 0)
        .map(parseLine)
    return zipLines(parsedLines)
}

function calcDistance(chargeTime, raceTime) {
  const remainingTime = raceTime - chargeTime;
  return remainingTime * chargeTime
}

function calcWinningChargeTimes(race) {
  let counter = 0;
  for (let chargeTime = 0; chargeTime < race.time; chargeTime++) {
    const distance = calcDistance(chargeTime, race.time)
    if (distance > race.distance) {
      counter += 1;
    }
  }
  return counter;
}

function numberOfWinningChargeTimes(races) {
  return races.map(calcWinningChargeTimes).reduce((acc, curr) => acc * curr, 1);
}

function main(fileContents) {
    const parsed = parseFile(fileContents);
    const part1 = numberOfWinningChargeTimes(parsed);
    console.log(`Part 1: ${part1}`);
}

fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    main(data);
  });