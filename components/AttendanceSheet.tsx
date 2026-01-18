import React, { useState, useEffect } from 'react';
import { Student, AttendanceRecord, AttendanceStatus } from '../types';
import { dataService } from '../services/dataService';
import { Check, X, Clock, Save } from 'lucide-react';

interface AttendanceSheetProps {
  students: Student[];
  teacherId: string;
}

export const AttendanceSheet: React.FC<AttendanceSheetProps> = ({ students }) => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [records, setRecords] = useState<Record<string, AttendanceStatus>>({});
  const [remarks, setRemarks] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  // Load existing attendance when date changes
  useEffect(() => {
    const existing = dataService.getAttendance(date, students.map(s => s.id));
    const newRecords: Record<string, AttendanceStatus> = {};
    const newRemarks: Record<string, string> = {};

    students.forEach(s => {
      const record = existing.find(r => r.studentId === s.id);
      newRecords[s.id] = record ? record.status : AttendanceStatus.PRESENT; // Default to Present
      newRemarks[s.id] = record?.remarks || '';
    });

    setRecords(newRecords);
    setRemarks(newRemarks);
    setSaved(false);
  }, [date, students]);

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setRecords(prev => ({ ...prev, [studentId]: status }));
    setSaved(false);
  };

  const handleRemarkChange = (studentId: string, text: string) => {
    setRemarks(prev => ({ ...prev, [studentId]: text }));
    setSaved(false);
  };

  const handleSubmit = () => {
    setLoading(true);
    const toSave: AttendanceRecord[] = students.map(s => ({
      id: `${date}_${s.id}`,
      studentId: s.id,
      date,
      status: records[s.id],
      remarks: remarks[s.id]
    }));

    // Simulate network delay
    setTimeout(() => {
      dataService.saveAttendance(toSave);
      setLoading(false);
      setSaved(true);
    }, 600);
  };

  const getStats = () => {
    const values = Object.values(records);
    return {
      present: values.filter(v => v === AttendanceStatus.PRESENT).length,
      absent: values.filter(v => v === AttendanceStatus.ABSENT).length,
      leave: values.filter(v => v === AttendanceStatus.LEAVE).length,
    };
  };

  const stats = getStats();

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Date</label>
            <input 
              type="date" 
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 outline-none"
            />
          </div>
          <div className="h-10 w-px bg-gray-200 hidden md:block"></div>
          <div className="flex gap-4 text-sm">
             <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> P: {stats.present}</div>
             <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-red-500"></span> A: {stats.absent}</div>
             <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-amber-500"></span> L: {stats.leave}</div>
          </div>
        </div>
        
        <button 
          onClick={handleSubmit}
          disabled={loading || saved}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all ${
            saved 
            ? 'bg-green-100 text-green-700 cursor-default'
            : 'bg-primary-600 hover:bg-primary-700 text-white shadow-lg shadow-primary-500/30'
          }`}
        >
          {loading ? 'Saving...' : saved ? 'Saved Successfully' : <><Save className="w-4 h-4" /> Save Attendance</>}
        </button>
      </div>

      {/* List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Roll No</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Student Name</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {students.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-mono text-gray-600">{student.rollNo}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xs font-bold">
                        {student.name.charAt(0)}
                      </div>
                      <span className="text-sm font-medium text-gray-900">{student.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">
                        {[
                            { val: AttendanceStatus.PRESENT, label: 'P', color: 'emerald', icon: Check },
                            { val: AttendanceStatus.ABSENT, label: 'A', color: 'red', icon: X },
                            { val: AttendanceStatus.LEAVE, label: 'L', color: 'amber', icon: Clock },
                        ].map((opt) => (
                            <button
                                key={opt.val}
                                onClick={() => handleStatusChange(student.id, opt.val)}
                                className={`
                                    w-10 h-10 rounded-lg flex items-center justify-center transition-all border
                                    ${records[student.id] === opt.val 
                                        ? `bg-${opt.color}-500 text-white border-${opt.color}-600 shadow-md` 
                                        : `bg-white text-gray-400 border-gray-200 hover:border-${opt.color}-300 hover:text-${opt.color}-500`
                                    }
                                `}
                                title={opt.val}
                            >
                                <opt.icon className="w-5 h-5" />
                            </button>
                        ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <input 
                      type="text" 
                      placeholder="Optional remark..."
                      value={remarks[student.id]}
                      onChange={(e) => handleRemarkChange(student.id, e.target.value)}
                      className="w-full text-sm bg-transparent border-b border-gray-200 focus:border-primary-500 outline-none pb-1 transition-colors"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};