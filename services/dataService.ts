import { AttendanceRecord, AttendanceStatus, Role, Student, User } from '../types';
import { INITIAL_ATTENDANCE, STUDENTS, USERS } from '../constants';

// Simulating a backend service with local state
class DataService {
  private attendance: AttendanceRecord[] = [...INITIAL_ATTENDANCE];

  // --- Auth Simulation ---
  login(username: string): User | undefined {
    return USERS.find(u => u.username === username);
  }

  // --- Student Operations ---
  getStudentsByTeacher(teacherId: string): Student[] {
    return STUDENTS.filter(s => s.teacherId === teacherId);
  }

  getAllStudents(): Student[] {
    return STUDENTS;
  }

  // --- Attendance Operations ---
  getAttendance(date: string, studentIds: string[]): AttendanceRecord[] {
    return this.attendance.filter(r => r.date === date && studentIds.includes(r.studentId));
  }

  saveAttendance(records: AttendanceRecord[]) {
    // Upsert logic: Remove existing for same date/student, add new
    records.forEach(newRecord => {
      this.attendance = this.attendance.filter(
        r => !(r.date === newRecord.date && r.studentId === newRecord.studentId)
      );
      this.attendance.push(newRecord);
    });
  }

  getStudentAttendanceHistory(studentId: string): AttendanceRecord[] {
    return this.attendance.filter(r => r.studentId === studentId).sort((a, b) => b.date.localeCompare(a.date));
  }

  // --- Analytics ---
  getSystemStats() {
    const totalStudents = STUDENTS.length;
    const totalTeachers = USERS.filter(u => u.role === Role.TEACHER).length;
    
    // Calculate Today's attendance percentage
    const today = new Date().toISOString().split('T')[0];
    const todaysRecords = this.attendance.filter(r => r.date === today);
    const presentCount = todaysRecords.filter(r => r.status === AttendanceStatus.PRESENT).length;
    const todayPercentage = totalStudents > 0 ? Math.round((presentCount / totalStudents) * 100) : 0;

    return { totalStudents, totalTeachers, todayPercentage };
  }

  getWeeklyData() {
    const data = [];
    for(let i=6; i>=0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        const records = this.attendance.filter(r => r.date === dateStr);
        
        data.push({
            name: dateStr.slice(5), // MM-DD
            Present: records.filter(r => r.status === AttendanceStatus.PRESENT).length,
            Absent: records.filter(r => r.status === AttendanceStatus.ABSENT).length,
            Leave: records.filter(r => r.status === AttendanceStatus.LEAVE).length,
        });
    }
    return data;
  }
}

export const dataService = new DataService();