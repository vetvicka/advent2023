const fs = require('fs');

const filePath = './input.txt';

function parseFile(fileContents) {
    const lines = fileContents.split('\n');
    return lines
        .filter(line => line.length > 0)
}

function isSymbol(char) {
    return !(/[\.\d]/.test(char));
}

function isValidNumber(number, x, y, data) {
    const colIndexMax = Math.min(x + number.length + 1, data[0].length);
    const colIndexMin = Math.max(x - 1, 0);
    const rowIndexMax = Math.min(y + 2, data.length);
    const rowIndexMin = Math.max(y - 1, 0);

    for (let rowIndex = rowIndexMin; rowIndex < rowIndexMax; rowIndex++) {
        for (let colIndex = colIndexMin; colIndex < colIndexMax; colIndex++) {
            if (isSymbol(data[rowIndex][colIndex])) {
                return true;
            }
        }
    }
    return false;
}

const gearMap = {}

function recordGears(number, x, y, data) {
    const colIndexMax = Math.min(x + number.length + 1, data[0].length);
    const colIndexMin = Math.max(x - 1, 0);
    const rowIndexMax = Math.min(y + 2, data.length);
    const rowIndexMin = Math.max(y - 1, 0);

    for (let rowIndex = rowIndexMin; rowIndex < rowIndexMax; rowIndex++) {
        for (let colIndex = colIndexMin; colIndex < colIndexMax; colIndex++) {
            if (data[rowIndex][colIndex] === '*') {
                const gearIndex = rowIndex + ',' + colIndex
                gearMap[gearIndex] = gearMap[gearIndex] || [];
                gearMap[gearIndex].push(parseInt(number));
            }
        }
    }
}

function getGearsDataFromLine(line, y, data) {
    const matches = [...line.matchAll(/\d+/g)];
    matches
        .filter(match => recordGears(match[0], match.index, y, data))
}

function getValidNumbersFromLine(line, y, data) {
    const matches = [...line.matchAll(/\d+/g)];
    return matches
        .filter(match => isValidNumber(match[0], match.index, y, data))
        .map(match => parseInt(match[0]));
}

function main(fileContents) {
    const parsed = parseFile(fileContents);

    const numbers = parsed.map(getValidNumbersFromLine);

    console.log(numbers
        .flatMap(x => x)
        .reduce((acc, curr) => acc + curr, 0)
    );

    parsed.forEach(getGearsDataFromLine);
    const gearRatiosSum = Object.entries(gearMap)
        .filter(([_, gears]) => gears.length == 2)
        .map(([_, gears]) => gears[0] * gears[1])
        .reduce((acc, curr) => acc + curr, 0);
    console.log(gearRatiosSum);
}

fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    main(data);
  });