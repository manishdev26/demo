export enum Role {
  ADMIN = 'ADMIN',
  TEACHER = 'TEACHER',
  STUDENT = 'STUDENT'
}

export enum AttendanceStatus {
  PRESENT = 'Present',
  ABSENT = 'Absent',
  LEAVE = 'Leave'
}

export interface User {
  id: string;
  username: string;
  fullName: string;
  role: Role;
  avatar: string;
  email: string;
}

export interface Student {
  id: string;
  name: string;
  rollNo: string;
  class: string;
  section: string;
  teacherId: string; // The teacher responsible
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
  remarks?: string;
}

export interface DailyStats {
  date: string;
  present: number;
  absent: number;
  leave: number;
}