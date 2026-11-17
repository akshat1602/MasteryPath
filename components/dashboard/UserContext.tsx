'use client'

import React, { createContext, useContext } from 'react'

type DashboardUser = {
  displayName?: string | null
  email?: string | null
}

const UserContext = createContext<DashboardUser>({})

export function UserProvider({
  user,
  children,
}: {
  user: DashboardUser
  children: React.ReactNode
}) {
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>
}

export function useDashboardUser(): DashboardUser {
  return useContext(UserContext)
}