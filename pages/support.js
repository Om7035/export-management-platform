// pages/support.js
import Navbar from '../components/Navbar';
import ChatWindow from '../components/ChatWindow';

export default function Support() {
  return (
    <div>
      <Navbar />
      <main className="container mx-auto p-4">
        <h1 className="text-2xl font-bold">Support</h1>
        <ChatWindow />
      </main>
    </div>
  );
}
