import React, { useState, useEffect } from 'react';
import { UserClassSelection, HomeworkItem, AfterSchoolItem, TimetableRecord } from '../types';
import {
  getTimetableForDate,
  getStaticTimetableForDate,
  fetchNeisTimetableLive,
  PERIOD_TIMES,
  SCHOOL_INFO
} from '../data/timetableData';
import {
  Star,
  Plus,
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  AlertCircle,
  Radio,
  RefreshCw,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

interface TimetableGridProps {
  selection: UserClassSelection;
  favoriteSubjects: string[];
  onToggleFavorite: (subject: string) => void;
  onQuickAddHomework: (subject: string, date: string) => void;
  homeworks: HomeworkItem[];
  afterSchools: AfterSchoolItem[];
}

export const TimetableGrid: React.FC<TimetableGridProps> = ({
  selection,
  favoriteSubjects,
  onToggleFavorite,
  onQuickAddHomework,
  homeworks,
  afterSchools,
}) => {
  // Default to today/current date - as requested
  const [currentDate, setCurrentDate] = useState<Date>(() => {
    const today = new Date();
    if (today.getDay() === 0) today.setDate(today.getDate() + 1);
    if (today.getDay() === 6) today.setDate(today.getDate() + 2);
    return today;
  });

  const [highlightFavoritesOnly, setHighlightFavoritesOnly] = useState(false);
  const [useLiveNeis, setUseLiveNeis] = useState(true);
  const [liveDataMap, setLiveDataMap] = useState<Record<string, TimetableRecord[]>>({});
  const [isLoadingNeis, setIsLoadingNeis] = useState(false);
  const [isFetchError, setIsFetchError] = useState(false);

  // Helper to get array of Dates for the Monday-Friday week of currentDate
  const getWeekDates = (anchorDate: Date): Date[] => {
    const d = new Date(anchorDate);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Monday
    const monday = new Date(d.setDate(diff));

    const week: Date[] = [];
    for (let i = 0; i < 5; i++) {
      const nextDay = new Date(monday);
      nextDay.setDate(monday.getDate() + i);
      week.push(nextDay);
    }
    return week;
  };

  const weekDates = getWeekDates(currentDate);

  const formatDateYYYYMMDD = (d: Date): string => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  // Auto fetch NEIS Live API for all 5 week days when grade, classNum, or week changes
  useEffect(() => {
    if (!useLiveNeis) return;

    let isMounted = true;
    setIsLoadingNeis(true);
    setIsFetchError(false);

    const fetchWeekLiveData = async () => {
      try {
        const newMap: Record<string, TimetableRecord[]> = {};

        for (const d of weekDates) {
          const dateStr = formatDateYYYYMMDD(d);
          const liveRecords = await fetchNeisTimetableLive(
            selection.grade,
            selection.classNum,
            dateStr
          );
          if (liveRecords !== null) {
            newMap[dateStr] = liveRecords;
          }
        }

        if (isMounted) {
          setLiveDataMap((prev) => ({ ...prev, ...newMap }));
          setIsLoadingNeis(false);
        }
      } catch (err) {
        console.error('NEIS live timetable fetch failed:', err);
        if (isMounted) {
          setIsFetchError(true);
          setIsLoadingNeis(false);
        }
      }
    };

    fetchWeekLiveData();

    return () => {
      isMounted = false;
    };
  }, [selection.grade, selection.classNum, currentDate, useLiveNeis]);

  const dayNames = ['월요일', '화요일', '수요일', '목요일', '금요일'];

  const prevWeek = () => {
    const newD = new Date(currentDate);
    newD.setDate(newD.getDate() - 7);
    setCurrentDate(newD);
  };

  const nextWeek = () => {
    const newD = new Date(currentDate);
    newD.setDate(newD.getDate() + 7);
    setCurrentDate(newD);
  };

  const setTodayWeek = () => {
    const today = new Date();
    if (today.getDay() === 0) today.setDate(today.getDate() + 1);
    if (today.getDay() === 6) today.setDate(today.getDate() + 2);
    setCurrentDate(today);
  };

  const isFavorite = (subjectName: string): boolean => {
    const clean = subjectName.trim().replace(/^\*\s*/, '');
    return favoriteSubjects.some((f) => f.trim().replace(/^\*\s*/, '') === clean);
  };

  return (
    <div className="space-y-4">
      {/* Top Controller Bar */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-3 bg-slate-800/80 border border-slate-700/70 p-3 sm:p-4 rounded-2xl shadow-lg">
        {/* Left: Info */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-600/20 border border-indigo-500/30 rounded-xl text-indigo-400">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span>{selection.grade}학년 {selection.classNum}반 주간 시간표</span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {selection.department}
              </span>
            </h2>
            <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
              <span>
                {weekDates[0].toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })} ~{' '}
                {weekDates[4].toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })}
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-semibold bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.2 rounded-md">
                <Radio className="w-3 h-3 animate-pulse" />
                NEIS 오픈 API 시간표 적용중
              </span>
            </p>
          </div>
        </div>

        {/* Right: Date Preset & Navigator Controls */}
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-between lg:justify-end">
          {/* Quick Date Presets */}
          <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-700 text-xs">
            <button
              onClick={setTodayWeek}
              className="px-2.5 py-1 font-semibold rounded-lg bg-indigo-600 text-white shadow-sm"
            >
              현재 주간
            </button>
          </div>

          {/* Toggle Highlight Favorites */}
          <button
            onClick={() => setHighlightFavoritesOnly(!highlightFavoritesOnly)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all ${
              highlightFavoritesOnly
                ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-sm'
                : 'bg-slate-900/60 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${highlightFavoritesOnly ? 'fill-amber-400 text-amber-400' : ''}`} />
            선호과목 강조
          </button>

          {/* Prev/Next Week buttons */}
          <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-700">
            <button
              onClick={prevWeek}
              className="p-1.5 hover:bg-slate-800 text-slate-300 rounded-lg transition-colors"
              title="이전 주"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 text-xs font-bold text-slate-200 whitespace-nowrap">
              {weekDates[0].getMonth() + 1}월 {weekDates[0].getDate()}일 주
            </span>
            <button
              onClick={nextWeek}
              className="p-1.5 hover:bg-slate-800 text-slate-300 rounded-lg transition-colors"
              title="다음 주"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Error Alert Display */}
      {isFetchError && (
        <div className="p-4 bg-rose-950/60 border border-rose-500/40 text-rose-300 rounded-2xl flex items-center gap-3 text-xs font-semibold animate-fade-in shadow-lg">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          <span>일시적인 오류로 로드 할 수 없습니다. (인터넷 연결 상태 혹은 NEIS API 일일 호출 제한을 확인해주세요)</span>
        </div>
      )}

      {/* Loading Indicator */}
      {isLoadingNeis && !isFetchError && (
        <div className="flex items-center gap-2 px-4 py-2 bg-indigo-950/60 border border-indigo-500/30 text-indigo-300 rounded-xl text-xs font-medium animate-pulse">
          <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-400" />
          <span>대진전자통신고 {selection.grade}학년 {selection.classNum}반 NEIS 오픈 API 시간표를 동기화하고 있습니다...</span>
        </div>
      )}

      {/* Timetable Grid View */}
      <div className="bg-slate-800/80 border border-slate-700/70 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] border-collapse text-left">
            <thead>
              <tr className="bg-slate-900/90 border-b border-slate-700/80 text-xs font-semibold text-slate-300">
                <th className="p-3 w-24 text-center border-r border-slate-700/60">교시 / 시간</th>
                {weekDates.map((dateObj, idx) => {
                  const dateStr = formatDateYYYYMMDD(dateObj);
                  const isToday = formatDateYYYYMMDD(new Date()) === dateStr;

                  return (
                    <th
                      key={`col-${dateStr}`}
                      className={`p-3 text-center border-r border-slate-700/60 last:border-r-0 ${
                        isToday ? 'bg-indigo-950/50 border-t-2 border-t-indigo-500' : ''
                      }`}
                    >
                      <div className="flex flex-col items-center">
                        <span className={`font-bold ${isToday ? 'text-indigo-400' : 'text-slate-200'}`}>
                          {dayNames[idx]}
                        </span>
                        <span className="text-[11px] text-slate-400 font-normal">
                          {dateObj.getMonth() + 1}/{dateObj.getDate()}
                        </span>
                        {isToday && (
                          <span className="mt-0.5 text-[10px] px-1.5 py-0.2 bg-indigo-500/30 text-indigo-300 rounded-full font-medium">
                            Today
                          </span>
                        )}
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/60 text-xs">
              {PERIOD_TIMES.map((timeSlot) => {
                return (
                  <tr key={`period-row-${timeSlot.period}`} className="hover:bg-slate-800/40 transition-colors">
                    {/* Period Label */}
                    <td className="p-2.5 text-center bg-slate-900/40 border-r border-slate-700/60">
                      <div className="font-bold text-slate-200 text-xs">{timeSlot.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {timeSlot.start}~{timeSlot.end}
                      </div>
                    </td>

                    {/* Day Cells */}
                    {weekDates.map((dateObj) => {
                      const dateStr = formatDateYYYYMMDD(dateObj);
                      
                      // Priority 1: Check Live NEIS Cache; Priority 2: Local DB / CSV Dataset
                      const liveRecords = liveDataMap[dateStr];
                      let dailyRecords: TimetableRecord[];

                      if (liveRecords && liveRecords.length > 0) {
                        dailyRecords = liveRecords;
                      } else {
                        dailyRecords = getTimetableForDate(selection.grade, selection.classNum, dateStr);
                      }

                      const periodRecord = dailyRecords.find((r) => r.period === timeSlot.period);
                      let subject = periodRecord ? periodRecord.subject : '수업 없음';

                      // If the subject is '수업 없음' (due to missing live API data on 6,7th periods),
                      // fall back to standard local template so that 6,7th periods are ALWAYS filled with actual subjects!
                      if (subject === '수업 없음' || !subject) {
                        const fallbackRecords = getStaticTimetableForDate(selection.grade, selection.classNum, dateStr);
                        const fallbackRecord = fallbackRecords.find((r) => r.period === timeSlot.period);
                        if (fallbackRecord && fallbackRecord.subject !== '수업 없음') {
                          subject = fallbackRecord.subject;
                        }
                      }

                      const favorite = isFavorite(subject);

                      // Check if homework exists due on this date for this subject
                      const relatedHomework = homeworks.filter(
                        (h) =>
                          h.dueDate === dateStr &&
                          h.subject.trim().replace(/^\*\s*/, '') === subject.trim().replace(/^\*\s*/, '') &&
                          !h.completed
                      );

                      if (highlightFavoritesOnly && !favorite && subject !== '수업 없음') {
                        return (
                          <td
                            key={`cell-${dateStr}-${timeSlot.period}`}
                            className="p-2 border-r border-slate-700/60 last:border-r-0 opacity-30 bg-slate-900/10"
                          >
                            <div className="text-center text-slate-500">{subject}</div>
                          </td>
                        );
                      }

                      return (
                        <td
                          key={`cell-${dateStr}-${timeSlot.period}`}
                          className={`p-2 border-r border-slate-700/60 last:border-r-0 relative group transition-all ${
                            favorite
                              ? 'bg-gradient-to-br from-amber-500/20 via-indigo-950/30 to-slate-800/80 border-l-2 border-l-amber-400 shadow-sm'
                              : 'hover:bg-slate-700/30'
                          }`}
                        >
                          <div className="flex flex-col h-full justify-between gap-1 min-h-[60px]">
                            {/* Subject Header */}
                            <div className="flex items-start justify-between gap-1">
                              <span
                                className={`font-semibold leading-snug break-words ${
                                  favorite ? 'text-amber-200 font-bold' : 'text-slate-100'
                                }`}
                              >
                                {subject}
                              </span>

                              {subject !== '수업 없음' && (
                                <button
                                  onClick={() => onToggleFavorite(subject)}
                                  className={`p-1 rounded-md transition-all ${
                                    favorite
                                      ? 'text-amber-400 hover:text-amber-300'
                                      : 'text-slate-600 opacity-0 group-hover:opacity-100 hover:text-amber-400'
                                  }`}
                                  title={favorite ? '선호 과목 해제' : '선호 과목 추가'}
                                >
                                  <Star
                                    className={`w-3.5 h-3.5 ${
                                      favorite ? 'fill-amber-400' : ''
                                    }`}
                                  />
                                </button>
                              )}
                            </div>

                            {/* Indicators & Actions */}
                            <div className="flex items-center justify-between pt-1 border-t border-slate-700/30">
                              {/* Homework due badge */}
                              {relatedHomework.length > 0 ? (
                                <span className="inline-flex items-center gap-0.5 text-[10px] px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 font-medium">
                                  <AlertCircle className="w-2.5 h-2.5 text-rose-400" />
                                  숙제 {relatedHomework.length}개
                                </span>
                              ) : (
                                <span className="text-[10px] text-slate-500">
                                  {favorite && (
                                    <span className="text-amber-400/90 font-medium text-[10px]">
                                      ★ 즐겨찾기
                                    </span>
                                  )}
                                </span>
                              )}

                              {/* Quick Homework Add Button */}
                              {subject !== '수업 없음' && (
                                <button
                                  onClick={() => onQuickAddHomework(subject, dateStr)}
                                  className="opacity-0 group-hover:opacity-100 flex items-center gap-0.5 text-[10px] text-indigo-300 hover:text-white bg-indigo-900/60 hover:bg-indigo-600 px-1.5 py-0.5 rounded transition-all"
                                  title={`${subject} 숙제 추가`}
                                >
                                  <Plus className="w-2.5 h-2.5" />
                                  숙제
                                </button>
                              )}
                            </div>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* After-school section summary below timetable */}
        <div className="p-3 bg-slate-900/80 border-t border-slate-700/80 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-indigo-300 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              오늘의 방과후 프로그램:
            </span>
            {(() => {
              const todayStr = formatDateYYYYMMDD(currentDate);
              const todayNum = currentDate.getDay();
              const filteredAfter = afterSchools.filter(
                (a) =>
                  a.daysOfWeek.includes(todayNum) ||
                  a.specificDate === todayStr
              );

              if (filteredAfter.length === 0) {
                return <span className="text-slate-500 text-xs">등록된 방과후 활동이 없습니다.</span>;
              }

              return filteredAfter.map((a) => (
                <span
                  key={a.id}
                  className="px-2 py-0.5 bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 rounded-md font-medium text-xs flex items-center gap-1"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                  {a.name} ({a.time})
                </span>
              ));
            })()}
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <span className="flex items-center gap-1 text-emerald-400 font-medium">
              <CheckCircle2 className="w-3 h-3" />
              NEIS 오픈 API 표준 반영
            </span>
            <span>·</span>
            <span>과목 옆 별(★)을 눌러 선호 과목을 저장할 수 있습니다.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
