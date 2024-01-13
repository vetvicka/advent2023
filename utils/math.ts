export function gcd(a: number, b: number) {
    while (b !== 0) {
      const temp = b;
      b = a % b;
      a = temp;
    }
    return a;
  }
  
export function lcm(...numbers: number[]) {
    return numbers.reduce(binaryLcm);
}

function binaryLcm(a: number, b: number) {
    return a*b/gcd(a,b);
}