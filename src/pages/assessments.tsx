import Header from '@/components/header'

const Assessments = () => {
  return (
    <div className="p-4 flex flex-col">
      <Header 
        greeting="A Scratch Pad for coding assessments." 
        middle="" 
        title="Assessments"
      />
      <div className="mt-4 p-4 border rounded bg-white">
        <p className="text-gray-700">This page is a scratch pad for coding assessments. You can use this space to practice coding problems, take notes, or jot down ideas related to your job search and applications.</p>
        <p className="text-gray-700 mt-2">Feel free to modify and expand this page as needed to suit your workflow and help you stay organized during your job search.</p>
      </div>
    </div>
  )
}

export default Assessments