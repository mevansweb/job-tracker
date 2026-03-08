export const themes = ['light', 'dark']
export const backgroundColors = ['default', 'blue', 'gray', 'green', 'purple', 'red']
export const fonts = ['default', 'inter', 'montserrat', 'monospace', 'outfit', 'roboto', 'sans', 'serif']
export const sidebarColors = ['default', 'blue', 'gray', 'green', 'purple', 'red']
/*
red 
orange 
amber
yellow
lime
green
emerald
teal
cyan
sky
blue
indigo
violet
purple
fuchsia
pink
rose
slate
gray
zinc
neutral
stone
taupe
mauve
mist
olive
*/

export const bgThemeVariants = {
  dark: {
    blue: 'bg-blue-900',
    gray: 'bg-gray-900',
    green: 'bg-green-900',
    purple: 'bg-purple-900',
    red: 'bg-red-900'
  },
  light: {
    blue: 'bg-blue-200',
    gray: 'bg-gray-200',
    green: 'bg-green-200',
    purple: 'bg-purple-200',
    red: 'bg-red-200'
  } 
}

export const sbThemeVariants = {
  dark: {
    blue: '[&_>_div_>_div_>_div]:!bg-blue-900',
    gray: '[&_>_div_>_div_>_div]:!bg-gray-900',
    green: '[&_>_div_>_div_>_div]:!bg-green-900',
    purple: '[&_>_div_>_div_>_div]:bg-purple-900',
    red: '[&_>_div_>_div_>_div]:bg-red-900'
  },
  light: {
    blue: '[&_>_div_>_div_>_div]:!bg-blue-200',
    gray: '[&_>_div_>_div_>_div]:!bg-gray-200',
    green: '[&_>_div_>_div_>_div]:!bg-green-200',
    purple: '[&_>_div_>_div_>_div]:bg-purple-900',
    red: '[&_>_div_>_div_>_div]:bg-red-200'
  }
}

export const fontVariants = {
  inter: 'font-(family-name:--font-inter)',
  monospace: 'font-mono',
  monterrat: 'font-(family-name:--font-montserrat)',
  outfit: 'font-(family-name:--font-outfit)',
  roboto: 'font-(family-name:--font-roboto)',
  sans: 'font-sans',
  serif: 'font-serif'
}
