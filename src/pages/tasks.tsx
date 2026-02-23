import Header from '@/components/header'
import { useAuth } from '@/components/providers/hooks'
import { Card } from '@/components/ui/card'
import { TasksModal } from '@/components/modal/tasks-modal'

const Tasks = () => {
  const { data, existing, state } = useAuth()
  const allTasks = data?.tasks && data.tasks.length > 0 ? data.tasks : state.tasks && state.tasks.length > 0 ? state.tasks : existing && existing.tasks ? existing.tasks : []

  return (  
    <div className="p-4 flex flex-col">
      <Header 
        greeting="This is where you log your job training/career development tasks (TODO)." 
        middle="" 
        title="Tasks"
      />
      <div className="mx-auto my-4"><TasksModal /></div>
      <div className="flex align-center my-4 justify-center">
        {allTasks && allTasks.length > 0 ? (
          <div className="w-full">
            {allTasks.map((task) => (
              <Card key={`${task.id}-card`} className="mb-4 p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold">{task.description}</h3>
                    <p className="text-sm text-gray-500">Status: {task.status}</p>
                    {task.events && task.events.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm font-light italic">Sub-Tasks:</p>
                        <ul className="list-disc list-inside text-sm text-gray-700">
                          {task.events.map((event, index) => (
                            <li key={`${task.id}-event-${index}`}>{event.dueDate ? `${event.dueDate}: ` : ''}{event.note}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  <TasksModal key={`${task.id}-modal`} task={task} />
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-gray-700">No tasks found. Use the button above to add your first task.</p>
        )}
      </div>
    </div>
  )
}

export default Tasks