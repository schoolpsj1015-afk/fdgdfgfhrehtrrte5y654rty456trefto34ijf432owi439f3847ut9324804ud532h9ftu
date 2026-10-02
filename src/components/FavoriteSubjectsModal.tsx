import React, { useState } from 'react';
import { FavoriteSubject } from '../types';
import { X, Star, Plus, Trash2, BookmarkCheck, Sparkles } from 'lucide-react';

interface FavoriteSubjectsModalProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: FavoriteSubject[];
  onToggleFavorite: (subjectName: string) => void;
}

export const FavoriteSubjectsModal: React.FC<FavoriteSubjectsModalProps> = ({
  isOpen,
  onClose,
  favorites,
  onToggleFavorite,
}) => {
  const [newSubject, setNewSubject] = useState('');

  if (!isOpen) return null;

  const quickPresets = [
    '프로그래밍',
    '인공지능 일반',
    '컴퓨터 그래픽',
    '애니메이션 기초',
    '* 하드웨어 회로 설계',
    '* 하드웨어 성능 구현',
    '* SQL활용',
    '* 3D 애니메이팅',
    '* 드론 영상 촬영',
    '공통영어1',
    '공통수학1',
    '한국사'
  ];

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.trim()) return;
    onToggleFavorite(newSubject.trim());
    setNewSubject('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-500/20 border border-amber-500/30 text-amber-400 rounded-xl">
              <Star className="w-5 h-5 fill-amber-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">좋아하는 과목 관리</h3>
              <p className="text-xs text-slate-400">
                선호 과목을 추가하면 시간표와 캘린더에서 강조 표시됩니다.
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

        {/* Body */}
        <div className="p-5 space-y-4 text-xs">
          {/* Add Form */}
          <form onSubmit={handleAddCustom} className="flex gap-2">
            <input
              type="text"
              placeholder="추가할 과목명 입력 (예: 프로그래밍)"
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value)}
              className="flex-1 bg-slate-800 text-slate-100 text-xs px-3 py-2 rounded-xl border border-slate-700 focus:outline-none focus:border-amber-400 placeholder-slate-500"
            />
            <button
              type="submit"
              className="px-3.5 py-2 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-xl flex items-center gap-1 shadow-sm transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              추가
            </button>
          </form>

          {/* Quick Preset Buttons */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1.5 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              대진전자통신고 대표 과목 빠른 추가
            </label>
            <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto pr-1">
              {quickPresets.map((preset) => {
                const isFav = favorites.some(
                  (f) => f.name.trim().replace(/^\*\s*/, '') === preset.trim().replace(/^\*\s*/, '')
                );
                return (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => onToggleFavorite(preset)}
                    className={`px-2.5 py-1 text-[11px] rounded-lg border transition-all ${
                      isFav
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 font-semibold'
                        : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    {isFav ? '★ ' : '+ '}{preset}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Current Favorite List */}
          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-2 flex items-center justify-between">
              <span>내 선호 과목 목록 ({favorites.length}개)</span>
            </label>

            {favorites.length === 0 ? (
              <div className="text-center py-6 bg-slate-950/40 border border-dashed border-slate-800 rounded-xl text-slate-500 text-xs">
                등록된 선호 과목이 없습니다.
              </div>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                {favorites.map((fav) => (
                  <div
                    key={fav.name}
                    className="flex items-center justify-between p-2.5 bg-slate-800/80 border border-slate-700/80 rounded-xl"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: fav.color || '#f59e0b' }}
                      />
                      <span className="font-semibold text-slate-100">{fav.name}</span>
                    </div>

                    <button
                      onClick={() => onToggleFavorite(fav.name)}
                      className="p-1 text-slate-400 hover:text-rose-400 transition-colors"
                      title="삭제"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-slate-800 text-right">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
