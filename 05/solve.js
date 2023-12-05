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
    reverseRange: [destinationStart, destinationStart + rangeLen - 1],
  }
}

function parseSeedsRanges(seeds) {
  const res = [];
  for (let index = 0; index < seeds.length; index+=2) {
    const rangeStart = seeds[index];
    const rangeEnd = rangeStart + seeds[index + 1] - 1;
    res.push([rangeStart, rangeEnd])
  }
  return res
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
    const seeds = parseSeeds(seedsInput);
    const seedsRanges = parseSeedsRanges(seeds)
    return {
      seeds,
      seedsRanges,
      maps,
    }
        
}

function isInRange(value, range) {
    return value >= range[0] && value <= range[1];
}

function findRange(value, map, isReverse = false) {
    return map.lines.find(line => isInRange(value, isReverse ? line.reverseRange : line.range));
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

function traverseMapsReverse(value, maps) {
  return [...maps].reverse().reduce((acc, map) => {
    const range = findRange(acc, map, true);
    if (range) {
      return acc - range.offset;
    }
    return acc;
  }, value);
}

function findLowestLocation(parsed, step = 1000, startLocation = 0) {
  const iterationLimit = 31599214;
  for (let loc = startLocation; loc < iterationLimit + 10; loc+=step) {
    if (loc > iterationLimit) {
      throw new Error('iteration limit exceeded')
    }
    const locationSeed = traverseMapsReverse(loc, parsed.maps);
    const rangeFound = parsed.seedsRanges.find(range => isInRange(locationSeed, range))
    if (rangeFound){
      if (step > 1) {
        return findLowestLocation(parsed, 1, loc - step);
      }
      return loc;
    }
  }
  return "no location found"
}

function main(fileContents) {
    const parsed = parseFile(fileContents);

    const seedResults = parsed.seeds
      .map(seed => traverseMaps(seed, parsed.maps))
      .sort((a, b) => a - b);
    console.log('part1: lowest seedResult', seedResults[0])

    console.log('part2: lowest location', findLowestLocation(parsed))
}

fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    main(data);
  });