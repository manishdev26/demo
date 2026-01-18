import { Role, User, Student, AttendanceRecord, AttendanceStatus } from './types';

// Mock Users
export const USERS: User[] = [
  {
    id: 'u1',
    username: 'admin',
    fullName: 'James Anderson',
    role: Role.ADMIN,
    email: 'admin@edumatrix.com',
    avatar: 'https://picsum.photos/200/200?random=1'
  },
  {
    id: 'u2',
    username: 'teacher',
    fullName: 'Sarah Jenkins',
    role: Role.TEACHER,
    email: 'sarah.j@edumatrix.com',
    avatar: 'https://picsum.photos/200/200?random=2'
  },
  {
    id: 'u3',
    username: 'student',
    fullName: 'Michael Key',
    role: Role.STUDENT,
    email: 'michael.k@edumatrix.com',
    avatar: 'https://picsum.photos/200/200?random=3'
  }
];

// Mock Students (Linked to Teacher u2)
export const STUDENTS: Student[] = [
  { id: 's1', name: 'Aarav Patel', rollNo: '101', class: '10', section: 'A', teacherId: 'u2' },
  { id: 's2', name: 'Aditi Sharma', rollNo: '102', class: '10', section: 'A', teacherId: 'u2' },
  { id: 's3', name: 'Benjamin Hayes', rollNo: '103', class: '10', section: 'A', teacherId: 'u2' },
  { id: 's4', name: 'Chloe Kim', rollNo: '104', class: '10', section: 'A', teacherId: 'u2' },
  { id: 's5', name: 'David Loop', rollNo: '105', class: '10', section: 'A', teacherId: 'u2' },
  { id: 's6', name: 'Emily Chen', rollNo: '106', class: '10', section: 'A', teacherId: 'u2' },
  { id: 's7', name: 'Frank Wright', rollNo: '107', class: '10', section: 'A', teacherId: 'u2' },
  { id: 's8', name: 'Grace Ho', rollNo: '108', class: '10', section: 'A', teacherId: 'u2' },
];

// Generate some random historical attendance data
const generateMockAttendance = (): AttendanceRecord[] => {
  const records: AttendanceRecord[] = [];
  const today = new Date();
  
  // Last 7 days for all students
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    STUDENTS.forEach(student => {
      // Random status weighted towards Present
      const rand = Math.random();
      let status = AttendanceStatus.PRESENT;
      if (rand > 0.9) status = AttendanceStatus.ABSENT;
      else if (rand > 0.95) status = AttendanceStatus.LEAVE;

      records.push({
        id: `att_${dateStr}_${student.id}`,
        studentId: student.id,
        date: dateStr,
        status: status,
        remarks: status === AttendanceStatus.LEAVE ? 'Sick Leave' : ''
      });
    });
  }
  return records;
};

export const INITIAL_ATTENDANCE: AttendanceRecord[] = generateMockAttendance();