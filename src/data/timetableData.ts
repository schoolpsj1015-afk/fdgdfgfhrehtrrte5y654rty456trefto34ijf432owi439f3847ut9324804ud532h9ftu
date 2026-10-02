import { TimetableRecord } from '../types';

export const SCHOOL_INFO = {
  name: '대진전자통신고등학교',
  officeCode: 'C10',
  officeName: '부산광역시교육청',
  schoolCode: '7150597',
  address: '부산광역시 금정구 장전로 62',
  departments: [
    '전기전자과',
    'AI소프트웨어과',
    '컴퓨터소프트웨어과',
    '스마트콘텐츠과',
    '산업디자인과'
  ]
};

// Storage key for user's personal NEIS API Key
export const NEIS_KEY_STORAGE = 'daejin_neis_api_key_v1';

export function getStoredNeisApiKey(): string {
  return localStorage.getItem(NEIS_KEY_STORAGE) || '';
}

export function saveStoredNeisApiKey(key: string): void {
  localStorage.setItem(NEIS_KEY_STORAGE, key.trim());
}

// Grade/Class to Department mapping
export function getDepartmentForClass(grade: number, classNum: number): string {
  if (grade === 1) {
    if (classNum >= 1 && classNum <= 3) return '전기전자과';
    if (classNum >= 4 && classNum <= 5) return 'AI소프트웨어과';
    if (classNum >= 6 && classNum <= 8) return '스마트콘텐츠과';
    if (classNum >= 9 && classNum <= 10) return '산업디자인과';
  } else {
    if (classNum >= 1 && classNum <= 3) return '전기전자과';
    if (classNum >= 4 && classNum <= 5) return '컴퓨터소프트웨어과';
    if (classNum >= 6 && classNum <= 8) return '스마트콘텐츠과';
    if (classNum >= 9 && classNum <= 10) return '산업디자인과';
  }
  return '전기전자과';
}

// Period time table (교시별 시간표)
export const PERIOD_TIMES = [
  { period: 1, start: '08:50', end: '09:40', name: '1교시' },
  { period: 2, start: '09:50', end: '10:40', name: '2교시' },
  { period: 3, start: '10:50', end: '11:40', name: '3교시' },
  { period: 4, start: '11:50', end: '12:40', name: '4교시' },
  { period: 5, start: '13:40', end: '14:30', name: '5교시' },
  { period: 6, start: '14:40', end: '15:30', name: '6교시' },
  { period: 7, start: '15:40', end: '16:30', name: '7교시' },
];

// Calculate Academic Year (AY) & Semester (SEM) dynamically for ANY date (2025, 2026, 2027, etc.)
export function calculateAcademicYearAndSemester(dateObj: Date): { ay: string; sem: string } {
  const year = dateObj.getFullYear();
  const month = dateObj.getMonth() + 1; // 1 ~ 12

  let ay: number;
  let sem: string;

  // In Korea, Academic Year starts March 1st and ends February 28/29 of following calendar year
  if (month >= 3) {
    ay = year;
    sem = month >= 3 && month <= 8 ? '1' : '2';
  } else {
    // January & February belong to previous year's 2nd semester
    ay = year - 1;
    sem = '2';
  }

  return { ay: String(ay), sem };
}

// Convert YYYYMMDD to Day of Week (0:Sun, 1:Mon, ..., 6:Sat)
export function getDayOfWeekFromYYYYMMDD(dateStr: string): number {
  const formatted = dateStr.replace(/-/g, '');
  if (formatted.length !== 8) return 1;
  const year = parseInt(formatted.substring(0, 4), 10);
  const month = parseInt(formatted.substring(4, 6), 10) - 1;
  const day = parseInt(formatted.substring(6, 8), 10);
  const d = new Date(year, month, day);
  return d.getDay();
}

// Live NEIS API Response Cache
const NEIS_LIVE_CACHE: Record<string, TimetableRecord[]> = {};

/**
 * Real-time NEIS Open API Fetcher (2026, 2027, and any future year)
 * Throws error if there is a network error or response error
 */
