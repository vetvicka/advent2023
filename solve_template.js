const fs = require('fs');

const filePath = './input.txt';

function parseFile(fileContents) {
    const lines = fileContents.split('\n');
    return lines
        .filter(line => line.length > 0)
}

function main(fileContents) {
    const parsed = parseFile(fileContents);
    console.log(parsed);
}

fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    main(data);
  });