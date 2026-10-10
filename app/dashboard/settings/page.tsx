import { redirect } from 'next/navigation'
import ProfileForm from '@/components/dashboard/ProfileForm'
import { getCurrentUser } from '@/lib/auth/getCurrentUser'

export default async function SettingsPage() {
  const user = await getCurrentUser()

  if (!user) redirect('/login')

  return (
    <div className="min-h-[calc(100vh-64px)] w-full text-white selection:bg-[#6B7280]/30 selection:text-white pb-24">
      <main className="mx-auto max-w-[800px] px-6 pt-10">
        
        {/* Header Section */}
        <div className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-white">Settings</h1>
          <p className="text-[#9A9692] text-[15px]">Manage your profile information and preferences.</p>
        </div>

        {/* Profile Form Component */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
          <ProfileForm
            userId={user.id}
            email={user.email}
            initialName={user.fullName}
            displayName={user.displayName}
            avatarUrl={user.avatarUrl}
          />
        </div>
      </main>
    </div>
  )
}