export async function fetchNeisTimetableLive(
  grade: number,
  classNum: number,
  dateStr: string // YYYY-MM-DD
): Promise<TimetableRecord[] | null> {
  const formattedDate = dateStr.replace(/-/g, '');
  const cacheKey = `${formattedDate}_g${grade}_c${classNum}`;

  if (NEIS_LIVE_CACHE[cacheKey]) {
    return NEIS_LIVE_CACHE[cacheKey];
  }

  const dateObj = new Date(
    parseInt(formattedDate.substring(0, 4), 10),
    parseInt(formattedDate.substring(4, 6), 10) - 1,
    parseInt(formattedDate.substring(6, 8), 10)
  );

  const { ay, sem } = calculateAcademicYearAndSemester(dateObj);
  const userKey = getStoredNeisApiKey();
  const keyParam = userKey ? `&KEY=${encodeURIComponent(userKey)}` : '';

  // Open NEIS endpoint for High School Timetable
  const url = `https://open.neis.go.kr/hub/hisTimetable?Type=json&pIndex=1&pSize=100&ATPT_OFCDC_SC_CODE=${SCHOOL_INFO.officeCode}&SD_SCHUL_CODE=${SCHOOL_INFO.schoolCode}&ALL_TI_YMD=${formattedDate}&GRADE=${grade}&CLASS_NM=${classNum}&AY=${ay}&SEM=${sem}${keyParam}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();

    if (data.RESULT && data.RESULT.CODE && data.RESULT.CODE.startsWith('INFO-')) {
      // No data exists, return empty array representing no classes
      const emptyList: TimetableRecord[] = [];
      NEIS_LIVE_CACHE[cacheKey] = emptyList;
      return emptyList;
    }

    if (data.hisTimetable && data.hisTimetable[1] && data.hisTimetable[1].row) {
      const rows = data.hisTimetable[1].row;
      const department = getDepartmentForClass(grade, classNum);
      const dayOfWeek = getDayOfWeekFromYYYYMMDD(formattedDate);

      const parsed: TimetableRecord[] = rows.map((r: any, idx: number) => ({
        id: `live-neis-${formattedDate}-${grade}-${classNum}-${r.PERIO || idx + 1}`,
        officeCode: r.ATPT_OFCDC_SC_CODE || SCHOOL_INFO.officeCode,
        officeName: r.ATPT_OFCDC_SC_NM || SCHOOL_INFO.officeName,
        schoolCode: r.SD_SCHUL_CODE || SCHOOL_INFO.schoolCode,
        schoolName: r.SCHUL_NM || SCHOOL_INFO.name,
        year: r.AY || ay,
        semester: r.SEM || sem,
        date: formattedDate,
        dayOfWeek,
        grade,
        classNum,
        department: r.DDDEP_NM || department,
        period: parseInt(r.PERIO, 10) || idx + 1,
        subject: r.ITRT_CNTNT || '수업 없음'
      }));

      NEIS_LIVE_CACHE[cacheKey] = parsed;
      return parsed;
    }

    // Other errors
    if (data.RESULT && data.RESULT.MESSAGE) {
      throw new Error(data.RESULT.MESSAGE);
    }
  } catch (err) {
    console.warn('Real-time NEIS API fetch error:', err);
    throw err; // Propagate error so UI can display temporary error alert
  }

  return null;
}

// Preset weekly subjects generator per department for 2026/2027 fallback
export function getWeeklyTemplateForClass(grade: number, classNum: number): Record<number, string[]> {
  const department = getDepartmentForClass(grade, classNum);
  
  if (department === 'AI소프트웨어과') {
    return {
      1: ['컴퓨터 구조', '인공지능 일반', '공통수학1', '체육1', '통합사회1', '공통영어1', '정보 처리와 관리'],
      2: ['인공지능 일반', '인공지능 일반', '공통영어1', '미술', '공통수학1', '음악', '자율활동'],
      3: ['인공지능 일반', '진로활동', '공통수학1', '공통영어1', '인공지능 일반', '인공지능 일반', '인공지능 일반'],
      4: ['체육1', '정보 처리와 관리', '정보 처리와 관리', '통합사회1', '컴퓨터 구조', '컴퓨터 구조', '자율활동'],
      5: ['미술', '통합사회1', '정보 처리와 관리', '정보 처리와 관리', '동아리활동', '동아리활동', '자율·자치활동']
    };
  } else if (department === '컴퓨터소프트웨어과') {
    return {
      1: ['* SQL활용', '* SQL활용', '영어Ⅰ', '환경', '* 개발자 환경 구축', '* 개발자 환경 구축', '디지털 논리 회로'],
      2: ['* 애플리케이션 배포', '* 애플리케이션 배포', '디지털 논리 회로', '디지털 논리 회로', '* 애플리케이션 테스트 수행', '스포츠 생활', '환경'],
      3: ['독서', '수학Ⅰ', '자료 구조', '자료 구조', '실용 영어', '체육 탐구', '생활과 과학'],
      4: ['* 프로그래밍 언어 활용', '* 프로그래밍 언어 활용', '독서', '일본어Ⅰ', '* 화면 구현', '* 화면 구현', '진로활동'],
      5: ['한국사', '* 프로그래밍 언어 활용', '* 프로그래밍 언어 활용', '체육 탐구', '동아리활동', '동아리활동', '자율활동']
    };
  } else if (department === '스마트콘텐츠과') {
    return {
      1: ['진로활동', '공통국어1', '미술', '공통영어1', '영상 제작 기초', '체육1', '통합사회1'],
      2: ['체육1', '프로그래밍', '프로그래밍', '공통국어1', '정보 처리와 관리', '정보 처리와 관리', '통합사회1'],
      3: ['통합사회1', '공통영어1', '영상 제작 기초', '영상 제작 기초', '공통국어1', '프로그래밍', '프로그래밍'],
      4: ['음악', '공통국어1', '정보 처리와 관리', '정보 처리와 관리', '영상 제작 기초', '컴퓨터 그래픽', '통합사회1'],
      5: ['* 3D 애니메이팅', '* 3D 애니메이팅', '수학Ⅱ', '한국사', '동아리활동', '동아리활동', '자율활동']
    };
  } else if (department === '산업디자인과') {
    return {
      1: ['애니메이션 기초', '통합사회1', '체육1', '컴퓨터 그래픽', '공통국어1', '애니메이션 기초', '애니메이션 기초'],
      2: ['통합사회1', '진로활동', '공통국어1', '공통영어1', '디자인 일반', '디자인 일반', '미술'],
      3: ['컴퓨터 그래픽', '컴퓨터 그래픽', '공통영어1', '체육1', '음악', '통합사회1', '애니메이션 기초'],
      4: ['음악', '통합사회1', '공통영어1', '공통국어1', '디자인 일반', '디자인 일반', '자율활동'],
      5: ['공통국어1', '공통영어1', '컴퓨터 그래픽', '컴퓨터 그래픽', '동아리활동', '동아리활동', '자율활동']
    };
  } else {
    // 전기전자과 (Default)
    return {
      1: ['공통영어1', '* 하드웨어 회로 설계', '* 하드웨어 부품 선정', '* 하드웨어 부품 선정', '통합사회1', '* 하드웨어 완성품 검증', '* 하드웨어 완성품 검증'],
      2: ['공통수학1', '체육1', '공통영어1', '통합사회1', '* 하드웨어 회로 설계', '* 하드웨어 회로 설계', '미술'],
      3: ['* 하드웨어 부품 선정', '공통수학1', '* 하드웨어 성능 구현', '* 하드웨어 성능 구현', '* 하드웨어 회로 설계', '공통영어1', '체육1'],
      4: ['공통영어1', '공통수학1', '통합사회1', '미술', '* 하드웨어 성능 구현', '* 하드웨어 성능 구현', '진로활동'],
      5: ['* 하드웨어 성능 구현', '* 하드웨어 성능 구현', '진로활동', '음악', '동아리활동', '동아리활동', '자율활동']
    };
  }
}

// Synchronous template/static timetable getter (bypassing live cache)
export function getStaticTimetableForDate(
  grade: number,
  classNum: number,
  dateStr: string // YYYY-MM-DD
): TimetableRecord[] {
  const formattedDate = dateStr.replace(/-/g, '');
  const dayOfWeek = getDayOfWeekFromYYYYMMDD(formattedDate);
  const department = getDepartmentForClass(grade, classNum);

  const dateObj = new Date(
    parseInt(formattedDate.substring(0, 4), 10),
    parseInt(formattedDate.substring(4, 6), 10) - 1,
    parseInt(formattedDate.substring(6, 8), 10)
  );
  const { ay, sem } = calculateAcademicYearAndSemester(dateObj);

  // Weekend check
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return [1, 2, 3, 4].map((p) => ({
      id: `weekend-${formattedDate}-${grade}-${classNum}-${p}`,
      officeCode: SCHOOL_INFO.officeCode,
      officeName: SCHOOL_INFO.officeName,
      schoolCode: SCHOOL_INFO.schoolCode,
      schoolName: SCHOOL_INFO.name,
      year: ay,
      semester: sem,
      date: formattedDate,
      dayOfWeek,
      grade,
      classNum,
      department,
      period: p,
      subject: dayOfWeek === 6 ? '토요휴업일' : '일요일'
    }));
  }

  // Use weekly template by department & weekday
  const weeklyTemplate = getWeeklyTemplateForClass(grade, classNum);
  const daySubjects = weeklyTemplate[dayOfWeek] || [
    '공통국어1', '공통수학1', '공통영어1', '통합사회1', '체육1', '전공실습', '동아리활동'
  ];

  return daySubjects.map((subject, idx) => ({
    id: `static-template-${formattedDate}-${grade}-${classNum}-${idx + 1}`,
    officeCode: SCHOOL_INFO.officeCode,
    officeName: SCHOOL_INFO.officeName,
    schoolCode: SCHOOL_INFO.schoolCode,
    schoolName: SCHOOL_INFO.name,
    year: ay,
    semester: sem,
    date: formattedDate,
    dayOfWeek,
    grade,
    classNum,
    department,
    period: idx + 1,
    subject
  }));
}

// Synchronous timetable getter for fallback or initial rendering
export function getTimetableForDate(
  grade: number,
  classNum: number,
  dateStr: string // YYYY-MM-DD
): TimetableRecord[] {
  const formattedDate = dateStr.replace(/-/g, '');
  
  // Check cache first
  const cacheKey = `${formattedDate}_g${grade}_c${classNum}`;
  if (NEIS_LIVE_CACHE[cacheKey]) {
    return NEIS_LIVE_CACHE[cacheKey];
  }

  return getStaticTimetableForDate(grade, classNum, dateStr);
}
