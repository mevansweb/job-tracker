import { Calendar, CodeXml, Edit, Home, School, Search, Settings } from 'lucide-react'

import { getStyles } from '@/global/functions'
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarTrigger } from '@/components/ui/sidebar'

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
    title: 'Tasks',
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
  },
  {
    title: 'Test Prep Page',
    url: '/test-prep',
    icon: School
  }
]

export function AppSidebar() {
  const { state } = useAuth()
  const { sidebarColor, theme } = state.settings || { sidebarColor: '', theme: ''}
  const themeClasses = `${getStyles({ theme, name: 'sidebarColor', strKey: sidebarColor})}`

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
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <a href={item.url} className="flex items-center gap-2">
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