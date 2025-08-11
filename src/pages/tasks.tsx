import Header from '@/components/header'

const Tasks = () => {
  return (
    <div className="p-4 flex flex-col">
      <Header 
        greeting="This is where you log your job training/career development tasks." 
        middle="" 
        title="Tasks"
      />
    </div>
  )
}

export default Tasks