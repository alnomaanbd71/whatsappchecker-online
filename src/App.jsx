import { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

function App() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');

  const handleUpload = async () => {
    const form = new FormData();
    form.append('file', file);
    setStatus('Processing…');
    const res = await axios.post('/api/check', form, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    setDownloadUrl(res.data.download_url);
    setStatus('Done!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-indigo-500 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl text-white mb-6">WhatsApp Number Checker</h1>

      <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md">
        <input
          type="file"
          accept=".csv"
          onChange={e => setFile(e.target.files[0])}
          className="mb-4"
        />

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold"
          onClick={handleUpload}
          disabled={!file}
        >
          { status || 'Upload & Check' }
        </motion.button>

        {downloadUrl && (
          <a
            href={downloadUrl}
            className="block mt-4 text-center text-purple-700 underline"
          >
            Download Results
          </a>
        )}
      </div>
    </div>
  );
}

export default App;