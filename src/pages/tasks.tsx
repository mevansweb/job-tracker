
import Header from '@/components/header'
import { useAuth } from '@/components/providers/hooks'
import { Card } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { TasksModal } from '@/components/modal/tasks-modal'

const Tasks = () => {
  const { state } = useAuth()
  const allTasks = state.tasks || []

  return (  
    <div className="p-4 flex flex-col">
      <Header 
        greeting="Log your job training/career development tasks." 
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
                  <div className="w-2/3">
                    <h3 className="text-lg font-semibold">{task.description}</h3>
                    <p className="text-sm text-gray-500">Status: {task.status}</p>
                    {task.events && task.events.length > 0 ? (
                      <div className="mt-2">
                        <p className="text-sm font-light italic">Sub-Tasks:</p>
                        <ul className="list-disc list-inside text-sm light:text-gray-700 dark:text-gray-400">
                          {task.events.map((event, index) => (
                            <li className="flex justify-between" key={`${task.id}-event-${index}`}>
                              <div>{event.dueDate ? `${event.dueDate}: ` : ''}{event.note}</div>
                              <Checkbox checked={event.done} className="ml-4" />
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null }
                  </div>
                  <TasksModal key={`${task.id}-modal`} task={task} />
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <p className="light:text-gray-700 dark:text-gray-400">No tasks found. Use the button above to add your first task.</p>
        )}
      </div>
    </div>
  )
}

export default Tasks