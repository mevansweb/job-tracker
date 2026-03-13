import { type PracticeQuestion } from "@/global/types"

export const practiceQuestions: PracticeQuestion[] = [
  {
    id: 1,
    question: 'Remove duplicate elements from an array.',
    exampleInput: '1, 2, 2, 3, 4, 4, 5',
    shouldReturn: '1, 2, 3, 4, 5'
  },
  {
    id: 2,
    question: 'Given a string, reverse the order of words without reversing the characters of each word.',
    exampleInput: 'I love JavaScript',
    shouldReturn: 'JavaScript love I'
  },
  {
    id: 3,
    question: 'Given an array of integers, find the second largest unique number.',
    exampleInput: '10, 5, 20, 20, 8',
    shouldReturn: '10'
  },
  {
    id: 4,
    question: 'Check if a String is a Palindrome (Ignoring Case & Non-Alphanumeric). Return true if the string reads the same backward as forward. Ignore case and non-alphanumeric characters.',
    exampleInput: 'A man, a plan, a canal: Panama',
    shouldReturn: 'true'
  },
  {
    id: 5,
    question: 'Sum of Digits Until Single Digit. Given a positive integer n, repeatedly sum its digits until the result is a single digit.',
    exampleInput: '9875',
    shouldReturn: '2'
  },
  {
    id: 6,
    question: 'Count Vowels in a String. Count the number of vowels (a, e, i, o, u) in a given string (case-insensitive).',
    exampleInput: 'JavaScript',
    shouldReturn: '3'
  },
  {
    id: 7,
    question: 'Find Missing Number in Sequence. Given an array containing n distinct numbers from 1 to n+1, find the missing number.',
    exampleInput: '1, 2, 4, 5',
    shouldReturn: '3'
  }
]