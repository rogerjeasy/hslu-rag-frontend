'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Logo and description */}
          <div>
            <div className="flex items-center">
              {/* Placeholder for HSLU logo - replace with actual logo */}
              <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center mr-2">
                <span className="font-bold text-lg">H</span>
              </div>
              <span className="text-xl font-semibold">HSLU Data Science</span>
            </div>
            <p className="mt-4 text-gray-400 text-sm">
              Your intelligent study companion for mastering data science concepts and acing your exams at Lucerne University of Applied Sciences and Arts.
            </p>
            <div className="mt-6 flex space-x-4">
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Link>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-300">Quick Links</h3>
            <ul className="mt-4 space-y-2">
              {[
                { label: 'Home', href: '/' },
                { label: 'Courses', href: '/courses' },
                { label: 'Study Guide', href: '/study-guide' },
                { label: 'Practice Tests', href: '/practice' },
                { label: 'About', href: '/about' },
                { label: 'Contact', href: '/contact' },
              ].map((link) => (
                <li key={link.label}>
                  <Link 
                    href={link.href} 
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-300">Resources</h3>
            <ul className="mt-4 space-y-2">
              {[
                { label: 'Help Center', href: '/help' },
                { label: 'Privacy Policy', href: '/privacy' },
                { label: 'Terms of Service', href: '/terms' },
                { label: 'FAQ', href: '/faq' },
                { label: 'Blog', href: '/blog' },
                { label: 'System Status', href: '/status' },
              ].map((link) => (
                <li key={link.label}>
                  <Link 
                    href={link.href} 
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-300">Contact Us</h3>
            <ul className="mt-4 space-y-2">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                <span className="text-gray-400">
                  Hochschule Luzern<br />
                  Informatik<br />
                  Suurstoffi 1<br />
                  6343 Rotkreuz, Switzerland
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-gray-400">+41 41 757 67 67</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-gray-400">datascienceapp@hslu.ch</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom section with copyright */}
        <div className="mt-12 pt-8 border-t border-gray-800 text-center md:flex md:items-center md:justify-between">
          <p className="text-gray-400 text-sm">
            &copy; {currentYear} HSLU Data Science. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0">
            <Link 
              href="https://www.hslu.ch" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white text-sm transition-colors"
            >
              Visit HSLU Website →
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}