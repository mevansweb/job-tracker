import { type PracticeQuestion } from '@/global/types'

export const problems1: PracticeQuestion[] = [
  {
    id: 1,
    question: 'Remove duplicate elements from an array.',
    exampleInput: '1, 2, 2, 3, 4, 4, 5',
    shouldReturn: '1, 2, 3, 4, 5',
    solution: 'return [...new Set(x)];',
  },
  {
    id: 2,
    question:
      'Given a string, reverse the order of words without reversing the characters of each word.',
    exampleInput: 'I love JavaScript',
    shouldReturn: 'JavaScript love I',
    solution: `const words = x.split(' ');
return words.reverse().join(' ');`,
  },
  {
    id: 3,
    question: 'Given an array of integers, find the second largest unique number.',
    exampleInput: '10, 5, 20, 20, 8',
    shouldReturn: '10',
    solution: `const unique = [...new Set(x)];
unique.sort((a,b) => b - a);
return unique[1];`,
  },
  {
    id: 4,
    question:
      'Check if a String is a Palindrome (Ignoring Case & Non-Alphanumeric). Return true if the string reads the same backward as forward. Ignore case and non-alphanumeric characters.',
    exampleInput: 'A man, a plan, a canal: Panama',
    shouldReturn: 'true',
    solution: `const str = Array.isArray(x) ? x.join('') : x;
const cleaned = str.replace(/[^A-Za-z]/g,'').toLowerCase();
const reversed = cleaned.split('').reverse().join('');
return cleaned === reversed;`,
  },
  {
    id: 5,
    question:
      'Sum of Digits Until Single Digit. Given a positive integer n, repeatedly sum its digits until the result is a single digit.',
    exampleInput: '9875',
    shouldReturn: '2',
    solution: `let num = Number(x);
while (num >= 10) {
  let sum = 0;
  while (num > 0) {
    sum += num % 10;
    num = Math.floor(num / 10);
  }
  num = sum;
}
return num;
    `,
  },
  {
    id: 6,
    question:
      'Count Vowels in a String. Count the number of vowels (a, e, i, o, u) in a given string (case-insensitive).',
    exampleInput: 'JavaScript',
    shouldReturn: '3',
    solution: `const vowels = new Set(['a', 'e', 'i', 'o', 'u']);
x = x.toLowerCase();
let count = 0;
for (let i = 0; i < x.length; i++) {
  if (vowels.has(x[i])){
    count++;
  }
}
return count;`,
  },
  {
    id: 7,
    question:
      'Find Missing Number in Sequence. Given an array containing n distinct numbers from 1 to n+1, find the missing number.',
    exampleInput: '1, 2, 4, 5',
    shouldReturn: '3',
    solution: `const n = x.length + 1;
let sum = 0;
for (let i = 0; i < n - 1; i++){
  sum += x[i];
}
const expected = (n * (n + 1)) / 2;
return expected - sum;`,
  },
]

//https://www.geeksforgeeks.org/javascript/javascript-coding-questions-and-answers/
export const problems2: PracticeQuestion[] = [
  {
    id: 1,
    question: 'Find the largest number in an array in JavaScript.',
    exampleInput: '99, 5, 3, 100, 1',
    shouldReturn: '100',
    solution: 'return Math.max(...x); ',
  },
  {
    id: 1,
    question: 'Write a Program to print Fibonacci sequence up to n terms?',
    exampleInput: '7',
    shouldReturn: '0,1,1,2,3,5,8',
    solution: `let num1 = 0, num2 = 1, nextNum, answer = [];
for (let i = 1; i <= x; i++) {
  answer.push(num1);
  nextNum = num1 + num2;
  num1 = num2;
  num2 = nextNum;
}
return answer.join(',')`,
  },
  {
    id: 1,
    question: 'Write a Program to find factorial of a number?',
    exampleInput: '7',
    shouldReturn: '5040',
    solution: `let answer = 1;
for (let i = 2; i <= x; i++) {
    answer *= i;
}
return answer;`,
  },
  {
    id: 1,
    question: 'Write a Program to print the frequency of elements in an array?',
    exampleInput: '1, 1, 2, 3, 3, 4',
    shouldReturn: "{ '1': 2, '2': 1, '3': 2, '4': 1 }",
    solution: `const freq = {};
for (let i = 0; i < x.length; i++) {
  if (freq[x[i]]) {
      freq[x[i]] += 1;
  } else {
      freq[x[i]] = 1;
  }
}
return freq;`,
  },
  {
    id: 1,
    question: 'Find the Intersection of Two Arrays in JavaScript?',
    exampleInput: '5, 6, 7',
    secondInput: '6, 7, 8',
    shouldReturn: '6, 7',
    solution: `const set2 = new Set(y); 
return x.filter(value => set2.has(value));`,
  },
  {
    id: 1,
    question: 'Find the Union of Two Arrays in JavaScript?',
    exampleInput: '1, 2, 3',
    secondInput: '2, 3, 4',
    shouldReturn: '1, 2, 3, 4',
    solution: `return [...new Set([...x, ...y])];`,
  },
  {
    id: 1,
    question: 'Write a Program to find the minimum value in an array in JavaScript?',
    exampleInput: '5, 10, -1, 8',
    shouldReturn: '-1',
    solution: `return Math.min(...x);`,
  },
  {
    id: 1,
    question: 'Find the maximum difference between two numbers in an array in JavaScript?',
    exampleInput: '1, 2, 90, 10, 110',
    shouldReturn: '109',
    solution: `let min = x[0]
let maxDiff = 0;

for (let i = 1; i < x.length; i++) {
    const diff = x[i] - min;
    maxDiff = Math.max(maxDiff, diff);
    min = Math.min(min, x[i]);
}
return maxDiff;`,
  },
  /*   {
    id: 1,
    question: '',
    exampleInput: '',
    shouldReturn: '',
    solution: ``,
  },
  {
    id: 1,
    question: '',
    exampleInput: '',
    shouldReturn: '',
    solution: ``,
  }, */
]
