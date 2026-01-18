import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { User, Role } from './types';
import { dataService } from './services/dataService';
import { 
  Users, 
  GraduationCap, 
  CalendarCheck2, 
  TrendingUp,
  UserCheck,
  AlertCircle
} from 'lucide-react';
import { KPICard } from './components/KPICard';
import { AttendanceSheet } from './components/AttendanceSheet';
import { 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    Legend, 
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [usernameInput, setUsernameInput] = useState('admin');
  const [error, setError] = useState('');
  const [page, setPage] = useState('dashboard');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const foundUser = dataService.login(usernameInput);
    if (foundUser) {
      setUser(foundUser);
      setPage('dashboard');
      setError('');
    } else {
      setError('Invalid username. Try: admin, teacher, or student');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setUsernameInput('');
  };

  // --- Dashboard Views ---

  const renderDashboard = () => {
    const stats = dataService.getSystemStats();
    
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <KPICard 
                title="Total Students" 
                value={stats.totalStudents} 
                icon={GraduationCap} 
                color="primary" 
                trend="+12% vs last term"
            />
            <KPICard 
                title="Total Teachers" 
                value={stats.totalTeachers} 
                icon={Users} 
                color="warning" 
            />
            <KPICard 
                title="Today's Attendance" 
                value={`${stats.todayPercentage}%`} 
                icon={UserCheck} 
                color="success" 
                trend="Above average"
            />
             <KPICard 
                title="Low Attendance Alerts" 
                value="3" 
                icon={AlertCircle} 
                color="danger" 
                trend="Action required"
            />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-96">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Weekly Attendance Trends</h3>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dataService.getWeeklyData()}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} />
                        <YAxis axisLine={false} tickLine={false} />
                        <Tooltip 
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Legend />
                        <Bar dataKey="Present" fill="#10b981" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="Absent" fill="#ef4444" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="Leave" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
            
             <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Distribution</h3>
                <div className="flex-1">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={[
                                    { name: 'Present', value: 85 },
                                    { name: 'Absent', value: 10 },
                                    { name: 'Leave', value: 5 },
                                ]}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                <Cell key="cell-0" fill="#10b981" />
                                <Cell key="cell-1" fill="#ef4444" />
                                <Cell key="cell-2" fill="#f59e0b" />
                            </Pie>
                            <Tooltip />
                            <Legend verticalAlign="bottom" height={36}/>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
      </div>
    );
  };

  const renderAttendance = () => {
    if (user?.role === Role.STUDENT) return <div className="p-4 bg-yellow-50 text-yellow-800 rounded">Access Restricted</div>;
    const students = dataService.getAllStudents(); // In real app, filter by teacher
    return <AttendanceSheet students={students} teacherId={user?.id || ''} />;
  };

  const renderContent = () => {
    switch(page) {
      case 'dashboard': return renderDashboard();
      case 'attendance': return renderAttendance();
      case 'students': return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold mb-4">Student Directory</h3>
            <p className="text-gray-500">Student management table would go here (CRUD operations).</p>
        </div>
      );
      case 'reports': return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold mb-4">Detailed Reports</h3>
            <p className="text-gray-500">Date-wise and Month-wise downloadable reports would go here.</p>
        </div>
      );
      default: return <div>Page not found</div>;
    }
  };

  // --- Login Screen ---
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-primary-600 p-8 text-center">
            <div className="mx-auto w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mb-4 backdrop-blur-sm">
                <GraduationCap className="text-white w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">EduMatrix ERP</h1>
            <p className="text-primary-100 text-sm">Secure Attendance Management</p>
          </div>
          
          <div className="p-8">
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Users className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    placeholder="Enter username"
                  />
                </div>
              </div>

              {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg flex items-center gap-2"><AlertCircle className="w-4 h-4"/> {error}</div>}

              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all"
              >
                Sign In
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-100">
                <p className="text-xs text-center text-gray-500 uppercase tracking-wider mb-3">Demo Credentials</p>
                <div className="flex justify-center gap-2 text-xs text-gray-600">
                    <span 
                        onClick={() => setUsernameInput('admin')} 
                        className="bg-gray-100 px-2 py-1 rounded cursor-pointer hover:bg-gray-200"
                    >
                        admin
                    </span>
                    <span 
                        onClick={() => setUsernameInput('teacher')} 
                        className="bg-gray-100 px-2 py-1 rounded cursor-pointer hover:bg-gray-200"
                    >
                        teacher
                    </span>
                    <span 
                        onClick={() => setUsernameInput('student')} 
                        className="bg-gray-100 px-2 py-1 rounded cursor-pointer hover:bg-gray-200"
                    >
                        student
                    </span>
                </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Layout 
        user={user} 
        onLogout={handleLogout} 
        currentPage={page} 
        onNavigate={setPage}
    >
      {renderContent()}
    </Layout>
  );
}

export default App;