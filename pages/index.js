import Navbar from '../components/Navbar';
import DashboardCard from '../components/DashboardCard';
import { Line } from 'react-chartjs-2';
import { useState, useEffect } from 'react';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register the necessary Chart.js components
Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function Home() {
  const [theme, setTheme] = useState('dark'); // Theme toggle
  const [exportsCount, setExportsCount] = useState(15); // Exports count
  const [complianceCount, setComplianceCount] = useState(3); // Compliance count
  const [documentsCount, setDocumentsCount] = useState(8); // Documents count
  const [completedOrders, setCompletedOrders] = useState(10); // Completed Orders count
  const [remainingOrders, setRemainingOrders] = useState(5); // Remaining Orders count

  // Sample chart data based on Key Statistics (Exports, Compliance, Documents)
  const chartData = {
    labels: ['Exports', 'Compliance', 'Documents'],
    datasets: [
      {
        label: 'Key Statistics',
        data: [exportsCount, complianceCount, documentsCount], // Dynamically updated values
        borderColor: '#4caf50',
        backgroundColor: 'rgba(76, 175, 80, 0.2)',
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { color: '#555' }, ticks: { color: '#aaa' } },
    },
  };

  // Toggle theme function
  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  // Update the chart data dynamically whenever the statistics change
  useEffect(() => {
    // The chart will automatically update when the following states change
  }, [exportsCount, complianceCount, documentsCount]);

  return (
    <div className={`${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'} min-h-screen`}>
      <Navbar />
      <header className="flex justify-between items-center p-6">
        <h1 className="text-2xl sm:text-3xl font-bold">Advanced Dashboard</h1>
        <button
          onClick={toggleTheme}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
        >
          Toggle {theme === 'dark' ? 'Light' : 'Dark'} Mode
        </button>
      </header>
      <main className="container mx-auto p-4">
        {/* Statistics Section */}
        <section>
          <h2 className="text-xl sm:text-2xl font-semibold mb-4">Key Statistics</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <DashboardCard
              title="Exports"
              initialData={{ count: exportsCount, status: 'in-progress' }}
              onChange={(newCount) => setExportsCount(newCount)} // Allow user to update Exports count
            />
            <DashboardCard
              title="Compliance"
              initialData={{ count: complianceCount, status: 'compliant' }}
              onChange={(newCount) => setComplianceCount(newCount)} // Allow user to update Compliance count
            />
            <DashboardCard
              title="Documents"
              initialData={{ count: documentsCount, status: 'pending' }}
              onChange={(newCount) => setDocumentsCount(newCount)} // Allow user to update Documents count
            />
          </div>
        </section>

        {/* Chart Section */}
        <section className="mt-8">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4">Performance Overview</h2>
          <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-black p-6 rounded-lg shadow-lg">
            <Line data={chartData} options={chartOptions} />
          </div>
        </section>

        {/* Live Updates Section */}
        <section className="mt-8">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4">Live Updates</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
            <DashboardCard
              title="Active Queries"
              initialData={{ count: 7, status: 'critical' }}
            />
            <DashboardCard
              title="Pending Shipments"
              initialData={{ count: 12, status: 'delayed' }}
            />
          </div>
        </section>
      </main>
      <footer className="text-center py-4 mt-8 bg-gray-800 text-gray-400">
        &copy; 2024 Export Management Platform
      </footer>
    </div>
  );
}
