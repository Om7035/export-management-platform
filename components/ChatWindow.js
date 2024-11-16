import { useState, useEffect } from 'react';
import axios from 'axios';  // Import axios for API requests
import { FaRegBell, FaEnvelope, FaTicketAlt, FaExclamationCircle } from 'react-icons/fa'; // Import relevant icons

export default function ChatWindow() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [ticketTitle, setTicketTitle] = useState('');
  const [ticketDescription, setTicketDescription] = useState('');
  const [ticketPriority, setTicketPriority] = useState('low');
  const [tickets, setTickets] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // Replace with your actual Gemini API key
  const GEMINI_API_KEY = 'AIzaSyDm5mVft2gEoAnhJEiBbyl3cWysrrs5WUw';  

  // Placeholder for real-time updates (simulated here)
  useEffect(() => {
    const interval = setInterval(() => {
      setNotifications((prev) => [
        ...prev,
        { message: 'New shipment issue detected!', type: 'alert' },
      ]);
    }, 8000);  // Simulate a notification every 8 seconds

    return () => clearInterval(interval);  // Cleanup on unmount
  }, []);

  // Fetch chat messages from Gemini API
  const fetchChatMessages = async () => {
    try {
      const response = await axios.get('https://api.gemini.com/v1/chat', {
        headers: {
          'Authorization': `Bearer ${GEMINI_API_KEY}`,
        },
      });
      setMessages(response.data.messages);  // Assuming the API returns messages in this format
    } catch (error) {
      console.error('Error fetching chat messages:', error);
    }
  };

  // Send message to Gemini API
  const handleSendMessage = async () => {
    if (newMessage.trim() !== '') {
      try {
        const messageData = {
          message: newMessage,
          sender: 'user',  // You can change this depending on who is sending the message
        };

        // Post the new message to the Gemini API
        await axios.post('https://api.gemini.com/v1/chat/send', messageData, {
          headers: {
            'Authorization': `Bearer ${GEMINI_API_KEY}`,
          },
        });

        // Add the message to local state
        setMessages([...messages, messageData]);
        setNewMessage('');
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  // Handle creating a new support ticket
  const handleCreateTicket = () => {
    if (ticketTitle && ticketDescription) {
      const newTicket = {
        id: tickets.length + 1,
        title: ticketTitle,
        description: ticketDescription,
        priority: ticketPriority,
        status: 'open',
      };
      setTickets([...tickets, newTicket]);
      setTicketTitle('');
      setTicketDescription('');
      setTicketPriority('low');
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-4xl font-semibold text-white mb-8">Support Center</h1>

        {/* Notifications Section */}
        {notifications.length > 0 && (
          <div className="bg-yellow-600 p-4 rounded-lg mb-6 flex items-center">
            <FaExclamationCircle className="text-white mr-2" />
            <p className="text-white">{notifications[notifications.length - 1].message}</p>
          </div>
        )}

        {/* Live Chat Section */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-2xl font-bold text-white mb-4">Live Chat</h2>
          <div className="bg-gray-700 p-4 rounded-lg h-80 overflow-y-scroll">
            {/* Chat Messages */}
            <div className="space-y-4">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`${
                    msg.sender === 'user' ? 'text-right' : 'text-left'
                  } mb-3`}
                >
                  <p
                    className={`${
                      msg.sender === 'user' ? 'bg-blue-500' : 'bg-gray-500'
                    } p-3 inline-block text-white rounded-lg`}
                  >
                    {msg.message}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Input Area */}
          <div className="mt-4 flex flex-col sm:flex-row">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="w-full sm:w-3/4 p-3 bg-gray-700 text-white rounded-l-md focus:outline-none"
              placeholder="Type your message..."
            />
            <button
              onClick={handleSendMessage}
              className="bg-blue-500 p-3 text-white rounded-r-md sm:ml-2 mt-2 sm:mt-0 hover:bg-blue-600"
            >
              Send
            </button>
          </div>
        </div>

        {/* Email Support Section */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-2xl font-bold text-white mb-4">Email Support</h2>
          <div className="bg-gray-700 p-4 rounded-lg">
            <FaEnvelope className="text-yellow-500 mb-2" />
            <p className="text-white">
              If your query is more complex, feel free to send us an email at support@freshfruits.com for further assistance.
            </p>
          </div>
        </div>

        {/* Support Tickets Section */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-2xl font-bold text-white mb-4">Create Support Ticket</h2>

          <div className="space-y-4">
            <div>
              <label className="text-gray-300">Ticket Title</label>
              <input
                type="text"
                value={ticketTitle}
                onChange={(e) => setTicketTitle(e.target.value)}
                className="w-full p-3 bg-gray-700 text-white rounded-md"
              />
            </div>
            <div>
              <label className="text-gray-300">Ticket Description</label>
              <textarea
                value={ticketDescription}
                onChange={(e) => setTicketDescription(e.target.value)}
                className="w-full p-3 bg-gray-700 text-white rounded-md"
              />
            </div>
            <div>
              <label className="text-gray-300">Priority</label>
              <select
                value={ticketPriority}
                onChange={(e) => setTicketPriority(e.target.value)}
                className="w-full p-3 bg-gray-700 text-white rounded-md"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <button
              onClick={handleCreateTicket}
              className="w-full bg-green-500 p-3 rounded-md text-white hover:bg-green-600"
            >
              Create Ticket
            </button>
          </div>
        </div>

        {/* Support Tickets List */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-white mb-4">Your Support Tickets</h2>

          {tickets.length > 0 ? (
            tickets.map((ticket) => (
              <div key={ticket.id} className="bg-gray-700 p-4 rounded-lg mb-4">
                <h3 className="text-xl font-semibold text-white">{ticket.title}</h3>
                <p className="text-gray-300">{ticket.description}</p>
                <p className={`text-${ticket.status === 'open' ? 'green' : 'red'}-500`}>
                  Status: {ticket.status}
                </p>
                <p className="text-gray-400">Priority: {ticket.priority}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-400">No tickets created yet. You can create one above!</p>
          )}
        </div>
      </div>
    </div>
  );
}
