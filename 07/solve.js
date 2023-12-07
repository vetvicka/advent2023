const fs = require('fs');

const filePath = './input.txt';

function countCards(hand) {
  const cards = hand.split('');
  const counts = {};
  cards.forEach(card => {
      counts[card] = counts[card] || 0;
      counts[card]++;
  });
  return counts;
}

function countCards2(hand) {
  if (!hand.includes('J') ){
    return countCards(hand);
  }
  const counts = Object.entries(countCards(hand));
  const jokerPossibilities = counts.map(([card, count]) => {
    const pretendHand = hand.replaceAll(card, 'J');
    const value = getCardTypeValue(countCards(pretendHand));
    return { hand: pretendHand, value };
  });
  const bestJoker = jokerPossibilities.sort((a, b) => b.value - a.value)[0];
  return countCards(bestJoker.hand);
}

function parseHand(line) {
  const [hand, bid] = line.split(' ');
  const counts = countCards(hand);
  const counts2 = countCards2(hand);
  return {
    hand,
    typeValue: getCardTypeValue(counts),
    typeValue2: getCardTypeValue(counts2),
    bid: parseInt(bid, 10),
  };
}

function parseFile(fileContents) {
    const lines = fileContents.split('\n');
    return lines
        .filter(line => line.length > 0)
        .map(parseHand);
}

function getCardTypeValue(counts) {
  const countEntries = Object.entries(counts);
  if (countEntries.length === 1) {
    return 6;
  }
  if (countEntries.length === 2) {
    if (countEntries.some(([card, count]) => count === 4)) {
      return 5;
    }
    return 4;
  }
  if (countEntries.length === 3) {
    if (countEntries.some(([card, count]) => count === 3)) {
      return 3;
    }
    return 2;
  }
  if (countEntries.length === 5) {
    return 0;
  }
  return 1;
}

let isPart2 = false;

function compareCardValue(a, b) {
  const cardValues1 = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];
  const cardValues2 = ['A', 'K', 'Q', 'T', '9', '8', '7', '6', '5', '4', '3', '2', 'J'];
  const cardValues = isPart2 ? cardValues2 : cardValues1;
  const aIndex = cardValues.indexOf(a);
  const bIndex = cardValues.indexOf(b);
  return aIndex - bIndex;
}

function compareHands(handA, handB) {
  if (isPart2 && handA.typeValue2 !== handB.typeValue2) {
    return handB.typeValue2 - handA.typeValue2;
  }
  if (!isPart2 && handA.typeValue !== handB.typeValue) {
    return handB.typeValue - handA.typeValue;
  }
  for (let i = 0; i < handA.hand.length; i++) {
    const a = handA.hand[i];
    const b = handB.hand[i];
    const comparedCards = compareCardValue(a, b);
    if (comparedCards !== 0) {
      return comparedCards;
    }
  }
  return 0;
}

function calculateWinnings(allHands) {
  return allHands.reduce((acc, hand, index) => {
    const winnings = hand.bid * (index + 1);
    return acc + winnings;
  }, 0);
}

function main(fileContents) {
    const parsed = parseFile(fileContents);
    const sorted = parsed.sort(compareHands).reverse();
    const winnings = calculateWinnings(sorted);
    console.log('part1: ', winnings);

    isPart2 = true;
    const parsed2 = parseFile(fileContents);
    const sorted2 = parsed2.sort(compareHands).reverse();
    const winnings2 = calculateWinnings(sorted2);
    console.log('part2: ', winnings2);
}

fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    main(data);
  });