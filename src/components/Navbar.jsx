import Link from 'next/link'
import React from 'react'
import { Button } from './ui/button'

const Navbar = () => {
  return (
    <nav className='flex items-center justify-between p-5 h-20 text-[var(--navbar-foreground)] border-b border-gray-200 dark:border-gray-700 shadow-sm bg-gradient-to-b from-primary/20 to-white dark:to-transparent'>
            <Link href="/" className='text-2xl font-bold text-primary dark:text-white'>SnapShop</Link>
            <Link href="/signin"><Button>Sign In</Button></Link>
    </nav>
  )
}

export default Navbar