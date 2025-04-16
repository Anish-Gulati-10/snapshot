"use client"
import { LoginForm } from '@/components/LoginForm'
import { auth } from '@/firebase/firebase';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'

const page = () => {
  const router = useRouter()
  useEffect(() => {
    if (auth.currentUser) {
      console.log("User is already logged in:", auth.currentUser);
      router.push("/"); // Redirect to home if user is already logged in
    }
  }, [auth, router]);
  return (
    <section className="flex h-screen items-center justify-center">
        <div className="w-full max-w-lg px-4 py-8">
            <LoginForm className="w-full" />
        </div>
    </section>
  )
}

export default page