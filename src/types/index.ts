export interface TimetableRecord {
  id: string;
  officeCode: string;
  officeName: string;
  schoolCode: string;
  schoolName: string;
  year: string;
  semester: string;
  date: string; // YYYYMMDD
  dayOfWeek: number; // 0: Sun, 1: Mon, ..., 6: Sat
  grade: number; // 1, 2, 3
  classNum: number; // 1 ~ 10
  department: string; // 전기전자과, AI소프트웨어과, 스마트콘텐츠과, 산업디자인과, 컴퓨터소프트웨어과
  period: number; // 1 ~ 7
  subject: string; // 수업내용
  isFavorite?: boolean;
}

export interface HomeworkItem {
  id: string;
  title: string;
  subject: string;
  grade: number;
  classNum: number;
  dueDate: string; // YYYY-MM-DD
  dueTime?: string; // HH:mm
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  notes?: string;
  createdAt: string;
}

export interface AfterSchoolItem {
  id: string;
  name: string; // 방과후명
  time: string; // 시간입력 (예: 16:30 ~ 17:30 또는 8~9교시)
  homework?: string; // 숙제입력 (선택)
  daysOfWeek: number[]; // 1: 월 ~ 5: 금
  specificDate?: string; // YYYY-MM-DD (특정 일자 선택시)
  grade?: number;
  classNum?: number;
  room?: string;
  instructor?: string;
  color?: string;
}

export interface FavoriteSubject {
  name: string;
  color: string;
  addedAt: string;
}

export interface UserClassSelection {
  grade: number;
  classNum: number;
  department: string;
}

export type CalendarViewMode = 'month' | 'week' | 'day';
