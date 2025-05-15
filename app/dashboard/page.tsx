import React from 'react'

export default function page() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, Gerald! Here&apos;s an overview of your audit system.
          </p>
        </div>
      </div>
    </div>
  )
}
