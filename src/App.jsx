import { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

function App() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('idle');
  const [downloadUrl, setDownloadUrl] = useState('');
  const [error, setError] = useState('');

  const handleUpload = async () => {
    if (!file) return;
    
    setStatus('processing');
    setError('');
    
    try {
      const form = new FormData();
      form.append('file', file);
      
      const res = await axios.post('/api/check', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 300000 // 5 minutes timeout
      });
      
      if (res.data.download_url) {
        setDownloadUrl(res.data.download_url);
        setStatus('success');
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      setStatus('error');
      setError(err.response?.data?.message || err.message || 'Failed to process file');
      setTimeout(() => setError(''), 5000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-indigo-500 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl text-white mb-6 font-bold text-center">
        WhatsApp Number Checker
      </h1>

      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload CSV File (with 'phone' column)
          </label>
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center px-4 py-6 bg-white text-purple-700 rounded-lg shadow tracking-wide uppercase border border-purple-700 cursor-pointer hover:bg-purple-50 hover:text-purple-900 transition-colors duration-200">
              <svg
                className="w-8 h-8"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
              </svg>
              <span className="mt-2 text-sm font-semibold">
                {file ? file.name : 'Select CSV file'}
              </span>
              <input
                type="file"
                accept=".csv"
                onChange={(e) => setFile(e.target.files[0])}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {error && (
          <div className="text-red-600 bg-red-100 px-4 py-2 rounded-md text-sm">
            ⚠️ {error}
          </div>
        )}

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleUpload}
          disabled={!file || status === 'processing'}
        >
          {status === 'processing' ? (
            <>
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Processing...
            </>
          ) : status === 'success' ? (
            '✅ Processed Successfully!'
          ) : (
            'Upload & Check Numbers'
          )}
        </motion.button>

        {downloadUrl && status === 'success' && (
          <a
            href={downloadUrl}
            download="whatsapp_results.xlsx"
            className="block py-3 text-center bg-green-100 text-green-800 rounded-lg font-medium hover:bg-green-200 transition-colors duration-200"
          >
            ⬇️ Download Results
          </a>
        )}
      </div>

      <footer className="mt-8 text-white text-opacity-80 text-sm text-center">
        <p>
          Made with ❤️ using React & Tailwind |{" "}
          <a
            href="https://github.com/yourusername/whatsappchecker-online"
            className="underline hover:text-opacity-100"
            target="_blank"
            rel="noopener noreferrer"
          >
            View Source
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;
