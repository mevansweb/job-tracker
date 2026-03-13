import { Toaster } from '@/components/ui/sonner'
import { SidebarProvider } from '@/components/ui/sidebar'
import { AuthProvider } from '@/components/providers/auth-provider'

import Theme from './theme'
import { AppSidebar } from './app-sidebar'

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