import { useCallback, useEffect, useMemo, useState } from 'react'

import { toast } from 'sonner'

import Header from '@/components/header'
import { TasksModal } from '@/components/modal/tasks-modal'
import { localStorageKey } from '@/components/providers/const'
import { useAuth } from '@/components/providers/hooks'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { spliceOrConcatArray } from '@/global/functions'
import { setTasks } from '@/global/shared'
import type { Task, TaskEvent } from '@/global/types'

const Tasks = () => {
  const { data, dispatch, error, existing, loading, postData, state } = useAuth()
  const allTasks = useMemo(() => state.tasks || [], [state.tasks])
  const [sortSubtasksBy, setSortSubtasksBy] = useState<{
    id: string
    type: 'date' | 'alphabetical'
  } | null>(null)

  const handleChange = useCallback(
    async ({ checked, task, subtask }: { checked: boolean; task: Task; subtask: TaskEvent }) => {
      const saveEmail: string = state.email
      if (saveEmail) {
        const arrSubtasks = spliceOrConcatArray({ ...subtask, done: checked }, task.events)
        const updatedTask = { ...task, events: arrSubtasks as TaskEvent[] }
        const arrTasks = spliceOrConcatArray(updatedTask, allTasks)
        await setTasks({
          action: 'edit',
          dispatch,
          email: saveEmail,
          tasks: arrTasks as Task[],
          postData,
        })
        localStorage.setItem(
          localStorageKey,
          JSON.stringify({ ...existing, tasks: arrTasks || [] })
        )
      }
    },
    [dispatch, existing, postData, state.email, allTasks]
  )

  useEffect(() => {
    if (!loading && data) {
      toast.success('Updated status successfully')
    } else if (error) {
      toast.error(`Status was not updated. Error: ${error}`)
    }
  }, [data, error, loading])

  return (
    <div className="flex flex-col p-4">
      <Header greeting="Log your job training/career development tasks." middle="" title="Tasks" />
      <div className="mx-auto my-4">
        <TasksModal />
      </div>
      <div className="align-center mx-auto my-4 flex justify-center sm:w-9/8 md:w-9/10 lg:w-2/3">
        {allTasks && allTasks.length > 0 ? (
          <div className="w-full">
            {allTasks.map((task) => (
              <Card key={`${task.id}-card`} className="mb-4 p-4">
                <div className="flex flex-col">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">{task.description}</h3>
                      <p className="text-sm text-gray-500">Status: {task.status}</p>
                    </div>
                    <TasksModal key={`${task.id}-modal`} task={task} />
                  </div>
                  {task.events && task.events.length > 0 ? (
                    <div className="mt-2">
                      <div className="mb-2 flex items-center justify-between gap-4 border-b-2 border-gray-200 py-2">
                        <p className="text-sm font-light italic">
                          Sub-Tasks ({task.events.length}):
                        </p>
                        <Button
                          className="cursor-pointer px-2"
                          variant="outline"
                          onClick={() =>
                            setSortSubtasksBy({
                              id: task.id,
                              type: 'date',
                            })
                          }
                        >
                          Sort by Date
                        </Button>
                        <Button
                          className="cursor-pointer px-2"
                          variant="outline"
                          onClick={() =>
                            setSortSubtasksBy({
                              id: task.id,
                              type: 'alphabetical',
                            })
                          }
                        >
                          Sort Alphabetically
                        </Button>
                      </div>
                      <ul className="light:text-gray-700 list-inside list-disc text-sm md:w-100 lg:w-150 dark:text-gray-400">
                        {task.events
                          .sort((a, b) => {
                            if (sortSubtasksBy?.id === task.id) {
                              if (sortSubtasksBy.type === 'date') {
                                const dateA = a.dueDate ? new Date(a.dueDate).getTime() : 0
                                const dateB = b.dueDate ? new Date(b.dueDate).getTime() : 0
                                return dateA - dateB
                              } else {
                                return a.note.localeCompare(b.note)
                              }
                            } else {
                              return 0
                            }
                          })
                          .map((event, index) => (
                            <li
                              className="flex justify-between border-b border-dotted"
                              key={`${task.id}-event-${index}`}
                            >
                              <div className="flex md:w-9/10 lg:w-9/10">
                                <div className="md:w-1/5 lg:w-1/5">
                                  {event.dueDate
                                    ? `${new Date(event.dueDate).toLocaleDateString()}: `
                                    : ''}
                                </div>
                                <div className="flex md:w-4/5 lg:w-4/5">{event.note}</div>
                              </div>
                              <Checkbox
                                checked={event.done}
                                className="ml-4 border-2 border-blue-500 data-[state=checked]:bg-blue-500 data-[state=checked]:text-white dark:data-[state=checked]:bg-blue-900"
                                onCheckedChange={(checked) =>
                                  handleChange({
                                    checked: checked === true,
                                    task,
                                    subtask: event,
                                  })
                                }
                              />
                            </li>
                          ))}
                      </ul>
                    </div>
                  ) : null}
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <p className="light:text-gray-700 dark:text-gray-400">
            No tasks found. Use the button above to add your first task.
          </p>
        )}
      </div>
    </div>
  )
}

export default Tasks
