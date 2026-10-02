import React, { useState } from 'react';
import { UserClassSelection, HomeworkItem, AfterSchoolItem } from '../types';
import { getTimetableForDate } from '../data/timetableData';
import { HomeworkPanel } from './HomeworkPanel';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, Plus, Star, Sparkles } from 'lucide-react';

interface CalendarViewProps {
  selection: UserClassSelection;
  homeworks: HomeworkItem[];
  afterSchools: AfterSchoolItem[];
  favoriteSubjects: string[];
  onToggleCompleteHomework: (id: string) => void;
  onDeleteHomework: (id: string) => void;
  onOpenAddHomeworkModal: (presetDate?: string) => void;
  onOpenAddAfterSchoolModal: () => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  selection,
  homeworks,
  afterSchools,
  favoriteSubjects,
  onToggleCompleteHomework,
  onDeleteHomework,
  onOpenAddHomeworkModal,
  onOpenAddAfterSchoolModal,
}) => {
  const [currentYearMonth, setCurrentYearMonth] = useState<{ year: number; month: number }>(() => {
    const d = new Date();
    return { year: d.getFullYear(), month: d.getMonth() };
  });

  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const prevMonth = () => {
    setCurrentYearMonth((prev) => {
      if (prev.month === 0) return { year: prev.year - 1, month: 11 };
      return { year: prev.year, month: prev.month - 1 };
    });
  };

  const nextMonth = () => {
    setCurrentYearMonth((prev) => {
      if (prev.month === 11) return { year: prev.year + 1, month: 0 };
      return { year: prev.year, month: prev.month + 1 };
    });
  };

  const resetToToday = () => {
    const today = new Date();
    setCurrentYearMonth({ year: today.getFullYear(), month: today.getMonth() });
    setSelectedDate(null);
  };

  // Generate Days Matrix for currentYearMonth
  const getDaysMatrix = () => {
    const { year, month } = currentYearMonth;
    const firstDay = new Date(year, month, 1).getDay(); // 0 = Sun
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const matrix: (Date | null)[] = [];

    // Leading empty slots
    for (let i = 0; i < firstDay; i++) {
      matrix.push(null);
    }

    // Actual days
    for (let day = 1; day <= daysInMonth; day++) {
      matrix.push(new Date(year, month, day));
    }

    return matrix;
  };

  const daysMatrix = getDaysMatrix();
  const dayLabels = ['일', '월', '화', '수', '목', '금', '토'];

  const formatDateStr = (d: Date): string => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  const isToday = (d: Date): boolean => {
    return formatDateStr(d) === formatDateStr(new Date());
  };

  const monthNames = [
    '1월', '2월', '3월', '4월', '5월', '6월',
    '7월', '8월', '9월', '10월', '11월', '12월'
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* LEFT / MAIN COLUMN: Calendar (lg:col-span-7 or 8) */}
      <div className="lg:col-span-7 xl:col-span-8 space-y-4">
        {/* Calendar Header Controller */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-800/80 border border-slate-700/70 p-3 sm:p-4 rounded-2xl shadow-lg">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-600/20 border border-indigo-500/30 rounded-xl text-indigo-400">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>학사 캘린더</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {selection.grade}학년 {selection.classNum}반
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                일정을 클릭하면 해당 날짜의 시간표 및 숙제 항목이 필터링됩니다.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
            <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-700">
              <button
                onClick={prevMonth}
                className="p-1.5 hover:bg-slate-800 text-slate-300 rounded-lg transition-colors"
                title="이전 달"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-2 text-xs font-bold text-white whitespace-nowrap">
                {currentYearMonth.year}년 {monthNames[currentYearMonth.month]}
              </span>
              <button
                onClick={nextMonth}
                className="p-1.5 hover:bg-slate-800 text-slate-300 rounded-lg transition-colors"
                title="다음 달"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={resetToToday}
              className="px-3 py-1.5 text-xs font-semibold text-indigo-300 bg-indigo-950/60 hover:bg-indigo-900/80 border border-indigo-500/30 rounded-xl transition-colors"
            >
              오늘
            </button>
          </div>
        </div>

        {/* Calendar Grid Container */}
        <div className="bg-slate-800/80 border border-slate-700/70 rounded-2xl overflow-hidden shadow-xl p-3 sm:p-4">
          {/* Day of Week Headers */}
          <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-slate-400 pb-2 border-b border-slate-700/60">
            {dayLabels.map((lbl, idx) => (
              <div
                key={`lbl-${lbl}`}
                className={idx === 0 ? 'text-rose-400' : idx === 6 ? 'text-blue-400' : 'text-slate-300'}
              >
                {lbl}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1.5 pt-2">
            {daysMatrix.map((dateObj, idx) => {
              if (!dateObj) {
                return (
                  <div
                    key={`empty-${idx}`}
                    className="min-h-[80px] sm:min-h-[100px] bg-slate-900/20 rounded-xl border border-transparent"
                  />
                );
              }

              const dateStr = formatDateStr(dateObj);
              const dayNum = dateObj.getDate();
              const dayOfWeek = dateObj.getDay();
              const today = isToday(dateObj);
              const isSelected = selectedDate === dateStr;

              // Filter homework for this day
              const dayHomeworks = homeworks.filter((h) => h.dueDate === dateStr);
              const pendingHw = dayHomeworks.filter((h) => !h.completed);

              // Filter after-school for this day
              const dayAfterSchools = afterSchools.filter(
                (a) => a.daysOfWeek.includes(dayOfWeek) || a.specificDate === dateStr
              );

              // Daily Timetable sample
              const dailyTimetable = getTimetableForDate(selection.grade, selection.classNum, dateStr);
              const hasFavoritesInTimetable = dailyTimetable.some((t) =>
                favoriteSubjects.some(
                  (f) => f.trim().replace(/^\*\s*/, '') === t.subject.trim().replace(/^\*\s*/, '')
                )
              );

              return (
                <div
                  key={`day-${dateStr}`}
                  onClick={() => setSelectedDate(isSelected ? null : dateStr)}
                  className={`min-h-[80px] sm:min-h-[100px] p-1.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between group ${
                    isSelected
                      ? 'bg-indigo-950/80 border-indigo-400 shadow-md shadow-indigo-500/20 ring-1 ring-indigo-400'
                      : today
                      ? 'bg-slate-900/90 border-indigo-500/70 shadow-sm'
                      : 'bg-slate-900/50 border-slate-700/60 hover:bg-slate-800/80 hover:border-slate-600'
                  }`}
                >
                  {/* Top Bar inside cell: Date number & indicators */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold px-1.5 py-0.5 rounded-md ${
                        today
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : dayOfWeek === 0
                          ? 'text-rose-400'
                          : dayOfWeek === 6
                          ? 'text-blue-400'
                          : 'text-slate-200'
                      }`}
                    >
                      {dayNum}
                    </span>

                    {/* Indicators */}
                    <div className="flex items-center gap-1">
                      {hasFavoritesInTimetable && (
                        <span title="선호과목 있음">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        </span>
                      )}
                      {pendingHw.length > 0 && (
                        <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" title="숙제 기한" />
                      )}
                    </div>
                  </div>

                  {/* Middle Content: Badges */}
                  <div className="space-y-1 my-1 overflow-hidden">
                    {/* After School Tag */}
                    {dayAfterSchools.map((a) => (
                      <div
                        key={a.id}
                        className="truncate text-[10px] font-semibold px-1.5 py-0.5 bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 rounded"
                        title={`${a.name} (${a.time})`}
                      >
                        ⚡ {a.name}
                      </div>
                    ))}

                    {/* Homework Summary Tags */}
                    {pendingHw.slice(0, 2).map((hw) => (
                      <div
                        key={hw.id}
                        className="truncate text-[10px] font-medium px-1.5 py-0.5 bg-rose-950/80 border border-rose-500/40 text-rose-200 rounded flex items-center gap-1"
                        title={hw.title}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0"></span>
                        <span className="truncate">{hw.title}</span>
                      </div>
                    ))}

                    {pendingHw.length > 2 && (
                      <div className="text-[9px] text-rose-300 font-semibold text-right pr-0.5">
                        +{pendingHw.length - 2}개 더보기
                      </div>
                    )}
                  </div>

                  {/* Bottom Cell Action */}
                  <div className="flex items-center justify-between pt-0.5 text-[10px] text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenAddHomeworkModal(dateStr);
                      }}
                      className="text-indigo-400 hover:text-indigo-200 flex items-center gap-0.5"
                      title="이 날짜에 숙제 추가"
                    >
                      <Plus className="w-2.5 h-2.5" />
                      숙제
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Homework Panel (lg:col-span-5 or 4) as explicitly required */}
      <div className="lg:col-span-5 xl:col-span-4 h-full">
        <HomeworkPanel
          homeworks={homeworks}
          selection={selection}
          onToggleComplete={onToggleCompleteHomework}
          onDeleteHomework={onDeleteHomework}
          onOpenAddModal={() => onOpenAddHomeworkModal(selectedDate || undefined)}
          selectedDateFilter={selectedDate}
          onClearDateFilter={() => setSelectedDate(null)}
        />
      </div>
    </div>
  );
};
