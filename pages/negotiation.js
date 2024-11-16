import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import axios from 'axios';

const OPENCAGE_API_KEY = 'b9f3da6e937e474f8b13be4b3c0c0772'; // Replace with your OpenCage API key

// Function to calculate distance between two coordinates using the Haversine formula
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const toRadians = (degrees) => (degrees * Math.PI) / 180;
  const R = 6371; // Radius of Earth in km
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};

// Function to get coordinates for a location using OpenCage API
const fetchCoordinates = async (location) => {
  try {
    const response = await axios.get(
      `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
        location
      )}&key=${OPENCAGE_API_KEY}`
    );
    const { results } = response.data;
    if (results.length > 0) {
      const { lat, lng } = results[0].geometry;
      return { lat, lng };
    } else {
      throw new Error('Location not found');
    }
  } catch (error) {
    console.error('Error fetching coordinates:', error);
    throw error;
  }
};

// Simulated fetch function for carrier suggestions with refined realistic rates
const allCarriers = [
  {
    carrier: 'BlueExpress Logistics',
    rate: 1200,
    speed: 'Express (2-3 Days)',
    rating: 4.9,
    mode: 'Airplane',
    description: 'Fast and premium delivery with guaranteed on-time arrival. Best for urgent shipments.',
  },
  {
    carrier: 'QuickShip Solutions',
    rate: 800,
    speed: 'Standard (5-7 Days)',
    rating: 4.2,
    mode: 'Truck',
    description: 'Reliable, cost-effective shipping for non-urgent deliveries.',
  },
  // Add the rest of the carriers as needed...
];

// Function to randomly select 5 carriers
const fetchCarrierSuggestions = async (shipmentDetails) => {
  const { size, distance, source, destination } = shipmentDetails;

  const baseRates = {
    small: 500, // base rate for small packages
    medium: 1000, // base rate for medium packages
    large: 1500, // base rate for large packages
  };

  // Calculate rate adjustments based on distance, size, and additional factors
  const adjustedRates = {
    small: baseRates.small + distance * 2,
    medium: baseRates.medium + distance * 3,
    large: baseRates.large + distance * 5,
  };

  // Additional adjustments based on weight (simulated)
  const weightAdjustment = size === 'large' ? 500 : size === 'medium' ? 200 : 0;

  // Update carrier information with adjusted rates
  const carriers = allCarriers.map((carrier) => ({
    ...carrier,
    rate: carrier.rate + adjustedRates[size] + weightAdjustment,
  }));

  // Filter out carriers that don't match certain criteria (e.g., mode or destination)
  const filteredCarriers = carriers.filter((carrier) => {
    if (destination === 'International' && carrier.mode !== 'Ship') {
      return false; // Only ships can handle international large shipments
    }
    return true;
  });

  // Randomly pick 5 carriers to show from the filtered list
  const randomCarriers = [];
  while (randomCarriers.length < 5 && filteredCarriers.length > 0) {
    const randomIndex = Math.floor(Math.random() * filteredCarriers.length);
    randomCarriers.push(filteredCarriers[randomIndex]);
    filteredCarriers.splice(randomIndex, 1); // Remove selected carrier from the list
  }

  return randomCarriers;
};

