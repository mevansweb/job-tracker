import { type PracticeQuestion } from '@/global/types'

export const easyQuestions: PracticeQuestion[] = [
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
    solution: `
    const words = x.split(' ');
    return words.reverse().join(' ');`,
  },
  {
    id: 3,
    question: 'Given an array of integers, find the second largest unique number.',
    exampleInput: '10, 5, 20, 20, 8',
    shouldReturn: '10',
    solution: `
    const unique = [...new Set(x)];
    unique.sort((a,b) => b - a);
    return unique[1];`,
  },
  {
    id: 4,
    question:
      'Check if a String is a Palindrome (Ignoring Case & Non-Alphanumeric). Return true if the string reads the same backward as forward. Ignore case and non-alphanumeric characters.',
    exampleInput: 'A man, a plan, a canal: Panama',
    shouldReturn: 'true',
    solution: `
    const str = x.join('');
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
    solution: `
    let num = Number(x);

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
    solution: `
    const vowels = new Set(['a', 'e', 'i', 'o', 'u']);
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
    solution: `
    const n = x.length + 1;
    let sum = 0;
    for (let i = 0; i < n - 1; i++){
    sum += x[i];
    }
    const expected = (n * (n + 1)) / 2;
    return expected - sum;`,
  },
]
