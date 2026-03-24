import Header from '@/components/header'

const Resume = () => {
  return (
    <div className="p-4 flex flex-col">
      <Header 
        greeting="Enter your resume information here so you can easily copy and paste to your applications!" 
        middle="" 
        title="Resume Editor"
      />
    </div>
  )
}

export default Resume