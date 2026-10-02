import React from 'react';
import { ClassSelector } from './ClassSelector';
import { UserClassSelection } from '../types';
import { Calendar, Clock, PlusCircle, Bookmark, Radio, Cpu, Key } from 'lucide-react';

interface HeaderProps {
  selection: UserClassSelection;
  onSelectionChange: (newSel: UserClassSelection) => void;
  activeTab: 'timetable' | 'calendar' | 'afterschool' | 'favorites';
  onTabChange: (tab: 'timetable' | 'calendar' | 'afterschool' | 'favorites') => void;
  onOpenHomeworkModal: () => void;
  onOpenAfterSchoolModal: () => void;
  onOpenNeisModal: () => void;
  onOpenNeisKeyModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  selection,
  onSelectionChange,
  activeTab,
  onTabChange,
  onOpenHomeworkModal,
  onOpenAfterSchoolModal,
  onOpenNeisModal,
  onOpenNeisKeyModal,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 border-b border-slate-800 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between py-3 gap-3">
          
          {/* Zone 1: Brand & Logo */}
          <div className="flex items-center justify-between w-full lg:w-auto">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-teal-400 p-0.5 shadow-lg shadow-indigo-500/20 flex items-center justify-center">
                <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
                  <Cpu className="w-5 h-5 text-indigo-400" />
                </div>
              </div>
              <div>
                <a href="/" className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                  대진전자통신고 <span className="text-indigo-400 text-sm font-normal hidden sm:inline">| 학사 플래너</span>
                </a>
                <p className="text-[11px] text-slate-400 leading-none">
                  2026/2027 실시간 NEIS 동기화 &amp; 로컬 DB 숙제·방과후
                </p>
              </div>
            </div>

            {/* Mobile Actions Quick Group */}
            <div className="flex lg:hidden items-center gap-1.5">
              <button
                onClick={onOpenHomeworkModal}
                className="p-2 bg-indigo-600/90 text-white rounded-lg text-xs font-medium flex items-center gap-1 hover:bg-indigo-500"
                title="숙제 추가"
              >
                <PlusCircle className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Zone 2: Navigation Tabs */}
          <nav className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700/60 overflow-x-auto max-w-full">
            <button
              onClick={() => onTabChange('timetable')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                activeTab === 'timetable'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              시간표
            </button>

            <button
              onClick={() => onTabChange('calendar')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                activeTab === 'calendar'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              캘린더 &amp; 숙제
            </button>

            <button
              onClick={() => onTabChange('afterschool')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                activeTab === 'afterschool'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
              }`}
            >
              <PlusCircle className="w-3.5 h-3.5" />
              방과후 활동
            </button>

            <button
              onClick={() => onTabChange('favorites')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                activeTab === 'favorites'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              선호 과목
            </button>

            <button
              onClick={onOpenNeisModal}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 hover:bg-emerald-950/40 rounded-lg transition-colors whitespace-nowrap"
              title="NEIS 나이스 실시간 API 연동"
            >
              <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>NEIS 실시간</span>
            </button>

            <button
              onClick={onOpenNeisKeyModal}
              className="p-1.5 text-slate-400 hover:text-amber-300 hover:bg-slate-700/60 rounded-lg transition-colors"
              title="NEIS API Key 설정"
            >
              <Key className="w-3.5 h-3.5" />
            </button>
          </nav>

          {/* Zone 3: Top Right Classification Tabs (우측 상단 분류탭) */}
          <div className="flex items-center gap-2 w-full lg:w-auto justify-end">
            <ClassSelector selection={selection} onChange={onSelectionChange} />

            <div className="hidden lg:flex items-center gap-2 ml-1">
              <button
                onClick={onOpenHomeworkModal}
                className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white text-xs font-medium rounded-xl shadow-md shadow-indigo-500/20 transition-all whitespace-nowrap"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                숙제 등록
              </button>

              <button
                onClick={onOpenAfterSchoolModal}
                className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-medium rounded-xl transition-all whitespace-nowrap"
              >
                + 방과후
              </button>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
};
