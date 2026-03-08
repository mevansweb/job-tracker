import { Calendar, CodeXml, Edit, Home, Search, Settings } from 'lucide-react'
import { sbThemeVariants } from '@/global/constants'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from '@/components/ui/sidebar'

import { useAuth } from './providers/hooks'

// Menu items.
const items = [
  {
    title: 'Home',
    url: '/',
    icon: Home,
  },
  {
    title: 'Practice',
    url: '/practice',
    icon: CodeXml,
  },
  {
    title: 'Calendar',
    url: '/tasks',
    icon: Calendar,
  },
  {
    title: 'Search',
    url: '/search',
    icon: Search,
  },
  {
    title: 'Settings',
    url: '/settings',
    icon: Settings,
  },
  {
    title: 'Assessments',
    url: '/assessments',
    icon: Edit,
  }
]

export function AppSidebar() {
  const { state } = useAuth()
  const { sidebarColor, theme } = state.settings || { sidebarColor: '', theme: ''}
  let themeClasses = ''
  if (sidebarColor && theme) {
    if (sbThemeVariants[theme as keyof typeof sbThemeVariants] && sbThemeVariants[theme as keyof typeof sbThemeVariants][sidebarColor as keyof typeof sbThemeVariants[keyof typeof sbThemeVariants]])  {
      themeClasses+= ' ' + sbThemeVariants[theme as keyof typeof sbThemeVariants][sidebarColor as keyof typeof sbThemeVariants[keyof typeof sbThemeVariants]]
    }
  } else if (sidebarColor) {
    themeClasses+= ' ' + sbThemeVariants['light'][sidebarColor as keyof typeof sbThemeVariants[keyof typeof sbThemeVariants]]
  }

  return (
    <Sidebar className={themeClasses} collapsible={'icon'}>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            <div className="flex items-center">
                <h1 className="text-xl capitalize">
                  Job Tracker
                </h1>
            </div>
          </SidebarGroupLabel>
          <SidebarGroupContent className="mt-8">
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} title={item.title} className="flex items-center gap-2">
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup> 
      </SidebarContent>
      <SidebarFooter>
        <SidebarTrigger /> 
      </SidebarFooter>
    </Sidebar>
  )
}