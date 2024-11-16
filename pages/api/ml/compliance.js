// pages/api/ml/compliance.js
export default async function handler(req, res) {
    if (req.method === 'POST') {
      // Call ML model here and return response
      res.status(200).json({ message: 'Document compliance checked' });
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  }
  