import { AuthProvider } from '@/components/providers/auth-provider'
import { SidebarProvider } from './ui/sidebar'
import { AppSidebar } from './app-sidebar'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <SidebarProvider defaultOpen={false}>
        <AppSidebar />
        <main className="w-[calc(100vw-48px)] peer-data-[state=expanded]:w-[calc(100vw-256px)] h-screen">
          {children}
        </main>
      </SidebarProvider>
    </AuthProvider>
  )
}