import Header from '@/components/header'

type SortType = 'filter-even' | 'double' | 'sort-desc' | string | undefined

const transformArray = (arr: number[], sortType: SortType[]) => {
  let newArr = arr
  const hasInvalidParam = sortType.some((p) => !p || !['filter-even', 'double', 'sort-desc'].includes(p))
  sortType.forEach((sort) => {
    if (!hasInvalidParam) {
      if (sort === 'filter-even') {
        newArr = newArr.filter(num => num % 2 === 0)
      } else if (sort === 'double') {
        newArr = newArr.map(num => num * 2)
      } else if (sort === 'sort-desc') {
        newArr = newArr.sort((a, b) => b - a)
      }
    }
  })
  return newArr.join(', ')
}

const Problem1 = () => { 
  return (
    <>
    <code>
      Parameters<br />
      arr: An array of numbers.<br />
      Example: 5, 3, 8, 1, 2<br />
      commands: An array of strings, where each string represents a command. Supported commands are:<br />
      "double": Multiply each number in the array by 2.<br />
      "filter-even": Keep only even numbers in the array.<br />
      "sort-desc": Sort the array in descending order.<br />
      The commands should be applied in the order they appear in the commands array.<br />
      <br />
      Function Requirements<br />
      Apply transformations in order as defined by the commands array.<br />
      Immutability: Do not modify the original array.<br />
      If an unknown command is encountered, ignore it and continue processing the next command.<br />
      <br />
      Examples<br />
      // Example 1: Double and sort descending<br />
        console.log(transformArray([5, 3, 8, 1, 2], ['double', 'sort-desc'])); <br />
      // Output: [16, 10, 6, 4, 2] (Double: [10, 6, 16, 2, 4]{' -> '}Sort Desc: [16, 10, 6, 4, 2])<br />
        <br />
      // Example 2: Filter even numbers and then double<br />
        console.log(transformArray([5, 3, 8, 1, 2], ['filter-even', 'double'])); <br />
      // Output: [16, 4] (Filter Even: [8, 2]{' -> '}Double: [16, 4])<br />
        <br />
      // Example 3: No commands (returns original array)<br />
        console.log(transformArray([5, 3, 8, 1, 2], [])); <br />
      // Output: [5, 3, 8, 1, 2]<br />
        <br />
      // Example 4: Ignore unknown commands<br />
      console.log(transformArray([5, 3, 8, 1, 2], ['invalid-command', 'double'])); <br />
      // Output: [5, 3, 8, 1, 2]
      <br />
    </code>
    <code className="bg-black text-white p-8">
      {'Answer 1: '}{transformArray([5, 3, 8, 1, 2], ['double', 'sort-desc'])}<br />
      {'Answer 2: '}{transformArray([5, 3, 8, 1, 2], ['filter-even', 'double'])}<br />
      {'Answer 3: '}{transformArray([5, 3, 8, 1, 2], [])}<br />
      {'Answer 4: '}{transformArray([5, 3, 8, 1, 2], ['invalid-command', 'double'])}<br />
    </code>
    </>
  )
}

const problem2Text = `
  To find the smallest value in a binary tree using JavaScript, you can traverse the tree and compare values. If it's a binary search tree (BST), the smallest value will always be in the leftmost node. Here's how you can implement it:
  1. For a Binary Search Tree (BST):
  Javascriptfunction findMinInBST(root) {
    if (!root) return null; // Tree is empty
    let current = root;
    while (current.left) {
      current = current.left; // Keep going left
    }
    return current.value; // Leftmost node's value is the smallest
  }

  2. For a General Binary Tree:
  In a general binary tree, you need to traverse all nodes to find the smallest value.
  Javascriptfunction findMinInBinaryTree(root) {
    if (!root) return null; // Tree is empty
    let min = root.value;

    // Recursively find the minimum in left and right subtrees
    if (root.left) {
      min = Math.min(min, findMinInBinaryTree(root.left));
    }
    if (root.right) {
      min = Math.min(min, findMinInBinaryTree(root.right));
    }

    return min;
  }

  3. Using Depth-First Search (DFS):
  You can also use a stack for an iterative approach.
  Javascriptfunction findMinWithDFS(root) {
    if (!root) return null; // Tree is empty
    let stack = [root];
    let min = root.value;

    while (stack.length > 0) {
      let node = stack.pop();
      min = Math.min(min, node.value);

      if (node.right) stack.push(node.right);
      if (node.left) stack.push(node.left);
    }

    return min;
  }

  Usage Example:
  Javascriptconst tree = {
    value: 10,
    left: {
      value: 5,
      left: { value: 2, left: null, right: null },
      right: { value: 7, left: null, right: null }
    },
    right: {
      value: 15,
      left: null,
      right: { value: 20, left: null, right: null }
    }
  };

  console.log(findMinInBST(tree)); // For BST: Output -> 2
  console.log(findMinInBinaryTree(tree)); // For general binary tree: Output -> 2
  console.log(findMinWithDFS(tree)); // Using DFS: Output -> 2

  These approaches ensure you can handle both BSTs and general binary trees effectively!
`

const Problem2 = () => {
  return (
  <code>
    {problem2Text}
  </code>
  )
}




const Practice = () => {
  
  return (
    <div className="p-4 flex flex-col">
      <Header
        greeting="Practice Questions and solutions."
        middle=""
        title="Practice Page"
      />
      <Problem1 />
      <Problem2 />
    </div>
  )

}

export default Practice