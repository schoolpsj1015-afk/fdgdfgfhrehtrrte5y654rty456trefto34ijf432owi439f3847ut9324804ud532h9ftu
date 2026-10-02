import React from 'react';
import { UserClassSelection } from '../types';
import { getDepartmentForClass } from '../data/timetableData';
import { Sparkles, GraduationCap } from 'lucide-react';

interface ClassSelectorProps {
  selection: UserClassSelection;
  onChange: (newSelection: UserClassSelection) => void;
  compact?: boolean;
}

export const ClassSelector: React.FC<ClassSelectorProps> = ({
  selection,
  onChange,
  compact = false,
}) => {
  const grades = [1, 2, 3];
  const classes = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const handleGradeChange = (grade: number) => {
    const dept = getDepartmentForClass(grade, selection.classNum);
    onChange({ ...selection, grade, department: dept });
  };

  const handleClassChange = (classNum: number) => {
    const dept = getDepartmentForClass(selection.grade, classNum);
    onChange({ ...selection, classNum, department: dept });
  };

  return (
    <div
      className={`flex flex-wrap items-center gap-2 bg-slate-800/90 border border-slate-700/80 p-1.5 sm:p-2 rounded-xl backdrop-blur-md shadow-lg transition-all ${
        compact ? 'text-xs' : 'text-sm'
      }`}
    >
      {/* Grade Segmented Control */}
      <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-lg border border-slate-700/50">
        <span className="hidden sm:inline-flex items-center gap-1 px-1.5 text-xs font-semibold text-slate-400">
          <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
          학년
        </span>
        {grades.map((g) => {
          const isActive = selection.grade === g;
          return (
            <button
              key={`grade-${g}`}
              onClick={() => handleGradeChange(g)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-500 to-blue-600 text-white shadow-md shadow-indigo-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {g}학년
            </button>
          );
        })}
      </div>

      <div className="h-4 w-[1px] bg-slate-700 hidden sm:block"></div>

      {/* Class Selector Dropdown or Pills */}
      <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-lg border border-slate-700/50">
        <span className="hidden sm:inline-block px-1.5 text-xs font-semibold text-slate-400">
          학급
        </span>
        <select
          value={selection.classNum}
          onChange={(e) => handleClassChange(Number(e.target.value))}
          className="bg-slate-800 text-slate-100 text-xs font-medium px-2.5 py-1 rounded-md border border-slate-600 focus:outline-none focus:border-indigo-400 cursor-pointer"
        >
          {classes.map((c) => (
            <option key={`class-${c}`} value={c}>
              {c}반
            </option>
          ))}
        </select>
      </div>

      {/* Department Badge */}
      <div className="flex items-center gap-1.5 px-2.5 py-1 bg-indigo-950/60 border border-indigo-500/30 text-indigo-300 text-xs font-medium rounded-lg">
        <Sparkles className="w-3 h-3 text-indigo-400 animate-pulse" />
        <span className="font-semibold">{selection.department}</span>
      </div>
    </div>
  );
};
