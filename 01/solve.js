const fs = require('fs');

const filePath = './input.txt';



function fixNumbers(str) {
    const fixMap = {
        one: '1', 
        two: '2', 
        three: '3', 
        four: '4', 
        five: '5', 
        six: '6', 
        seven: '7', 
        eight: '8', 
        nine: '9'
    }
    const find = /(one|two|three|four|five|six|seven|eight|nine)/g;
    const found = []
    let res
    let counter = 0;
    // console.log('find.exec(str) DEBUG', find.exec(str))
    while((res = find.exec(str)) !== null) {
        found.push(res);
        find.lastIndex = res.index + 1;
        // console.log(found, res.index + 1, res)
        counter++;
        if (counter > 100) {
            throw new Error("Too many iterations");
        }
    }
    if (found.length === 0) {
        return str;
    }
    const lastMatch = found[found.length - 1];  
    res = str.substring(0, lastMatch.index) + fixMap[lastMatch[0]] + str.substring(lastMatch.index + 1);
    if (found.length === 1) {
        return res;
    }
    const firstMatch = found[0];  
    res = res.substring(0, firstMatch.index) + fixMap[firstMatch[0]] + res.substring(firstMatch.index + 1);
    return res
}

console.log(
    "fixNumbers test: ",
    fixNumbers("one two three four five six seven eight nine"),
    fixNumbers("oneight"),
    fixNumbers("oneightwoneight"),
)

function sumFirstAndLastDigit(str) {
    const array = [...str.matchAll(/\d/g)]
    if (array.length === 0) {
        console.log("HAHA no number here", str, "?")
        return 0;
    }
    // console.log("array: ", str, array);
    return parseInt(array[0] + array[array.length - 1])
} 


fs.readFile(filePath, 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  const split = data.split('\n');
  const res = split
    .map(fixNumbers)
    .map(sumFirstAndLastDigit)
    .reduce((acc, curr) => {
        return acc + curr;
    }, 0);
  const check = split.map(str => `${str} => ${fixNumbers(str)}`)
  console.log(check);
  console.log(split
    .map(fixNumbers)
    .map(sumFirstAndLastDigit));
  console.log("res: ", res);
});
