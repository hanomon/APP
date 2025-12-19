import { useState } from 'react';
import QRScanner from './components/QRScanner';
import CheckInResult from './components/CheckInResult';
import './App.css';

interface AttendanceResult {
  success: boolean;
  message: string;
  record?: {
    user: {
      name: string;
      employeeNumber: string;
      department?: string;
    };
    checkInTime?: string;
    checkOutTime?: string;
  };
  distance?: number;
}

function App() {
  const [result, setResult] = useState<AttendanceResult | null>(null);
  const [mode, setMode] = useState<'checkIn' | 'checkOut'>('checkIn');

  const handleScanComplete = (scanResult: AttendanceResult) => {
    setResult(scanResult);
    setTimeout(() => setResult(null), 5000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            QR 출퇴근 태블릿
          </h1>
          <p className="text-gray-600 text-lg">
            QR 코드를 스캔하여 출퇴근을 처리하세요
          </p>
        </header>

        <div className="flex justify-center mb-6 gap-4">
          <button
            onClick={() => setMode('checkIn')}
            className={`px-8 py-3 rounded-lg font-bold text-lg transition-all ${
              mode === 'checkIn'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            🟢 출근
          </button>
          <button
            onClick={() => setMode('checkOut')}
            className={`px-8 py-3 rounded-lg font-bold text-lg transition-all ${
              mode === 'checkOut'
                ? 'bg-red-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            🔴 퇴근
          </button>
        </div>

        <div className="max-w-4xl mx-auto">
          <QRScanner mode={mode} onScanComplete={handleScanComplete} />
        </div>

        {result && <CheckInResult result={result} />}
      </div>
    </div>
  );
}

export default App;

