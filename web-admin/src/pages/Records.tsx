import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import { format } from 'date-fns';

function Records() {
  const [startDate, setStartDate] = useState(
    format(new Date(), 'yyyy-MM-dd')
  );
  const [endDate, setEndDate] = useState(
    format(new Date(), 'yyyy-MM-dd')
  );

  const { data: records, isLoading, refetch } = useQuery({
    queryKey: ['records', startDate, endDate],
    queryFn: async () => {
      const response = await api.get('/attendance/records', {
        params: {
          startDate: new Date(startDate).toISOString(),
          endDate: new Date(endDate + 'T23:59:59').toISOString(),
        },
      });
      return response.data;
    },
  });

  const handleSearch = () => {
    refetch();
  };

  const calculateWorkTime = (checkIn: string, checkOut?: string) => {
    if (!checkOut) return '-';
    const diff = new Date(checkOut).getTime() - new Date(checkIn).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}시간 ${minutes}분`;
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-8">근태 기록 조회</h2>

      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              시작일
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              종료일
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={handleSearch}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            🔍 조회
          </button>
          <button
            onClick={() => {
              const today = format(new Date(), 'yyyy-MM-dd');
              setStartDate(today);
              setEndDate(today);
            }}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
          >
            오늘
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">날짜</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">직원명</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">사원번호</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">부서</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">출근</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">퇴근</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">근무 시간</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">상태</th>
                </tr>
              </thead>
              <tbody>
                {records?.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-gray-500">
                      조회된 기록이 없습니다.
                    </td>
                  </tr>
                ) : (
                  records?.map((record: any) => (
                    <tr key={record.id} className="border-t hover:bg-gray-50">
                      <td className="py-4 px-6">
                        {format(new Date(record.checkInTime), 'yyyy-MM-dd')}
                      </td>
                      <td className="py-4 px-6 font-medium">{record.user.name}</td>
                      <td className="py-4 px-6">{record.user.employeeNumber}</td>
                      <td className="py-4 px-6">{record.user.department || '-'}</td>
                      <td className="py-4 px-6">
                        {format(new Date(record.checkInTime), 'HH:mm:ss')}
                      </td>
                      <td className="py-4 px-6">
                        {record.checkOutTime
                          ? format(new Date(record.checkOutTime), 'HH:mm:ss')
                          : '-'}
                      </td>
                      <td className="py-4 px-6">
                        {calculateWorkTime(record.checkInTime, record.checkOutTime)}
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            record.status === 'CHECKED_OUT'
                              ? 'bg-gray-100 text-gray-700'
                              : record.status === 'CHECKED_IN'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}
                        >
                          {record.status === 'CHECKED_OUT'
                            ? '퇴근 완료'
                            : record.status === 'CHECKED_IN'
                            ? '근무 중'
                            : record.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Records;

