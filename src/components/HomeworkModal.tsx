import React, { useState, useEffect } from 'react';
import { HomeworkItem, UserClassSelection } from '../types';
import { SCHOOL_INFO } from '../data/timetableData';
import { X, Calendar, Clock, AlertTriangle, FileText, CheckCircle } from 'lucide-react';

interface HomeworkModalProps {
  isOpen: boolean;
  onClose: () => void;
  selection: UserClassSelection;
  presetSubject?: string;
  presetDate?: string;
  onAddHomework: (hw: Omit<HomeworkItem, 'id' | 'createdAt'>) => void;
}

export const HomeworkModal: React.FC<HomeworkModalProps> = ({
  isOpen,
  onClose,
  selection,
  presetSubject,
  presetDate,
  onAddHomework,
}) => {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState(presetSubject || '프로그래밍');
  const [grade, setGrade] = useState(selection.grade);
  const [classNum, setClassNum] = useState(selection.classNum);
  const [dueDate, setDueDate] = useState(
    presetDate || new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0]
  );
  const [dueTime, setDueTime] = useState('23:59');
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (presetSubject) setSubject(presetSubject);
    if (presetDate) setDueDate(presetDate);
    setGrade(selection.grade);
    setClassNum(selection.classNum);
  }, [presetSubject, presetDate, selection]);

  if (!isOpen) return null;

  const sampleSubjects = [
    '프로그래밍',
    '인공지능 일반',
    '컴퓨터 구조',
    '컴퓨터 그래픽',
    '애니메이션 기초',
    '* 하드웨어 회로 설계',
    '* 하드웨어 부품 선정',
    '* 하드웨어 성능 구현',
    '* SQL활용',
    '* 개발자 환경 구축',
    '* 화면 구현',
    '자료 구조',
    '디지털 논리 회로',
    '* PLC제어',
    '* 배관공사',
    '* 3D 애니메이팅',
    '* 드론 영상 촬영',
    '공통국어1',
    '공통수학1',
    '공통영어1',
    '통합사회1',
    '한국사',
    '체육1'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddHomework({
      title: title.trim(),
      subject: subject.trim(),
      grade,
      classNum,
      dueDate,
      dueTime: dueTime.trim() || undefined,
      priority,
      completed: false,
      notes: notes.trim() || undefined,
    });

    // Reset
    setTitle('');
    setNotes('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 rounded-xl">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">숙제 및 과제 기록</h3>
              <p className="text-xs text-slate-400">
                과목별 숙제를 등록하여 캘린더 및 숙제 목록에 관리합니다.
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {/* 숙제 제목 */}
          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-1">
              숙제 제목 <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="예: C++ 클래스 설계 실습 과제 제출"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-800 text-slate-100 text-xs px-3 py-2 rounded-xl border border-slate-700 focus:outline-none focus:border-indigo-400 placeholder-slate-500"
            />
          </div>

          {/* 과목 선택 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1">
                과목 선택 <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                list="subject-datalist"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="과목명 입력 또는 선택"
                className="w-full bg-slate-800 text-slate-100 text-xs px-3 py-2 rounded-xl border border-slate-700 focus:outline-none focus:border-indigo-400"
              />
              <datalist id="subject-datalist">
                {sampleSubjects.map((s) => (
                  <option key={s} value={s} />
                ))}
              </datalist>
            </div>

            {/* 학년/반 */}
            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1">
                대상 학년 / 학급
              </label>
              <div className="flex items-center gap-2">
                <select
                  value={grade}
                  onChange={(e) => setGrade(Number(e.target.value))}
                  className="bg-slate-800 text-slate-100 text-xs px-2.5 py-2 rounded-xl border border-slate-700 w-1/2 focus:outline-none focus:border-indigo-400"
                >
                  {[1, 2, 3].map((g) => (
                    <option key={`g-${g}`} value={g}>
                      {g}학년
                    </option>
                  ))}
                </select>
                <select
                  value={classNum}
                  onChange={(e) => setClassNum(Number(e.target.value))}
                  className="bg-slate-800 text-slate-100 text-xs px-2.5 py-2 rounded-xl border border-slate-700 w-1/2 focus:outline-none focus:border-indigo-400"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((c) => (
                    <option key={`c-${c}`} value={c}>
                      {c}반
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* 마감일 & 시간 */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                마감일 <span className="text-rose-400">*</span>
              </label>
              <input
                type="date"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-slate-800 text-slate-100 text-xs px-3 py-2 rounded-xl border border-slate-700 focus:outline-none focus:border-indigo-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-indigo-400" />
                마감 시간
              </label>
              <input
                type="time"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
                className="w-full bg-slate-800 text-slate-100 text-xs px-3 py-2 rounded-xl border border-slate-700 focus:outline-none focus:border-indigo-400"
              />
            </div>
          </div>

          {/* 우선순위 */}
          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-1 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              우선순위
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPriority('high')}
                className={`py-1.5 text-xs font-semibold rounded-xl border transition-all ${
                  priority === 'high'
                    ? 'bg-rose-600 text-white border-rose-400 shadow-sm'
                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
                }`}
              >
                🔥 높음
              </button>
              <button
                type="button"
                onClick={() => setPriority('medium')}
                className={`py-1.5 text-xs font-semibold rounded-xl border transition-all ${
                  priority === 'medium'
                    ? 'bg-amber-600 text-white border-amber-400 shadow-sm'
                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
                }`}
              >
                ⚡ 보통
              </button>
              <button
                type="button"
                onClick={() => setPriority('low')}
                className={`py-1.5 text-xs font-semibold rounded-xl border transition-all ${
                  priority === 'low'
                    ? 'bg-slate-700 text-white border-slate-500 shadow-sm'
                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
                }`}
              >
                🌱 낮음
              </button>
            </div>
          </div>

          {/* 메모 */}
          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-1 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              메모 및 상세 요구사항
            </label>
            <textarea
              rows={3}
              placeholder="예: 제출 형식 PDF, 코드 첨부 및 실행 캡처본 포함 필수"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-800 text-slate-100 text-xs px-3 py-2 rounded-xl border border-slate-700 focus:outline-none focus:border-indigo-400 placeholder-slate-500 resize-none"
            />
          </div>

          {/* Footer Actions */}
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
              className="px-5 py-2 text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 rounded-xl shadow-md shadow-indigo-500/20 transition-all"
            >
              숙제 등록하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
