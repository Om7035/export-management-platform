import { useState } from "react";
import dynamic from "next/dynamic"; // Import dynamic from Next.js for client-side rendering
import { motion } from "framer-motion";
import Navbar from "../components/Navbar"; // Import Navbar component
import { FaTruck, FaCheckCircle, FaRegClock, FaSun, FaMoon } from "react-icons/fa"; // Import icons for statuses
import DashboardCard from "../components/DashboardCard"; // Import DashboardCard

// Dynamically import Map component to prevent SSR issues
const Map = dynamic(() => import("../components/Map"), { ssr: false });

export default function Orders() {
  const [shipmentId, setShipmentId] = useState("");
  const [shipmentData, setShipmentData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(true); // State for dark/light mode

  // Sample shipments data
  const shipments = [
    { id: "123", description: "Fresh Mangoes", location: "Mumbai, India", coordinates: [19.0760, 72.8777], status: "in-transit", count: 5 },
    { id: "124", description: "Apples", location: "New York, USA", coordinates: [40.7128, -74.0060], status: "delivered", count: 10 },
    { id: "125", description: "Bananas", location: "Delhi, India", coordinates: [28.6139, 77.2090], status: "delayed", count: 3 },
    { id: "126", description: "Oranges", location: "Paris, France", coordinates: [48.8566, 2.3522], status: "in-transit", count: 8 },
    { id: "127", description: "Grapes", location: "Sydney, Australia", coordinates: [-33.8688, 151.2093], status: "delivered", count: 12 },
  ];

  // Handle Shipment ID change
  const handleShipmentSearch = (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const foundShipment = shipments.find(
      (shipment) => shipment.id === shipmentId
    );

    if (foundShipment) {
      setShipmentData(foundShipment);
    } else {
      setError("Shipment not found. Please check the Shipment ID.");
    }
    setLoading(false);
  };

  // Handle the update of data from DashboardCard.js
  const handleUpdateShipmentData = (updatedData) => {
    setShipmentData((prevData) => ({
      ...prevData,
      ...updatedData,
    }));
  };

  // Get the appropriate icon and color based on status
  const getStatusIcon = (status) => {
    switch (status) {
      case "delivered":
        return <FaCheckCircle className="text-green-500" />;
      case "in-transit":
        return <FaTruck className="text-yellow-500" />;
      case "delayed":
        return <FaRegClock className="text-red-500" />;
      default:
        return null;
    }
  };

  // Toggle Dark/Light mode
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={`${isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"} min-h-screen`}>
      {/* Navbar here */}
      <Navbar />

      <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold">Order & Shipment Tracking</h1>
          
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700 focus:outline-none"
          >
            {isDarkMode ? <FaSun className="text-yellow-500" /> : <FaMoon className="text-blue-500" />}
          </button>
        </div>

        {/* Shipment ID Input */}
        <motion.div
          className="flex items-center mb-4 bg-gray-800 rounded-lg"
          whileHover={{ scale: 1.05 }}
        >
          <input
            type="text"
            className="p-3 flex-grow rounded-l-md bg-gray-700 text-white focus:outline-none h-12"
            placeholder="Enter Shipment ID"
            value={shipmentId}
            onChange={(e) => setShipmentId(e.target.value)}
          />
          <button
            onClick={handleShipmentSearch}
            className="bg-blue-500 p-3 text-white rounded-r-md hover:bg-blue-600 focus:outline-none h-12 -mt-0"
          >
            Track
          </button>
        </motion.div>

        {/* Error or Loading State */}
        {loading && <p className="text-yellow-400">Loading shipment details...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {/* Shipment Details Section */}
        {shipmentData && !loading && !error && (
          <motion.div
            className="mt-6 bg-gray-800 p-6 rounded-lg shadow-lg"
            whileHover={{ scale: 1.03 }}
          >
            <h2 className="text-xl font-bold">{shipmentData.description}</h2>
            <p className="mt-2">Location: {shipmentData.location}</p>

            {/* Status with icon */}
            <div className="mt-2 flex items-center space-x-2">
              {getStatusIcon(shipmentData.status)}
              <p className="text-white p-2 rounded-lg">{shipmentData.status}</p>
            </div>

            {/* Dashboard Card for Editing */}
            <DashboardCard
              title="Shipment Details"
              initialData={shipmentData}
              onUpdateData={handleUpdateShipmentData}
            />
          </motion.div>
        )}

        {/* Map Display */}
        {shipmentData && (
          <div className="mt-8 h-96">
            <Map shipmentData={shipmentData} />
          </div>
        )}

        {/* All Shipments List */}
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">All Shipments</h2>
          <div className="space-y-4">
            {shipments.map((shipment) => (
              <div
                key={shipment.id}
                className="bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-xl transition-all"
              >
                <h3 className="text-lg font-semibold text-white">{shipment.description}</h3>
                <p className="text-gray-400">ID: {shipment.id}</p>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(shipment.status)}
                  <p>Status: {shipment.status}</p>
                </div>
                <p>Location: {shipment.location}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
