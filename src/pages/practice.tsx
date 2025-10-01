import Header from '@/components/header'

/*
Parameters
arr: An array of numbers.
Example: 5, 3, 8, 1, 2
commands: An array of strings, where each string represents a command. Supported commands are:
"double": Multiply each number in the array by 2.
"filter-even": Keep only even numbers in the array.
"sort-desc": Sort the array in descending order.
The commands should be applied in the order they appear in the commands array.

Function Requirements
Apply transformations in order as defined by the commands array.
Immutability: Do not modify the original array.
If an unknown command is encountered, ignore it and continue processing the next command.

Examples
// Example 1: Double and sort descending
console.log(transformArray([5, 3, 8, 1, 2], ['double', 'sort-desc'])); 
// Output: [16, 10, 6, 4, 2] (Double: [10, 6, 16, 2, 4] -> Sort Desc: [16, 10, 6, 4, 2])

// Example 2: Filter even numbers and then double
console.log(transformArray([5, 3, 8, 1, 2], ['filter-even', 'double'])); 
// Output: [16, 4] (Filter Even: [8, 2] -> Double: [16, 4])

// Example 3: No commands (returns original array)
console.log(transformArray([5, 3, 8, 1, 2], [])); 
// Output: [5, 3, 8, 1, 2]

// Example 4: Ignore unknown commands
console.log(transformArray([5, 3, 8, 1, 2], ['invalid-command', 'double'])); 

*/

type SortType = 'filter-even' | 'double' | string | undefined

const transformArray = (arr: number[], sortType: SortType[]) => {
  let newArr = arr
  const hasInvalidParam = sortType.some((p) => !p || !['filter-even', 'double'].includes(p))
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
  return newArr
}

const Practice = () => {
  console.log('example-1', transformArray([5, 3, 8, 1, 2], ['double', 'sort-desc']))
  console.log('correct answer', [16, 10, 6, 4, 2])
  console.log('example-2', transformArray([5, 3, 8, 1, 2], ['filter-even', 'double']))
  console.log('correct answer', [16, 4])
  console.log('example-3', transformArray([5, 3, 8, 1, 2], []))
  console.log('correct answer', [5, 3, 8, 1, 2])
  console.log('example-4', transformArray([5, 3, 8, 1, 2], ['invalid-command', 'double']))
  console.log('correct answer', [5, 3, 8, 1, 2])
  return (
    <div className="p-4 flex flex-col">
      <Header
        greeting="This is the practice page where you can improve your skills."
        middle=""
        title="Practice Page"
      />
    </div>
  )

}

export default Practice