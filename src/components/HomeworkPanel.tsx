import React, { useState } from 'react';
import { HomeworkItem, UserClassSelection } from '../types';
import {
  CheckSquare,
  Square,
  Plus,
  Trash2,
  AlertTriangle,
  Clock,
  Filter,
  CheckCircle2,
  Calendar,
  Search,
  BookOpen
} from 'lucide-react';

interface HomeworkPanelProps {
  homeworks: HomeworkItem[];
  selection: UserClassSelection;
  onToggleComplete: (id: string) => void;
  onDeleteHomework: (id: string) => void;
  onOpenAddModal: () => void;
  selectedDateFilter?: string | null;
  onClearDateFilter?: () => void;
}

export const HomeworkPanel: React.FC<HomeworkPanelProps> = ({
  homeworks,
  selection,
  onToggleComplete,
  onDeleteHomework,
  onOpenAddModal,
  selectedDateFilter,
  onClearDateFilter,
}) => {
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'urgent' | 'completed'>('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCurrentClassOnly, setFilterCurrentClassOnly] = useState(false);

  const getDDay = (dueDateStr: string): { text: string; isOverdue: boolean; isToday: boolean; days: number } => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const due = new Date(dueDateStr);
    due.setHours(0, 0, 0, 0);

    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { text: `기한 초과 (${Math.abs(diffDays)}일 전)`, isOverdue: true, isToday: false, days: diffDays };
    }
    if (diffDays === 0) {
      return { text: '오늘 마감!', isOverdue: false, isToday: true, days: 0 };
    }
    return { text: `D-${diffDays}`, isOverdue: false, isToday: false, days: diffDays };
  };

  // Filter homeworks
  const filteredHomeworks = homeworks.filter((hw) => {
    // Current class filter
    if (filterCurrentClassOnly) {
      if (hw.grade !== selection.grade || hw.classNum !== selection.classNum) return false;
    }

    // Specific date click filter from calendar
    if (selectedDateFilter && hw.dueDate !== selectedDateFilter) {
      return false;
    }

    // Status filter
    if (statusFilter === 'pending' && hw.completed) return false;
    if (statusFilter === 'completed' && !hw.completed) return false;
    if (statusFilter === 'urgent') {
      if (hw.completed) return false;
      const dday = getDDay(hw.dueDate);
      if (dday.days > 2) return false;
    }

    // Search term
    if (searchTerm.trim().length > 0) {
      const term = searchTerm.toLowerCase();
      const matchTitle = hw.title.toLowerCase().includes(term);
      const matchSubject = hw.subject.toLowerCase().includes(term);
      const matchNotes = (hw.notes || '').toLowerCase().includes(term);
      if (!matchTitle && !matchSubject && !matchNotes) return false;
    }

    return true;
  });

  // Sort homeworks: incomplete first, then urgent, then by date
  filteredHomeworks.sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });

  const pendingCount = homeworks.filter((h) => !h.completed).length;
  const overdueCount = homeworks.filter((h) => !h.completed && getDDay(h.dueDate).isOverdue).length;
  const completedCount = homeworks.filter((h) => h.completed).length;

  return (
    <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-4 shadow-xl flex flex-col h-full space-y-4">
      {/* Panel Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-700/80">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-600/20 border border-indigo-500/30 rounded-xl text-indigo-400">
            <CheckSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              숙제 기록 &amp; 과제함
              {overdueCount > 0 && (
                <span className="px-1.5 py-0.5 bg-rose-500/20 text-rose-300 text-[10px] font-bold rounded-full border border-rose-500/40">
                  {overdueCount}개 지연
                </span>
              )}
            </h3>
            <p className="text-xs text-slate-400">
              전체 {homeworks.length}개 · 미완료 {pendingCount}개 · 완료 {completedCount}개
            </p>
          </div>
        </div>

        <button
          onClick={onOpenAddModal}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-md shadow-indigo-500/20 transition-all whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          숙제 추가
        </button>
      </div>

      {/* Date Filter Badge if activated from Calendar */}
      {selectedDateFilter && (
        <div className="flex items-center justify-between p-2 bg-indigo-950/80 border border-indigo-500/40 rounded-xl text-xs text-indigo-200">
          <span className="flex items-center gap-1.5 font-medium">
            <Calendar className="w-3.5 h-3.5 text-indigo-400" />
            선택한 날짜 ({selectedDateFilter}) 숙제 보는 중
          </span>
          <button
            onClick={onClearDateFilter}
            className="text-indigo-400 hover:text-white underline font-semibold text-[11px]"
          >
            전체 보기
          </button>
        </div>
      )}

      {/* Filter Tabs & Search Bar */}
      <div className="space-y-2">
        {/* Status Segmented Buttons */}
        <div className="grid grid-cols-4 gap-1 p-1 bg-slate-900/80 rounded-xl border border-slate-700/60 text-xs">
          <button
            onClick={() => setStatusFilter('pending')}
            className={`py-1.5 font-medium rounded-lg transition-all text-center ${
              statusFilter === 'pending'
                ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            진행중 ({pendingCount})
          </button>
          <button
            onClick={() => setStatusFilter('urgent')}
            className={`py-1.5 font-medium rounded-lg transition-all text-center ${
              statusFilter === 'urgent'
                ? 'bg-rose-600 text-white shadow-sm font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            마감임박
          </button>
          <button
            onClick={() => setStatusFilter('completed')}
            className={`py-1.5 font-medium rounded-lg transition-all text-center ${
              statusFilter === 'completed'
                ? 'bg-emerald-600 text-white shadow-sm font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            완료 ({completedCount})
          </button>
          <button
            onClick={() => setStatusFilter('all')}
            className={`py-1.5 font-medium rounded-lg transition-all text-center ${
              statusFilter === 'all'
                ? 'bg-slate-700 text-white shadow-sm font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            전체
          </button>
        </div>

        {/* Search Input & Class Filter Toggle */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="숙제 또는 과목 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900/90 text-xs text-slate-100 pl-8 pr-3 py-1.5 rounded-xl border border-slate-700 focus:outline-none focus:border-indigo-500 placeholder-slate-500"
            />
          </div>

          <button
            onClick={() => setFilterCurrentClassOnly(!filterCurrentClassOnly)}
            className={`px-2.5 py-1.5 text-xs font-medium rounded-xl border flex items-center gap-1 transition-all whitespace-nowrap ${
              filterCurrentClassOnly
                ? 'bg-indigo-950/80 border-indigo-500/50 text-indigo-300'
                : 'bg-slate-900/60 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
            title="현재 선택 학급(1-8)만 보기"
          >
            <Filter className="w-3 h-3" />
            내 학급만
          </button>
        </div>
      </div>

      {/* Homework List Container */}
      <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 max-h-[500px] sm:max-h-[620px] custom-scrollbar">
        {filteredHomeworks.length === 0 ? (
          <div className="text-center py-10 px-4 bg-slate-900/40 border border-dashed border-slate-700/60 rounded-2xl">
            <CheckCircle2 className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-xs font-semibold text-slate-300">등록된 숙제가 없습니다.</p>
            <p className="text-[11px] text-slate-500 mt-1">
              우측 상단 [숙제 추가] 버튼을 눌러 새로운 과제를 등록해보세요!
            </p>
          </div>
        ) : (
          filteredHomeworks.map((hw) => {
            const dday = getDDay(hw.dueDate);

            return (
              <div
                key={hw.id}
                className={`p-3 rounded-xl border transition-all duration-200 ${
                  hw.completed
                    ? 'bg-slate-900/40 border-slate-800 text-slate-500 opacity-75'
                    : dday.isOverdue
                    ? 'bg-rose-950/20 border-rose-500/40 text-slate-200'
                    : dday.isToday
                    ? 'bg-amber-950/20 border-amber-500/40 text-slate-200'
                    : 'bg-slate-900/80 border-slate-700/70 hover:border-slate-600 text-slate-100'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  {/* Checkbox */}
                  <button
                    onClick={() => onToggleComplete(hw.id)}
                    className="mt-0.5 text-slate-400 hover:text-indigo-400 transition-colors focus:outline-none"
                    title={hw.completed ? '미완료로 변경' : '완료로 표시'}
                  >
                    {hw.completed ? (
                      <CheckSquare className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-500 hover:text-indigo-400" />
                    )}
                  </button>

                  {/* Main Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <h4
                        className={`text-xs font-bold leading-snug break-words ${
                          hw.completed ? 'line-through text-slate-500' : 'text-slate-100'
                        }`}
                      >
                        {hw.title}
                      </h4>

                      {/* Delete Button */}
                      <button
                        onClick={() => onDeleteHomework(hw.id)}
                        className="text-slate-500 hover:text-rose-400 p-1 rounded transition-colors opacity-60 hover:opacity-100"
                        title="숙제 삭제"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Metadata line */}
                    <div className="flex flex-wrap items-center gap-1.5 mt-1 text-[11px] text-slate-400">
                      <span className="font-semibold text-indigo-300 bg-indigo-950/80 px-1.5 py-0.2 rounded border border-indigo-500/30">
                        {hw.subject}
                      </span>
                      <span>·</span>
                      <span>
                        {hw.grade}학년 {hw.classNum}반
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        {hw.dueDate} {hw.dueTime || ''}
                      </span>
                    </div>

                    {/* Notes if present */}
                    {hw.notes && (
                      <p className="mt-1.5 text-[11px] text-slate-400 bg-slate-950/50 p-1.5 rounded-lg border border-slate-800 break-words">
                        {hw.notes}
                      </p>
                    )}

                    {/* D-Day & Priority Badges */}
                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-800">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                            hw.completed
                              ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/30'
                              : dday.isOverdue
                              ? 'bg-rose-950/80 text-rose-300 border-rose-500/50 animate-pulse'
                              : dday.isToday
                              ? 'bg-amber-950/80 text-amber-300 border-amber-500/50 font-bold'
                              : 'bg-indigo-950/60 text-indigo-300 border-indigo-500/30'
                          }`}
                        >
                          {hw.completed ? '완료됨' : dday.text}
                        </span>

                        {!hw.completed && dday.isOverdue && (
                          <span className="flex items-center gap-0.5 text-[10px] text-rose-400 font-medium">
                            <AlertTriangle className="w-3 h-3" />
                            지연됨
                          </span>
                        )}
                      </div>

                      {/* Priority Tag */}
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${
                          hw.priority === 'high'
                            ? 'text-rose-400 bg-rose-500/10'
                            : hw.priority === 'medium'
                            ? 'text-amber-400 bg-amber-500/10'
                            : 'text-slate-400 bg-slate-800'
                        }`}
                      >
                        우선순위: {hw.priority === 'high' ? '높음' : hw.priority === 'medium' ? '보통' : '낮음'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
