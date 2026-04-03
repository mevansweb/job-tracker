import { RoundedHeader } from './rounded-header'

export const RoundedContainer = ({
  children,
  title,
}: {
  children: React.ReactNode
  title: string
}) => {
  return (
    <div className="bg-card text-card-foreground mx-auto mt-8 rounded-br-lg rounded-bl-lg shadow-md sm:w-9/8 md:w-9/10 lg:w-2/3">
      <RoundedHeader title={title} />
      <div className="rounded-br-lg rounded-bl-lg border-r border-b border-l p-8 pb-12">
        {children}
      </div>
    </div>
  )
}
