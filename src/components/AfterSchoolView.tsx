import React from 'react';
import { AfterSchoolItem, UserClassSelection } from '../types';
import { PlusCircle, Clock, BookOpen, MapPin, User, Trash2, Calendar, AlertCircle } from 'lucide-react';

interface AfterSchoolViewProps {
  afterSchools: AfterSchoolItem[];
  selection: UserClassSelection;
  onOpenAddModal: () => void;
  onDeleteAfterSchool: (id: string) => void;
}

export const AfterSchoolView: React.FC<AfterSchoolViewProps> = ({
  afterSchools,
  selection,
  onOpenAddModal,
  onDeleteAfterSchool,
}) => {
  const dayNames = ['', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일', '일요일'];

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-800/80 border border-slate-700/70 p-4 rounded-2xl shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-cyan-600/20 border border-cyan-500/30 rounded-xl text-cyan-400">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              방과후 프로그램 &amp; 특강 관리
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                {afterSchools.length}개 등록됨
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              수업 후 방과후 교실 시간, 강의명, 관련 과제 기록을 정밀하게 등록·관리합니다.
            </p>
          </div>
        </div>

        <button
          onClick={onOpenAddModal}
          className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold rounded-xl shadow-md shadow-cyan-500/20 transition-all whitespace-nowrap"
        >
          <PlusCircle className="w-4 h-4" />
          방과후 프로그램 등록
        </button>
      </div>

      {/* Program Cards Grid */}
      {afterSchools.length === 0 ? (
        <div className="text-center py-16 bg-slate-800/60 border border-dashed border-slate-700/80 rounded-2xl p-6">
          <Clock className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-200">등록된 방과후 활동이 없습니다.</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            [방과후 프로그램 등록] 버튼을 눌러 시간입력, 방과후명, 연관 숙제를 자유롭게 추가해보세요.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {afterSchools.map((item) => (
            <div
              key={item.id}
              className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-4 shadow-xl hover:border-cyan-500/50 transition-all flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <span className="font-bold text-sm text-white leading-snug">
                    {item.name}
                  </span>
                  <button
                    onClick={() => onDeleteAfterSchool(item.id)}
                    className="p-1 text-slate-500 hover:text-rose-400 rounded transition-colors"
                    title="삭제"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Time badge */}
                <div className="flex items-center gap-1.5 text-xs text-cyan-300 font-semibold bg-cyan-950/70 border border-cyan-500/30 px-2.5 py-1 rounded-xl w-fit">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{item.time}</span>
                </div>

                {/* Days of week */}
                <div className="flex items-center gap-1 text-xs text-slate-400 pt-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span className="font-medium text-slate-300">
                    {item.daysOfWeek.map((d) => dayNames[d]).join(', ')}
                  </span>
                </div>

                {/* Room / Instructor */}
                {(item.room || item.instructor) && (
                  <div className="flex items-center gap-3 text-xs text-slate-400 pt-1">
                    {item.room && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-500" />
                        {item.room}
                      </span>
                    )}
                    {item.instructor && (
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3 text-slate-500" />
                        {item.instructor}
                      </span>
                    )}
                  </div>
                )}

                {/* Homework Note */}
                {item.homework && (
                  <div className="p-2.5 bg-slate-900/90 border border-amber-500/30 rounded-xl text-xs space-y-1">
                    <span className="font-bold text-amber-300 flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                      연관 숙제
                    </span>
                    <p className="text-slate-300 break-words">{item.homework}</p>
                  </div>
                )}
              </div>

              {/* Card Footer */}
              <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-[11px] text-slate-500">
                <span>대진전자통신고 방과후</span>
                <span className="text-cyan-400 font-medium">활동 진행중</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
