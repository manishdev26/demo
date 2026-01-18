import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  CalendarCheck, 
  BarChart3, 
  Settings, 
  LogOut, 
  Menu,
  X,
  GraduationCap
} from 'lucide-react';
import { User, Role } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  user: User;
  onLogout: () => void;
  currentPage: string;
  onNavigate: (page: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, user, onLogout, currentPage, onNavigate }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: [Role.ADMIN, Role.TEACHER, Role.STUDENT] },
    { id: 'attendance', label: 'Attendance', icon: CalendarCheck, roles: [Role.ADMIN, Role.TEACHER] },
    { id: 'students', label: 'Students', icon: Users, roles: [Role.ADMIN, Role.TEACHER] },
    { id: 'reports', label: 'Reports', icon: BarChart3, roles: [Role.ADMIN, Role.TEACHER, Role.STUDENT] },
  ];

  const filteredNav = navItems.filter(item => item.roles.includes(user.role));

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile Sidebar Backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="h-16 flex items-center px-6 border-b border-slate-800">
            <GraduationCap className="h-8 w-8 text-primary-500 mr-3" />
            <div>
              <h1 className="font-bold text-lg tracking-wide">EduMatrix</h1>
              <p className="text-xs text-slate-400">Enterprise ERP</p>
            </div>
            <button 
              className="ml-auto lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* User Info (Mini) */}
          <div className="p-4 border-b border-slate-800">
            <div className="flex items-center space-x-3">
              <img 
                src={user.avatar} 
                alt="User" 
                className="h-10 w-10 rounded-full border-2 border-primary-600"
              />
              <div className="overflow-hidden">
                <p className="text-sm font-semibold truncate">{user.fullName}</p>
                <p className="text-xs text-slate-400 uppercase tracking-wider">{user.role}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1 px-3">
              {filteredNav.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => {
                        onNavigate(item.id);
                        setIsSidebarOpen(false);
                    }}
                    className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                      currentPage === item.id 
                        ? 'bg-primary-600 text-white shadow-lg shadow-primary-900/50' 
                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    <span className="font-medium text-sm">{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Footer Actions */}
          <div className="p-4 border-t border-slate-800">
            <button 
              onClick={onLogout}
              className="flex items-center w-full px-4 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <LogOut className="h-5 w-5 mr-3" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-8 shadow-sm z-10">
          <button 
            className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-md"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>

          <div className="hidden md:block">
            <h2 className="text-lg font-semibold text-gray-800 capitalize">
                {currentPage} Overview
            </h2>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden md:flex flex-col items-end mr-4">
                <span className="text-xs text-gray-500 font-medium">Academic Session</span>
                <span className="text-sm font-bold text-gray-800">2023-2024</span>
            </div>
            <button className="p-2 text-gray-400 hover:text-primary-600 hover:bg-gray-50 rounded-full transition-colors">
              <Settings className="h-5 w-5" />
            </button>
          </div>
        </header>

        {/* Page Content Scrollable Area */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
            {children}
        </main>
      </div>
    </div>
  );
};