const fs = require('fs');

const filePath = './input.txt';

function parseLine(lineText) {
  return [...lineText.matchAll(/(\d+)/g)].map(match => parseInt(match[0]));
}

function parseLine2(lineText) {
  const numberText = parseLine(lineText)
    .reduce((acc, curr) => acc + curr, '');
    return [parseInt(numberText)];
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
    const lines = fileContents.split('\n')
        .filter(line => line.length > 0)
        
    const part1 = zipLines(lines
        .map(parseLine))

    const part2 = zipLines(lines
      .map(parseLine2))

    return {
      part1,
      part2,
    }
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
    const part1 = numberOfWinningChargeTimes(parsed.part1);
    console.log(`Part 1: ${part1}`);

    const part2 = numberOfWinningChargeTimes(parsed.part2);
    console.log('Part 2:', part2);
}

fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    main(data);
  });