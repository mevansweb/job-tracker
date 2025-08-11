import type { JSX, SVGAttributes } from 'react'

type IconProps = Partial<{
  alt: string
  className: string
  height: string | number
  preserveAspectRatio: string
  title: string
  theme?: string
  width: string | number
}> &
  SVGAttributes<SVGElement>

type DirectionalProps = { direction?: 'left' | 'up' | 'right' | 'down' }
type LogoProps = { color?: string }

type SolidProps = { solid?: boolean } & IconProps
type SolidComponent = (props: SolidProps & IconProps) => JSX.Element
type SolidHOC = (component: SolidComponent) => SolidComponent

export type { DirectionalProps, IconProps, LogoProps, SolidProps, SolidComponent, SolidHOC }
