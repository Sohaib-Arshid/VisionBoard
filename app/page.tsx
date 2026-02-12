"use client"
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    router.push('/login')
  }, [router])

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="animate-pulse text-red-500 font-mono">
        Loading High-Performance Vault...
      </div>
    </div>
  )
}