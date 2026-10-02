import React, { useState } from 'react';
import { AfterSchoolItem, UserClassSelection } from '../types';
import { X, Clock, BookOpen, MapPin, User, Calendar, PlusCircle } from 'lucide-react';

interface AfterSchoolModalProps {
  isOpen: boolean;
  onClose: () => void;
  selection: UserClassSelection;
  onAddAfterSchool: (item: Omit<AfterSchoolItem, 'id'>) => void;
}

export const AfterSchoolModal: React.FC<AfterSchoolModalProps> = ({
  isOpen,
  onClose,
  selection,
  onAddAfterSchool,
}) => {
  const [name, setName] = useState('');
  const [time, setTime] = useState('16:30 ~ 17:30 (8~9교시)');
  const [homework, setHomework] = useState('');
  const [selectedDays, setSelectedDays] = useState<number[]>([1, 3]); // Mon, Wed
  const [room, setRoom] = useState('');
  const [instructor, setInstructor] = useState('');

  if (!isOpen) return null;

  const dayOptions = [
    { day: 1, label: '월요일' },
    { day: 2, label: '화요일' },
    { day: 3, label: '수요일' },
    { day: 4, label: '목요일' },
    { day: 5, label: '금요일' },
  ];

  const toggleDay = (day: number) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((d) => d !== day));
    } else {
      setSelectedDays([...selectedDays, day].sort());
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAddAfterSchool({
      name: name.trim(),
      time: time.trim() || '16:30 ~ 17:30',
      homework: homework.trim() || undefined,
      daysOfWeek: selectedDays,
      grade: selection.grade,
      classNum: selection.classNum,
      room: room.trim() || undefined,
      instructor: instructor.trim() || undefined,
      color: '#06b6d4',
    });

    // Reset fields
    setName('');
    setHomework('');
    setRoom('');
    setInstructor('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 rounded-xl">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">방과후 프로그램 추가</h3>
              <p className="text-xs text-slate-400">
                시간, 방과후명, 연관 숙제를 등록하여 캘린더에 표시합니다.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {/* 1. 방과후명 입력 */}
          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-1">
              방과후명 입력 <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="예: C++ 알고리즘 방과후, 전기기능사 실기반"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-800 text-slate-100 text-xs px-3 py-2 rounded-xl border border-slate-700 focus:outline-none focus:border-cyan-400 placeholder-slate-500"
            />
          </div>

          {/* 2. 시간입력 */}
          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-1 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              시간입력 <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="예: 16:30 ~ 17:30 (8~9교시)"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full bg-slate-800 text-slate-100 text-xs px-3 py-2 rounded-xl border border-slate-700 focus:outline-none focus:border-cyan-400 placeholder-slate-500"
            />
          </div>

          {/* 3. 숙제입력 (선택) */}
          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-1 flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              숙제입력 (선택)
            </label>
            <input
              type="text"
              placeholder="예: 백준 알고리즘 3개 문제 풀기, 실기회로 2회 연습"
              value={homework}
              onChange={(e) => setHomework(e.target.value)}
              className="w-full bg-slate-800 text-slate-100 text-xs px-3 py-2 rounded-xl border border-slate-700 focus:outline-none focus:border-amber-400 placeholder-slate-500"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              * 숙제를 입력하시면 [숙제 목록]에도 자동으로 함께 기록됩니다!
            </p>
          </div>

          {/* 4. 요일 선택 */}
          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-1 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-indigo-400" />
              진행 요일 선택
            </label>
            <div className="flex items-center gap-1.5 pt-1">
              {dayOptions.map((opt) => {
                const isSelected = selectedDays.includes(opt.day);
                return (
                  <button
                    key={`day-btn-${opt.day}`}
                    type="button"
                    onClick={() => toggleDay(opt.day)}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-xl border transition-all ${
                      isSelected
                        ? 'bg-cyan-600 text-white border-cyan-400 shadow-sm'
                        : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 5. 장소 & 담당 교사 (Optional) */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-slate-400" />
                강의실 / 장소
              </label>
              <input
                type="text"
                placeholder="예: 3층 컴퓨터실습2실"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                className="w-full bg-slate-800 text-slate-100 text-xs px-3 py-2 rounded-xl border border-slate-700 focus:outline-none focus:border-cyan-400 placeholder-slate-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                <User className="w-3 h-3 text-slate-400" />
                담당 교사
              </label>
              <input
                type="text"
                placeholder="예: 박선생님"
                value={instructor}
                onChange={(e) => setInstructor(e.target.value)}
                className="w-full bg-slate-800 text-slate-100 text-xs px-3 py-2 rounded-xl border border-slate-700 focus:outline-none focus:border-cyan-400 placeholder-slate-500"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 rounded-xl shadow-md shadow-cyan-500/20 transition-all"
            >
              방과후 저장하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
