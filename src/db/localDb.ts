import { HomeworkItem, AfterSchoolItem, FavoriteSubject, UserClassSelection } from '../types';

const STORAGE_KEYS = {
  HOMEWORK: 'daejin_app_homework_v1',
  AFTER_SCHOOL: 'daejin_app_after_school_v1',
  FAVORITES: 'daejin_app_favorite_subjects_v1',
  USER_CLASS: 'daejin_app_user_class_v1',
};

// Initial default favorite subjects for Daejin High
const DEFAULT_FAVORITE_SUBJECTS: FavoriteSubject[] = [
  { name: '프로그래밍', color: '#3b82f6', addedAt: new Date().toISOString() },
  { name: '인공지능 일반', color: '#8b5cf6', addedAt: new Date().toISOString() },
  { name: '컴퓨터 그래픽', color: '#ec4899', addedAt: new Date().toISOString() },
  { name: '* 하드웨어 회로 설계', color: '#10b981', addedAt: new Date().toISOString() },
  { name: '* SQL활용', color: '#f59e0b', addedAt: new Date().toISOString() },
];

// Initial seed homework items
const DEFAULT_HOMEWORKS: HomeworkItem[] = [
  {
    id: 'hw-1',
    title: 'C++ 클래스 설계 과제 제출',
    subject: '프로그래밍',
    grade: 1,
    classNum: 8,
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0], // 2 days later
    dueTime: '23:59',
    priority: 'high',
    completed: false,
    notes: '객체지향 상속 및 다형성 개념 적용한 헤더파일 작성',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'hw-2',
    title: '포토샵 입체 그래픽 포트폴리오 제작',
    subject: '컴퓨터 그래픽',
    grade: 1,
    classNum: 10,
    dueDate: new Date(Date.now() + 86400000 * 4).toISOString().split('T')[0],
    dueTime: '17:00',
    priority: 'medium',
    completed: false,
    notes: '3D 질감 표현 및 패스파인더 레이어 정리 필수',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'hw-3',
    title: '전기기능사 PLC 브레드보드 회로도 해석',
    subject: '* 하드웨어 회로 설계',
    grade: 1,
    classNum: 1,
    dueDate: new Date(Date.now() - 86400000).toISOString().split('T')[0], // yesterday (overdue test)
    dueTime: '18:00',
    priority: 'high',
    completed: true,
    notes: '핀 배치도 정리 및 시뮬레이션 결과캡처',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'hw-4',
    title: '머신러닝 데이터셋 분류 알고리즘 요약',
    subject: '인공지능 일반',
    grade: 1,
    classNum: 4,
    dueDate: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0],
    dueTime: '22:00',
    priority: 'low',
    completed: false,
    notes: '지도학습 vs 비지도학습 비교 보고서 2페이지',
    createdAt: new Date().toISOString(),
  }
];

// Initial seed after-school programs
const DEFAULT_AFTER_SCHOOLS: AfterSchoolItem[] = [
  {
    id: 'as-1',
    name: '방과후 C++ 알고리즘 심화반',
    time: '16:30 ~ 18:00 (8~9교시)',
    homework: '백준 1200번 문제 풀이 작성해오기',
    daysOfWeek: [1, 3], // Mon, Wed
    grade: 1,
    classNum: 8,
    room: '3층 SW실습2실',
    instructor: '김알고 선생님',
    color: '#06b6d4',
  },
  {
    id: 'as-2',
    name: '전기기능사 실기 대비반',
    time: '16:40 ~ 18:10',
    homework: '시퀀스 제어 시뮬레이터 3회 연습',
    daysOfWeek: [2, 4], // Tue, Thu
    grade: 1,
    classNum: 1,
    room: '2층 전기회로실습실',
    instructor: '박전기 선생님',
    color: '#10b981',
  },
  {
    id: 'as-3',
    name: '3D 그래픽 Blender 마스터반',
    time: '16:30 ~ 17:30',
    homework: '기본 캐릭터 로우폴리곤 모델링 완성',
    daysOfWeek: [5], // Fri
    grade: 1,
    classNum: 10,
    room: '4층 디자인디지털실',
    instructor: '이디자인 선생님',
    color: '#f43f5e',
  }
];

// Default User Class Selection
const DEFAULT_USER_CLASS: UserClassSelection = {
  grade: 1,
  classNum: 8,
  department: '스마트콘텐츠과',
};

export class LocalDatabase {
  // Helper for localStorage with json parse
  private static getItem<T>(key: string, fallback: T): T {
    try {
      const data = localStorage.getItem(key);
      if (!data) return fallback;
      return JSON.parse(data) as T;
    } catch (e) {
      console.error(`Error reading ${key} from LocalStorage`, e);
      return fallback;
    }
  }

