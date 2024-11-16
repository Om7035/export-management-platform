import Navbar from '../components/Navbar';
import { useState, useEffect } from 'react';

export default function Documents() {
  const [documents, setDocuments] = useState([]);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  const [error, setError] = useState(null);

  // Toggle theme and persist in localStorage
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  // Handle document upload
  const handleUpload = async (event) => {
    setError(null); // Clear previous errors
    const file = event.target.files[0];

    if (!file) return;

    // Validate file type (example: only PDFs allowed)
    if (file.type !== 'application/pdf') {
      setError('Only PDF files are allowed.');
      return;
    }

    // Add the document with "Processing" status
    const newDocument = {
      name: file.name,
      status: 'Processing',
      timestamp: new Date().toLocaleString(),
    };
    setDocuments((prevDocs) => [...prevDocs, newDocument]);

    // Simulate compliance check (API call)
    try {
      const complianceResult = await mockComplianceCheck(file);
      setDocuments((prevDocs) =>
        prevDocs.map((doc) =>
          doc.name === file.name
            ? { ...doc, status: complianceResult.status, details: complianceResult.details }
            : doc
        )
      );
    } catch (err) {
      setError('Failed to process the document. Please try again.');
    }
  };

  // Simulated compliance check (mock API integration)
  const mockComplianceCheck = async (file) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock extracted text
        const extractedText = `Document: ${file.name}\nDate: ${new Date().toLocaleString()}\n...`;
        const rules = ['Has signature', 'Includes Invoice Number', 'Valid date'];

        // Mock validation logic
        const isCompliant = Math.random() > 0.4;
        const details = isCompliant
          ? 'All rules satisfied.'
          : `Missing: ${rules[Math.floor(Math.random() * rules.length)]}`;
        resolve({
          status: isCompliant ? 'Compliant' : 'Non-compliant',
          details,
        });
      }, 2000); // Simulating processing time
    });
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-500 ${
        theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'
      }`}
    >
      <Navbar />
      <main className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1
            className={`text-4xl font-extrabold tracking-wide ${
              theme === 'dark' ? 'text-white' : 'text-gray-800'
            }`}
          >
            Document Management
          </h1>
          <button
            onClick={toggleTheme}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 shadow-lg transition-transform transform hover:scale-105"
          >
            Toggle {theme === 'dark' ? 'Light' : 'Dark'} Mode
          </button>
        </div>

        {/* Upload Section */}
        <section
          className={`p-6 rounded-lg shadow-lg transition-all ${
            theme === 'dark' ? 'bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900' : 'bg-white'
          }`}
        >
          <h2
            className={`text-2xl font-semibold mb-4 ${
              theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
            }`}
          >
            Upload Documents
          </h2>
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <input
              type="file"
              onChange={handleUpload}
              className={`block w-full md:w-auto text-sm ${
                theme === 'dark'
                  ? 'bg-gray-700 text-white border-gray-600'
                  : 'bg-gray-50 text-gray-700 border-gray-300'
              } border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
          </div>
          {error && <p className="text-red-400 mt-4">{error}</p>}
        </section>

        {/* Document Table */}
        <section className="mt-8">
          <h2
            className={`text-2xl font-semibold mb-4 ${
              theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
            }`}
          >
            Uploaded Documents
          </h2>
          {documents.length > 0 ? (
            <table
              className={`min-w-full border rounded-lg shadow-lg ${
                theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              }`}
            >
              <thead
                className={`${
                  theme === 'dark' ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-700'
                }`}
              >
                <tr>
                  <th className="px-6 py-3 text-left font-medium">Document Name</th>
                  <th className="px-6 py-3 text-left font-medium">Compliance Status</th>
                  <th className="px-6 py-3 text-left font-medium">Details</th>
                  <th className="px-6 py-3 text-left font-medium">Timestamp</th>
                  <th className="px-6 py-3 text-left font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((doc, index) => (
                  <tr
                    key={index}
                    className={`border-b ${
                      theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                    } hover:bg-gray-100 transition-all`}
                  >
                    <td className={`px-6 py-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-800'}`}>{doc.name}</td>
                    <td className={`px-6 py-4 font-semibold ${
                      doc.status === 'Compliant'
                        ? 'text-green-500'
                        : doc.status === 'Processing'
                        ? 'text-yellow-500'
                        : 'text-red-500'
                    }`}>
                      {doc.status}
                    </td>
                    <td className={`px-6 py-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-800'}`}>
                      {doc.details || 'N/A'}
                    </td>
                    <td className={`px-6 py-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-800'}`}>{doc.timestamp}</td>
                    <td className="px-6 py-4">
                      <button
                        className="text-white hover:text-red-700 transition-all"
                        onClick={() => alert(`Downloading ${doc.name}...`)}
                      >
                        Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className={`text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              No documents uploaded yet.
            </p>
          )}
        </section>
      </main>
    </div>
  );
}
