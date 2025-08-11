import Header from '@/components/header'

class Node {
  value: unknown;
  next: Node | null;

  constructor(value: unknown) {
    this.value = value;
    this.next = null;
  }
}

function detectCycle(head: Node | null): boolean {
  if (!head) return false;
  let slow: Node | null = head
  let fast: Node | null = head
  while (slow && fast && fast.next) {
    slow = slow.next
    fast = fast.next.next
    if (slow === fast) {
      return true // Cycle detected
    }
  }
  return false // No cycle
}

function mergeSortedArrays(arr1: number[], arr2: number[]): number[] {
  const merged = []
  let i = 0, j = 0
  while (i < arr1.length && j < arr2.length) {
    if (arr1[i] < arr2[j]) {
      merged.push(arr1[i])
      i++
    } else {
      merged.push(arr2[j])
      j++
    }
  }
  // Concatenate remaining elements
  return merged.concat(arr1.slice(i)).concat(arr2.slice(j))
}

function findMissingNumber(arr: number[]): number {
  const n = arr.length + 1;
  const sum = (n * (n + 1)) / 2;
  const arrSum = arr.reduce((acc, num) => acc + num, 0);
  return sum - arrSum;
}

const Practice = () => {
  const codeTextA = `
    class Node {
      value: unknown;
      next: Node | null;

      constructor(value: unknown) {
        this.value = value;
        this.next = null;
      }
    }
    function detectCycle(head: Node | null): boolean {
      if (!head) return false;
      let slow: Node | null = head
      let fast: Node | null = head
      while (slow && fast && fast.next) {
        slow = slow.next
        fast = fast.next.next
        if (slow === fast) {
          return true // Cycle detected
        }
      }
      return false // No cycle
    }
  `
  const codeTextB = `
    function mergeSortedArrays(arr1: number[], arr2: number[]): number[] {
      const merged = []
      let i = 0, j = 0
      while (i < arr1.length && j < arr2.length) {
        if (arr1[i] < arr2[j]) {
          merged.push(arr1[i])
          i++
        } else {
          merged.push(arr2[j])
          j++
        }
      }
      // Concatenate remaining elements
      return merged.concat(arr1.slice(i)).concat(arr2.slice(j))
    }
  `
  const codeTextC = `
    function findMissingNumber(arr) {
      const n = arr.length + 1;
      const sum = (n * (n + 1)) / 2;
      const arrSum = arr.reduce((acc, num) => acc + num, 0);
      return sum - arrSum;
    }
  `
  // Driver Code
  // Create a hard-coded linked list:
  // 1 -> 3 -> 4
  const head = new Node(1)
  head.next = new Node(3)
  head.next.next = new Node(4)

  // Create a loop
  head.next.next.next = head.next

  const arr1 = [1, 3, 5]
  const arr2 = [2, 4, 6]
  const mergedArray = mergeSortedArrays(arr1, arr2)

  return (
    <div className="p-4 flex flex-col">
      <Header
        greeting="This is the practice page where you can improve your skills."
        middle=""
        title="Practice Page"
      />
      <pre>
        <code className="text-gray-600">{codeTextA}</code>
        <code className="text-gray-600">detectCycle(head): {detectCycle(head).toString()}</code>
      </pre>
      <pre>
        <code className="text-gray-600">{codeTextB}</code>
        <code className="text-gray-600">Merge two sorted arrays: {mergedArray}</code>
      </pre>
      <pre>
        <code className="text-gray-600">{codeTextC}</code>
        <code className="text-gray-600">Find Missing Number: {findMissingNumber([1, 2, 4, 5])}</code>
      </pre>
      <p className="mt-4 text-gray-500">
        This page is for practicing coding problems and algorithms.
      </p>
    </div>
  )

}

export default Practice