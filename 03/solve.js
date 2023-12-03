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
    console.log(
        "colIndexMax: " + colIndexMax,
        "colIndexMin: " + colIndexMin,
        "rowIndexMax: " + rowIndexMax,
        "rowIndexMin: " + rowIndexMin,)
    for (let rowIndex = rowIndexMin; rowIndex < rowIndexMax; rowIndex++) {
        for (let colIndex = colIndexMin; colIndex < colIndexMax; colIndex++) {
            if (isSymbol(data[rowIndex][colIndex])) {
                return true;
            }
        }
    }
    return false;
}

function getValidNumbersFromLine(line, y, data) {
    const matches = [...line.matchAll(/\d+/g)];
    return matches
        .filter(match => isValidNumber(match[0], match.index, y, data))
        .map(match => parseInt(match[0]));
}

function main(fileContents) {
    const parsed = parseFile(fileContents);

    console.log('regex test', ...parsed[0].matchAll(/\d+/g))

    const numbers = parsed.map(getValidNumbersFromLine);

    console.log(numbers
        .flatMap(x => x)
        .reduce((acc, curr) => acc + curr, 0)
    );
}

fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    main(data);
  });