'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navigation = [
    { name: 'Dashboard', href: '/' },
    { name: 'Kanban', href: '/kanban' },
    { name: 'List', href: '/list' },
    { name: 'Calendar', href: '/calendar' },
    { name: 'Focus', href: '/focus' },
    { name: 'Settings', href: '/settings' },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-indigo-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Link href="/" className="text-white text-xl font-bold">FocusFlow</Link>
              </div>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`${
                        isActive(item.href) 
                          ? 'bg-indigo-700 text-white' 
                          : 'text-indigo-100 hover:bg-indigo-500 hover:text-white'
                      } px-3 py-2 rounded-md text-sm font-medium transition-colors`}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-4 flex items-center md:ml-6">
                <Link
                  href="/auth/signin"
                  className="text-indigo-100 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Sign in
                </Link>
              </div>
            </div>
            <div className="-mr-2 flex md:hidden">
              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-indigo-200 hover:text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-800 focus:ring-white"
              >
                <span className="sr-only">Open main menu</span>
                {/* Icon when menu is closed: menu icon */}
                {/* Icon when menu is open: close icon */}
                {mobileMenuOpen ? (
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu, toggle classes based on menu state */}
        {mobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`${
                    isActive(item.href) 
                      ? 'bg-indigo-700 text-white' 
                      : 'text-indigo-100 hover:bg-indigo-500 hover:text-white'
                  } block px-3 py-2 rounded-md text-base font-medium`}
                >
                  {item.name}
                </Link>
              ))}
              <Link
                href="/auth/signin"
                className="text-indigo-100 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
              >
                Sign in
              </Link>
            </div>
          </div>
        )}
      </nav>

      <main>
        {children}
      </main>

      <footer className="bg-white">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} FocusFlow. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}