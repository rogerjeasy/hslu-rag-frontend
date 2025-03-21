'use client'

import React from 'react'

export function UserSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="w-full h-12 bg-muted rounded"></div>
      
      {/* Table header */}
      <div className="flex border rounded-t-md">
        <div className="w-1/4 p-3 bg-muted/50"></div>
        <div className="w-1/4 p-3 bg-muted/50"></div>
        <div className="w-1/4 p-3 bg-muted/50"></div>
        <div className="w-1/4 p-3 bg-muted/50"></div>
      </div>
      
      {/* Table rows */}
      {Array(5).fill(0).map((_, i) => (
        <div key={i} className="flex border-x border-b">
          <div className="w-1/4 p-3">
            <div className="h-6 bg-muted rounded"></div>
          </div>
          <div className="w-1/4 p-3">
            <div className="h-6 bg-muted rounded"></div>
          </div>
          <div className="w-1/4 p-3">
            <div className="h-6 w-20 bg-muted rounded"></div>
          </div>
          <div className="w-1/4 p-3 flex justify-end">
            <div className="h-6 w-24 bg-muted rounded"></div>
          </div>
        </div>
      ))}
    </div>
  )
}