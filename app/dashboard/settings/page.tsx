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
        <div className="mb-8">
          <h1 className="mb-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Settings
          </h1>
          <p className="text-sm text-[#9A9692]">
            Manage your personal profile information and authentication account details.
          </p>
        </div>

        {/* Profile Form */}
        <ProfileForm
          userId={user.id}
          email={user.email}
          initialName={user.fullName}
          displayName={user.displayName}
          avatarUrl={user.avatarUrl}
        />
      </main>
    </div>
  )
}