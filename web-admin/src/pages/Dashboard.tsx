import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Stats {
  totalEmployees: number;
  presentToday: number;
  absentToday: number;
  currentlyPresent: number;
  checkedOut: number;
}

function Dashboard() {
  const { data: stats, isLoading } = useQuery<Stats>({
    queryKey: ['todayStats'],
    queryFn: async () => {
      const response = await api.get('/attendance/stats/today');
      return response.data;
    },
    refetchInterval: 30000, // 30초마다 갱신
  });

  const { data: recentRecords } = useQuery({
    queryKey: ['recentRecords'],
    queryFn: async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const response = await api.get('/attendance/records', {
        params: {
          startDate: today.toISOString(),
        },
      });
      return response.data.slice(0, 10);
    },
    refetchInterval: 10000,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const chartData = stats
    ? [
        { name: '총 직원', value: stats.totalEmployees, fill: '#3b82f6' },
        { name: '출근', value: stats.presentToday, fill: '#10b981' },
        { name: '근무 중', value: stats.currentlyPresent, fill: '#f59e0b' },
        { name: '퇴근', value: stats.checkedOut, fill: '#6b7280' },
        { name: '결근', value: stats.absentToday, fill: '#ef4444' },
      ]
    : [];

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-8">실시간 대시보드</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm mb-1">총 직원</p>
              <p className="text-4xl font-bold">{stats?.totalEmployees || 0}</p>
            </div>
            <div className="text-5xl opacity-50">👥</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm mb-1">오늘 출근</p>
              <p className="text-4xl font-bold">{stats?.presentToday || 0}</p>
            </div>
            <div className="text-5xl opacity-50">✅</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm mb-1">현재 근무 중</p>
              <p className="text-4xl font-bold">{stats?.currentlyPresent || 0}</p>
            </div>
            <div className="text-5xl opacity-50">💼</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm mb-1">결근</p>
              <p className="text-4xl font-bold">{stats?.absentToday || 0}</p>
            </div>
            <div className="text-5xl opacity-50">❌</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h3 className="text-xl font-bold text-gray-800 mb-4">오늘의 통계</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" name="인원" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">최근 출퇴근 기록</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">직원명</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">사원번호</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">부서</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">출근 시간</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">퇴근 시간</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">상태</th>
              </tr>
            </thead>
            <tbody>
              {recentRecords?.map((record: any) => (
                <tr key={record.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{record.user.name}</td>
                  <td className="py-3 px-4">{record.user.employeeNumber}</td>
                  <td className="py-3 px-4">{record.user.department || '-'}</td>
                  <td className="py-3 px-4">
                    {new Date(record.checkInTime).toLocaleTimeString('ko-KR')}
                  </td>
                  <td className="py-3 px-4">
                    {record.checkOutTime
                      ? new Date(record.checkOutTime).toLocaleTimeString('ko-KR')
                      : '-'}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        record.status === 'CHECKED_OUT'
                          ? 'bg-gray-100 text-gray-700'
                          : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {record.status === 'CHECKED_OUT' ? '퇴근' : '근무 중'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

