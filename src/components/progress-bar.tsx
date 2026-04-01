export const ProgressBar = ({ color, progress }: { color: string; progress: number }) => {
  const progressBarColor =
    color === 'red' ? 'bg-red-600' : progress < 70 ? 'bg-sky-500' : 'bg-green-600'

  return (
    <div className="h-2 w-full rounded-full border border-gray-200 bg-gray-100 dark:bg-transparent">
      <div
        className={`h-full rounded-full ${progressBarColor}`}
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  )
}
