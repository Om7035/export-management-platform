import { useState } from 'react';
import { motion } from 'framer-motion';

export default function DashboardCard({ title, initialData, onUpdateData }) {
  const [data, setData] = useState(initialData);
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (field, value) => {
    setData((prevData) => ({ ...prevData, [field]: value }));
  };

  const handleSave = () => {
    setIsEditing(false);
    onUpdateData(data); // Call parent function to update the state
  };

  return (
    <motion.div
      className="p-6 bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 relative"
      whileHover={{ scale: 1.03 }}
    >
      <h2 className="text-lg font-bold text-white uppercase tracking-wider">{title}</h2>

      {isEditing ? (
        <div className="mt-4 space-y-2">
          <div>
            <label className="text-sm text-gray-400">Count</label>
            <input
              type="number"
              value={data.count}
              onChange={(e) => handleChange('count', e.target.value)}
              className="w-full p-2 mt-1 bg-gray-700 text-white rounded"
            />
          </div>
          <div>
            <label className="text-sm text-gray-400">Status</label>
            <select
              value={data.status}
              onChange={(e) => handleChange('status', e.target.value)}
              className="w-full p-2 mt-1 bg-gray-700 text-white rounded"
            >
              <option value="compliant">Compliant</option>
              <option value="pending">Pending</option>
              <option value="critical">Critical</option>
              <option value="delayed">Delayed</option>
              <option value="in-progress">In Progress</option>
            </select>
          </div>
          <button
            onClick={handleSave}
            className="w-full mt-4 p-2 bg-green-600 hover:bg-green-700 text-white rounded"
          >
            Save Changes
          </button>
        </div>
      ) : (
        <div className="flex justify-between items-center mt-4">
          <p className="text-4xl font-extrabold text-blue-400">{data.count}</p>
          <span
            className={`px-3 py-1 text-sm font-semibold rounded ${data.status === 'compliant' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}
          >
            {data.status}
          </span>
        </div>
      )}

      <button
        onClick={() => setIsEditing((prev) => !prev)}
        className={`absolute top-3 right-3 ${isEditing ? 'bg-gray-500 hover:bg-gray-600' : 'bg-blue-600 hover:bg-blue-700'} px-2 py-1 rounded-full text-white`}
      >
        {isEditing ? 'Cancel' : 'Edit'}
      </button>
    </motion.div>
  );
}
