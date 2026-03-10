import { AuthProvider } from '@/components/providers/auth-provider'
import { SidebarProvider } from './ui/sidebar'
import { AppSidebar } from './app-sidebar'
import Theme from './theme'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <SidebarProvider defaultOpen={false}>
        <AppSidebar />
        <Theme>
          {children}
        </Theme>
      </SidebarProvider>
    </AuthProvider>
  )
}