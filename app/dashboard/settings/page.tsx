import { redirect } from 'next/navigation'
import Link from 'next/link'
import ProfileForm from '@/components/dashboard/ProfileForm'
import { getCurrentUser } from '@/lib/auth/getCurrentUser'

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: { tab?: string }
}) {
  const user = await getCurrentUser()
  if (!user) redirect('/login')

  const currentTab = searchParams.tab || 'profile'

  const tabs = [
    { id: 'profile', label: 'Profile' },
    { id: 'preferences', label: 'Learning Preferences' },
    { id: 'security', label: 'Security & Data' },
  ]

  return (
    <div className="min-h-[calc(100vh-64px)] w-full text-white selection:bg-[#6B7280]/30 selection:text-white pb-24">
      <main className="mx-auto max-w-5xl px-6 pt-10">
        
        {/* Header Section */}
        <div className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-white">Settings</h1>
          <p className="text-[#A8A39E] text-[15px]">Manage your profile information, learning engine, and data.</p>
        </div>

        {/* 2-Column Modular Layout */}
        <div className="flex flex-col md:flex-row gap-10 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
          
          {/* Left Navigation */}
          <aside className="w-full md:w-64 shrink-0">
            <nav className="flex md:flex-col gap-2 overflow-x-auto pb-4 md:pb-0">
              {tabs.map((tab) => (
                <Link
                  key={tab.id}
                  href={`/dashboard/settings?tab=${tab.id}`}
                  className={`whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                    currentTab === tab.id
                      ? 'bg-white text-[#090807]'
                      : 'text-[#A8A39E] hover:bg-[#11100F] hover:text-white'
                  }`}
                >
                  {tab.label}
                </Link>
              ))}
            </nav>
          </aside>

          {/* Right Content Area */}
          <div className="flex-1 max-w-2xl">
            
            {/* Tab 1: Profile */}
            {currentTab === 'profile' && (
              <ProfileForm
                userId={user.id}
                email={user.email}
                initialName={user.fullName}
                displayName={user.displayName}
                avatarUrl={user.avatarUrl}
              />
            )}

            {/* Tab 2: Learning Preferences */}
            {currentTab === 'preferences' && (
              <div className="space-y-6">
                <section className="rounded-2xl border border-[#292725] bg-[#11100F] p-5 sm:p-6">
                  <div className="border-b border-[#292725] pb-4 mb-5">
                    <h2 className="text-base font-semibold text-white">Learning Preferences</h2>
                    <p className="text-xs text-[#A8A39E] mt-1">Configure your adaptive retention engine.</p>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-xs font-medium uppercase tracking-wider text-[#73706D]" htmlFor="auditDay">
                        Weekly Audit Trigger
                      </label>
                      <select
                        id="auditDay"
                        defaultValue="sun"
                        className="h-11 w-full rounded-xl border border-[#292725] bg-[#090807] px-4 text-sm text-white outline-none focus:border-white focus:ring-1 focus:ring-white transition-all duration-200"
                      >
                        <option value="fri">Every Friday</option>
                        <option value="sun">Every Sunday</option>
                        <option value="off">Off (Manual audits only)</option>
                      </select>
                      <p className="text-[11px] text-[#73706D]">Choose when you receive prompts to review decaying concepts.</p>
                    </div>

                    <div className="flex items-center justify-between border-t border-[#292725] pt-5">
                      <div>
                        <h3 className="text-sm font-medium text-white">Decay Notifications</h3>
                        <p className="text-[11px] text-[#73706D] mt-0.5">Email alerts when core topics begin to decay.</p>
                      </div>
                      <label className="relative inline-flex cursor-pointer items-center">
                        <input type="checkbox" className="peer sr-only" defaultChecked />
                        <div className="peer h-6 w-11 rounded-full bg-[#292725] after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-[#73706D] after:transition-all after:content-[''] peer-checked:bg-white peer-checked:after:translate-x-full peer-checked:after:bg-[#090807] peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-white/50"></div>
                      </label>
                    </div>
                  </div>
                </section>
              </div>
            )}

            {/* Tab 3: Security & Data */}
            {currentTab === 'security' && (
              <div className="space-y-6">
                <section className="rounded-2xl border border-[#292725] bg-[#11100F] p-5 sm:p-6">
                  <div className="border-b border-[#292725] pb-4 mb-5">
                    <h2 className="text-base font-semibold text-white">Data Management</h2>
                    <p className="text-xs text-[#A8A39E] mt-1">Export your learning data or manage your account.</p>
                  </div>

                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#292725] pb-6">
                      <div>
                        <h3 className="text-sm font-medium text-white">Export Skill Graph</h3>
                        <p className="text-[11px] text-[#73706D] mt-0.5">Download your mastery metrics and topic progress as JSON.</p>
                      </div>
                      <button className="whitespace-nowrap rounded-xl border border-[#292725] bg-[#141210] px-4 py-2 text-xs font-semibold text-white transition-colors hover:border-[#3D3A37] hover:bg-[#1C1A18] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
                        Export Data
                      </button>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
                      <div>
                        <h3 className="text-sm font-medium text-red-400">Delete Account</h3>
                        <p className="text-[11px] text-[#73706D] mt-0.5">Permanently delete your account and all progress data.</p>
                      </div>
                      <button className="whitespace-nowrap rounded-xl border border-red-500/30 bg-red-950/20 px-4 py-2 text-xs font-semibold text-red-400 transition-colors hover:border-red-500/50 hover:bg-red-950/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400">
                        Delete Account
                      </button>
                    </div>
                  </div>
                </section>
              </div>
            )}

          </div>
        </div>
      </main>
    </div>
  )
}