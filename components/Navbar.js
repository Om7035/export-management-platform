// components/Navbar.js
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="p-4 bg-blue-500 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">Export Management</h1>
        <div className="space-x-4 flex items-center">
          <Link href="/">Dashboard</Link>
          <Link href="/orders">Orders</Link>
          <Link href="/documents">Documents</Link>
          <Link href="/negotiation">Negotiation</Link>
          <Link href="/support">Support</Link>
        </div>
      </div>
    </nav>
  );
}
