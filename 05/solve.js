const fs = require('fs');

const filePath = './input.txt';

function parseSeeds(input) {
  const prefixLength = 'seeds: '.length;
  return input.substring(prefixLength).split(' ').map(s => parseInt(s));
}

function parseMapLine(line) {
  const [destinationStart, sourceStart, rangeLen] = line.split(' ').map(s => parseInt(s));

  return {
    range: [sourceStart, sourceStart + rangeLen - 1],
    offset: destinationStart - sourceStart,
    lineText: line,
  }
}

function parseFile(fileContents) {
    const lines = fileContents.split('\n')
      .filter(line => line.length > 0)
    const seedsInput = lines.shift();
    const maps = lines.reduce((acc, line) => {
      if (line.includes('map:')) {
        const mapName = line.split(' ')[0];
        acc.push({ name: mapName, lines: [] });
        return acc;
      }
      acc[acc.length - 1].lines.push(line);
      return acc;
    }, []);
    maps.forEach(map => {
      map.lines = map.lines.map(parseMapLine);
    })
    return {
      seeds: parseSeeds(seedsInput),
      maps,
    }
        
}

function isInRange(value, range) {
    return value >= range[0] && value <= range[1];
}

function findRange(value, map) {
    return map.lines.find(line => isInRange(value, line.range));
}

function traverseMaps(value, maps) {
  return maps.reduce((acc, map) => {
    const range = findRange(acc, map);
    if (range) {
      return acc + range.offset;
    }
    return acc;
  }, value);
}

function main(fileContents) {
    const parsed = parseFile(fileContents);

    const seedResults = parsed.seeds
      .map(seed => traverseMaps(seed, parsed.maps))
      .sort((a, b) => a - b);
    console.log('lowest seedResult', seedResults[0])
}

fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    main(data);
  });