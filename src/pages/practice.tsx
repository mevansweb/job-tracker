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




const Practice = () => {
  
  return (
    <div className="p-4 flex flex-col">
      <Header
        greeting="Practice Questions and solutions."
        middle=""
        title="Practice Page"
      />
      <Problem1 />
    </div>
  )

}

export default Practice