'use client'

import React from 'react'
import { Button } from '@heroui/react'
import Link from 'next/link'
import { ShieldAlert } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="bg-background flex min-h-screen flex-col items-center justify-center p-4 text-center">
      <div className="flex flex-col items-center space-y-4">
        <div className="bg-default-100 rounded-full p-6">
          <ShieldAlert size={64} className="text-danger" />
        </div>
        <h1 className="text-foreground text-4xl font-bold tracking-tight sm:text-6xl">404</h1>
        <h2 className="text-foreground-500 text-xl font-semibold">Page Not Found</h2>
        <p className="text-foreground-400 max-w-md text-lg">
          Sorry, we couldn't find the page you're looking for. It might have been moved or deleted.
        </p>
        <div className="mt-8">
          <Link href="/">
            <Button color="primary" size="lg" variant="shadow">
              Go Back Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
