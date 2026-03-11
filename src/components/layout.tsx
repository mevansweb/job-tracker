import { AuthProvider } from '@/components/providers/auth-provider'
import { SidebarProvider } from '@/components/ui/sidebar'
import { Toaster } from '@/components/ui/sonner'
import { AppSidebar } from './app-sidebar'
import Theme from './theme'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <SidebarProvider defaultOpen={false}>
        <AppSidebar />
        <Theme>
          {children}
          <Toaster />
        </Theme>
      </SidebarProvider>
    </AuthProvider>
  )
}