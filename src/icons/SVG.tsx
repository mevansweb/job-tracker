import * as React from 'react'

import type { IconProps } from './types'

type SVGProps = {
  children?: React.ReactNode
  style?: React.CSSProperties
  title: string
  viewBox?: string
} & IconProps

const SVG = ({ children, className, title, ...props }: SVGProps) => {
  const {
    height = '1em',
    preserveAspectRatio = 'xMidYMid meet',
    viewBox = '0 0 36 36',
    width = '1em',
    ...events
  } = props

  return (
    <svg
      {...events}
      className={className}
      height={height}
      preserveAspectRatio={preserveAspectRatio}
      role="img"
      version="1.1"
      viewBox={viewBox}
      width={width}
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      {title && <title>{title}</title>}
      {children}
    </svg>
  )
}

export default SVG