  private static setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(`Error writing ${key} to LocalStorage`, e);
    }
  }

  // --- USER CLASS SELECTION ---
  public static getUserClass(): UserClassSelection {
    return this.getItem<UserClassSelection>(STORAGE_KEYS.USER_CLASS, DEFAULT_USER_CLASS);
  }

  public static saveUserClass(selection: UserClassSelection): void {
    this.setItem(STORAGE_KEYS.USER_CLASS, selection);
  }

  // --- HOMEWORK DB ---
  public static getHomeworks(): HomeworkItem[] {
    return this.getItem<HomeworkItem[]>(STORAGE_KEYS.HOMEWORK, DEFAULT_HOMEWORKS);
  }

  public static addHomework(hw: Omit<HomeworkItem, 'id' | 'createdAt'>): HomeworkItem {
    const homeworks = this.getHomeworks();
    const newItem: HomeworkItem = {
      ...hw,
      id: 'hw-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
      createdAt: new Date().toISOString(),
    };
    homeworks.unshift(newItem);
    this.setItem(STORAGE_KEYS.HOMEWORK, homeworks);
    return newItem;
  }

  public static updateHomework(id: string, updates: Partial<HomeworkItem>): HomeworkItem | null {
    const homeworks = this.getHomeworks();
    const index = homeworks.findIndex((item) => item.id === id);
    if (index === -1) return null;
    homeworks[index] = { ...homeworks[index], ...updates };
    this.setItem(STORAGE_KEYS.HOMEWORK, homeworks);
    return homeworks[index];
  }

  public static toggleHomeworkComplete(id: string): HomeworkItem | null {
    const homeworks = this.getHomeworks();
    const index = homeworks.findIndex((item) => item.id === id);
    if (index === -1) return null;
    homeworks[index].completed = !homeworks[index].completed;
    this.setItem(STORAGE_KEYS.HOMEWORK, homeworks);
    return homeworks[index];
  }

  public static deleteHomework(id: string): void {
    const homeworks = this.getHomeworks().filter((item) => item.id !== id);
    this.setItem(STORAGE_KEYS.HOMEWORK, homeworks);
  }

  // --- FAVORITE SUBJECTS DB ---
  public static getFavoriteSubjects(): FavoriteSubject[] {
    return this.getItem<FavoriteSubject[]>(STORAGE_KEYS.FAVORITES, DEFAULT_FAVORITE_SUBJECTS);
  }

  public static isFavoriteSubject(subjectName: string): boolean {
    const normalized = subjectName.trim().replace(/^\*\s*/, '');
    const favorites = this.getFavoriteSubjects();
    return favorites.some(
      (f) => f.name.trim().replace(/^\*\s*/, '') === normalized
    );
  }

  public static toggleFavoriteSubject(subjectName: string): boolean {
    const favorites = this.getFavoriteSubjects();
    const cleanName = subjectName.trim();
    const normalized = cleanName.replace(/^\*\s*/, '');
    
    const existingIndex = favorites.findIndex(
      (f) => f.name.trim().replace(/^\*\s*/, '') === normalized
    );

    if (existingIndex !== -1) {
      // Remove
      favorites.splice(existingIndex, 1);
      this.setItem(STORAGE_KEYS.FAVORITES, favorites);
      return false;
    } else {
      // Add
      const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#06b6d4', '#84cc16'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      favorites.push({
        name: cleanName,
        color: randomColor,
        addedAt: new Date().toISOString(),
      });
      this.setItem(STORAGE_KEYS.FAVORITES, favorites);
      return true;
    }
  }

  // --- AFTER SCHOOL ACTIVITIES DB ---
  public static getAfterSchools(): AfterSchoolItem[] {
    return this.getItem<AfterSchoolItem[]>(STORAGE_KEYS.AFTER_SCHOOL, DEFAULT_AFTER_SCHOOLS);
  }

  public static addAfterSchool(item: Omit<AfterSchoolItem, 'id'>): AfterSchoolItem {
    const list = this.getAfterSchools();
    const newItem: AfterSchoolItem = {
      ...item,
      id: 'as-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
    };
    list.unshift(newItem);
    this.setItem(STORAGE_KEYS.AFTER_SCHOOL, list);

    // If there is an optional homework entered, automatically create a homework record as well!
    if (item.homework && item.homework.trim().length > 0) {
      this.addHomework({
        title: `[방과후] ${item.homework}`,
        subject: item.name,
        grade: item.grade || 1,
        classNum: item.classNum || 1,
        dueDate: item.specificDate || new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
        dueTime: '18:00',
        priority: 'medium',
        completed: false,
        notes: `방과후 수업: ${item.name} (${item.time})`,
      });
    }

    return newItem;
  }

  public static updateAfterSchool(id: string, updates: Partial<AfterSchoolItem>): AfterSchoolItem | null {
    const list = this.getAfterSchools();
    const index = list.findIndex((item) => item.id === id);
    if (index === -1) return null;
    list[index] = { ...list[index], ...updates };
    this.setItem(STORAGE_KEYS.AFTER_SCHOOL, list);
    return list[index];
  }

  public static deleteAfterSchool(id: string): void {
    const list = this.getAfterSchools().filter((item) => item.id !== id);
    this.setItem(STORAGE_KEYS.AFTER_SCHOOL, list);
  }

  // --- EXPORT & RESET DATA ---
  public static exportFullData(): string {
    const data = {
      userClass: this.getUserClass(),
      homeworks: this.getHomeworks(),
      afterSchools: this.getAfterSchools(),
      favorites: this.getFavoriteSubjects(),
      exportedAt: new Date().toISOString(),
    };
    return JSON.stringify(data, null, 2);
  }

  public static importFullData(jsonStr: string): boolean {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.homeworks) this.setItem(STORAGE_KEYS.HOMEWORK, parsed.homeworks);
      if (parsed.afterSchools) this.setItem(STORAGE_KEYS.AFTER_SCHOOL, parsed.afterSchools);
      if (parsed.favorites) this.setItem(STORAGE_KEYS.FAVORITES, parsed.favorites);
      if (parsed.userClass) this.setItem(STORAGE_KEYS.USER_CLASS, parsed.userClass);
      return true;
    } catch (e) {
      console.error('Import failed', e);
      return false;
    }
  }

  public static resetToDefault(): void {
    this.setItem(STORAGE_KEYS.HOMEWORK, DEFAULT_HOMEWORKS);
    this.setItem(STORAGE_KEYS.AFTER_SCHOOL, DEFAULT_AFTER_SCHOOLS);
    this.setItem(STORAGE_KEYS.FAVORITES, DEFAULT_FAVORITE_SUBJECTS);
    this.setItem(STORAGE_KEYS.USER_CLASS, DEFAULT_USER_CLASS);
  }
}
