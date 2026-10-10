import { redirect } from 'next/navigation'
import DashboardShell from '@/components/dashboard/DashboardShell'
import { getCurrentUser } from '@/lib/auth/getCurrentUser'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()

  if (!user) redirect('/login')

  return (
    <DashboardShell
      user={{
        displayName: user.displayName,
        email: user.email,
        avatarUrl: user.avatarUrl,
      }}
    >
      {children}
    </DashboardShell>
  )
}