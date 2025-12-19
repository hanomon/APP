import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';

function Employees() {
  const { data: employees, isLoading } = useQuery({
    queryKey: ['employees'],
    queryFn: async () => {
      const response = await api.get('/users');
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">직원 관리</h2>
        <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
          + 직원 추가
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">이름</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">사원번호</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">이메일</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">부서</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">직급</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">전화번호</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">상태</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">액션</th>
              </tr>
            </thead>
            <tbody>
              {employees?.map((employee: any) => (
                <tr key={employee.id} className="border-t hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold mr-3">
                        {employee.name[0]}
                      </div>
                      <span className="font-medium">{employee.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">{employee.employeeNumber}</td>
                  <td className="py-4 px-6">{employee.email}</td>
                  <td className="py-4 px-6">{employee.department || '-'}</td>
                  <td className="py-4 px-6">{employee.position || '-'}</td>
                  <td className="py-4 px-6">{employee.phoneNumber || '-'}</td>
                  <td className="py-4 px-6">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        employee.isActive
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {employee.isActive ? '활성' : '비활성'}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex space-x-2">
                      <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors text-sm font-medium">
                        수정
                      </button>
                      <button className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors text-sm font-medium">
                        삭제
                      </button>
                    </div>
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

export default Employees;

