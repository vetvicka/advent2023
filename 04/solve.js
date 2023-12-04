const fs = require('fs');

const filePath = './input.txt';

function parseFile(fileContents) {
    const lines = fileContents.split('\n');
    return lines
        .filter(line => line.length > 0)
        .map(line => line.substring(10).trim().replace(/  /g, ' '));
}

function parseCard(cardText) {
    const [winNumbers, tipNumbers] = cardText
      .split('|')
      .map(str => {
        return str.trim().split(' ')
          .map(numText => parseInt(numText))
      })

    return {
      count: 1,
      winNumbers,
      tipNumbers,
    }
}

function countCardPoints(card) {
    const { winNumbers, tipNumbers } = card;
    return tipNumbers.reduce((acc, curr) => {
      if (winNumbers.includes(curr)) {
        return acc + 1;
      }
      return acc;
    }, 0)
}

function main(fileContents) {
    const parsed = parseFile(fileContents);
    const cards = parsed.map(parseCard);
    // const testCard = '58 6 71 93 96 38 25 29 17 8 | 79 33 93 58 53 96 71 8 67 90 17 6 46 85 64 25 73 32 18 52 77 16 63 2 38'

    const points = cards.map(countCardPoints)
      .map(points => points ? Math.pow(2, points - 1) : 0)
      .reduce((acc, curr) => acc + curr, 0)
    console.log('part1: ', points);

    for(let i = 0; i < cards.length; i++) {
      const card = cards[i];
      const points = countCardPoints(card);
      if (points === 0) {
        continue;
      }
      for (let j = i + 1; j <= Math.min(cards.length - 1, i + points); j++) {
        cards[j].count += card.count;
      }
    }
    const cardsCount = cards.reduce((acc, curr) => acc + curr.count, 0);
    console.log('part2: ', cardsCount);
}

fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    main(data);
  });