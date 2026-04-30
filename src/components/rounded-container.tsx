import { cn } from '@/lib/utils'

import { RoundedHeader } from './rounded-header'

export const RoundedContainer = ({
  button,
  children,
  className = '',
  title,
}: {
  button?: React.ReactNode
  children: React.ReactNode
  className?: string
  title: string
}) => {
  return (
    <div
      className={cn(
        'bg-card text-card-foreground mt-8 flex flex-col rounded-br-lg rounded-bl-lg shadow-md sm:w-9/8 md:mx-auto md:w-9/10 lg:w-2/3',
        className
      )}
    >
      <RoundedHeader children={button} title={title} />
      <div className="rounded-br-lg rounded-bl-lg border-r border-b border-l p-8 pb-12">
        {children}
      </div>
    </div>
  )
}
