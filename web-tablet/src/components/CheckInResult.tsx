import { motion, AnimatePresence } from 'framer-motion';

interface CheckInResultProps {
  result: {
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
  };
}

function CheckInResult({ result }: CheckInResultProps) {
  const formatTime = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.8 }}
          className={`max-w-2xl w-full mx-4 p-8 rounded-2xl shadow-2xl ${
            result.success
              ? 'bg-gradient-to-br from-green-400 to-green-600'
              : 'bg-gradient-to-br from-red-400 to-red-600'
          }`}
        >
          <div className="text-center text-white">
            <div className="text-8xl mb-4">
              {result.success ? '✅' : '❌'}
            </div>
            
            {result.success && result.record ? (
              <>
                <h2 className="text-4xl font-bold mb-4">
                  {result.record.user.name}님
                </h2>
                <p className="text-2xl mb-6">
                  {result.record.checkOutTime ? '퇴근 처리되었습니다' : '출근 처리되었습니다'}
                </p>
                
                <div className="bg-white bg-opacity-20 rounded-lg p-6 mb-4">
                  <p className="text-xl mb-2">
                    사원번호: {result.record.user.employeeNumber}
                  </p>
                  {result.record.user.department && (
                    <p className="text-xl mb-2">
                      부서: {result.record.user.department}
                    </p>
                  )}
                  <p className="text-3xl font-bold mt-4">
                    ⏰ {formatTime(result.record.checkInTime || result.record.checkOutTime)}
                  </p>
                </div>

                {result.distance !== undefined && (
                  <p className="text-lg">
                    📍 거리: {result.distance}m
                  </p>
                )}
              </>
            ) : (
              <>
                <h2 className="text-4xl font-bold mb-4">처리 실패</h2>
                <p className="text-2xl mb-6">{result.message}</p>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default CheckInResult;

