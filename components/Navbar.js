import { useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="p-4 bg-blue-500 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">Export Management</h1>
        
        {/* Hamburger menu button for mobile */}
        <button 
          onClick={toggleMenu} 
          className="lg:hidden block text-white focus:outline-none"
        >
          <svg 
            className="w-6 h-6" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M4 6h16M4 12h16M4 18h16" 
            />
          </svg>
        </button>

        {/* Desktop links */}
        <div className="space-x-4 hidden lg:flex items-center">
          <Link href="/">Dashboard</Link>
          <Link href="/orders">Orders</Link>
          <Link href="/documents">Documents</Link>
          <Link href="/negotiation">Negotiation</Link>
          <Link href="/support">Support</Link>
        </div>

        {/* Mobile menu */}
        <div 
          className={`lg:hidden absolute top-0 left-0 w-full bg-blue-500 p-4 transition-transform transform ${isMenuOpen ? 'translate-y-0' : '-translate-y-full'}`}
        >
          <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold mb-1">Export Management</h1>
          <div className="space-x-4 flex items-center">
          <Link href="/" className={router.pathname === '/' ? 'font-bold' : ''}>Dashboard</Link>
          <Link href="/orders" className={router.pathname === '/orders' ? 'font-bold' : ''}>Orders</Link>
          <Link href="/documents" className={router.pathname === '/documents' ? 'font-bold' : ''}>Documents</Link>
          <Link href="/negotiation" className={router.pathname === '/negotiation' ? 'font-bold' : ''}>Negotiation</Link>
          <Link href="/support" className={router.pathname === '/support' ? 'font-bold' : ''}>Support</Link>
        </div>
      </div>
        </div>
      </div>
    </nav>
  );
}