export default function Negotiation() {
  const [carrierSuggestions, setCarrierSuggestions] = useState([]);
  const [shipmentDetails, setShipmentDetails] = useState({
    source: '',
    destination: '',
    size: 'small',
    distance: 0,
  });
  const [distance, setDistance] = useState(null);
  const [manualDistance, setManualDistance] = useState('');
  const [useManualDistance, setUseManualDistance] = useState(false);
  const [theme, setTheme] = useState('light');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) setTheme(storedTheme);
    else setTheme('light');
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShipmentDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleDistanceChange = (e) => {
    setManualDistance(e.target.value);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { source, destination, size } = shipmentDetails;

      // Fetch coordinates for source and destination
      const sourceCoords = await fetchCoordinates(source);
      const destinationCoords = await fetchCoordinates(destination);

      // Calculate distance only if manual distance is not being used
      let calculatedDistance = 0;
      if (!useManualDistance) {
        calculatedDistance = calculateDistance(
          sourceCoords.lat,
          sourceCoords.lng,
          destinationCoords.lat,
          destinationCoords.lng
        );
      }

      // Update shipment details with calculated or manual distance
      const updatedDetails = { source, destination, size, distance: useManualDistance ? manualDistance : calculatedDistance };
      setShipmentDetails(updatedDetails);
      setDistance(useManualDistance ? manualDistance : calculatedDistance.toFixed(2));

      // Fetch carrier suggestions
      const carriers = await fetchCarrierSuggestions(updatedDetails);
      setCarrierSuggestions(carriers);
    } catch (error) {
      console.error('Error calculating distance:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleTheme = () => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));

  return (
    <div className={`${theme} min-h-screen flex flex-col`}>
      <Navbar />
      <main className="container mx-auto p-4 sm:p-8">
        <div className="flex justify-between items-center mb-8 flex-wrap">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 dark:text-gray-200">Carrier Negotiation</h1>
          <button
            onClick={toggleTheme}
            className="px-4 py-2 mt-4 sm:mt-0 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
          >
            Toggle {theme === 'dark' ? 'Light' : 'Dark'} Mode
          </button>
        </div>

        <div className="text-sm text-red-700 font-semibold mb-8">
          *Please note: This model is still under development, and the calculated distance may not be accurate.
        </div>

        <section className="bg-white dark:bg-gray-800 p-6 shadow-lg rounded-lg mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold mb-6 dark:text-gray-200">Enter Shipment Details</h2>
          <form onSubmit={handleFormSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-lg font-medium dark:text-gray-200">Source:</label>
              <input
                type="text"
                name="source"
                onChange={handleInputChange}
                className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-gray-200"
                placeholder="Enter source location"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-lg font-medium dark:text-gray-200">Destination:</label>
              <input
                type="text"
                name="destination"
                onChange={handleInputChange}
                className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-gray-200"
                placeholder="Enter destination location"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-lg font-medium dark:text-gray-200">Package Size:</label>
              <select
                name="size"
                onChange={handleInputChange}
                className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-gray-200"
                required
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </div>

            <div className="space-y-2 flex items-center">
              <input
                type="checkbox"
                checked={useManualDistance}
                onChange={() => setUseManualDistance(!useManualDistance)}
                className="mr-3"
              />
              <label className="text-lg font-medium dark:text-gray-200">Use Manual Distance</label>
            </div>

            {useManualDistance && (
              <div className="space-y-2">
                <label className="text-lg font-medium dark:text-gray-200">Manual Distance (km):</label>
                <input
                  type="number"
                  value={manualDistance}
                  onChange={handleDistanceChange}
                  className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-gray-200"
                  placeholder="Enter distance manually"
                  required
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full p-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all"
            >
              {loading ? 'Loading...' : 'Find Carriers'}
            </button>
          </form>
        </section>

        {carrierSuggestions.length > 0 && (
          <section className="bg-white dark:bg-gray-800 p-6 shadow-lg rounded-lg">
            <h2 className="text-xl sm:text-2xl font-semibold mb-6 dark:text-gray-200">Suggested Carriers</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {carrierSuggestions.map((carrier, index) => (
                <div key={index} className="p-6 border rounded-lg shadow-md dark:bg-gray-700 dark:text-gray-200">
                  <h3 className="text-lg font-semibold mb-3">{carrier.carrier}</h3>
                  <p className="text-sm">{carrier.description}</p>
                  <div className="mt-3">
                    <p className="text-sm text-gray-600">Rate: ₹{carrier.rate}</p>
                    <p className="text-sm text-gray-600">Speed: {carrier.speed}</p>
                    <p className="text-sm text-gray-600">Rating: {carrier.rating} ★</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
