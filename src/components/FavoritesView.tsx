import React from 'react';
import { FavoriteSubject } from '../types';
import { Star, Plus, Trash2, BookmarkCheck, Sparkles, BookOpen } from 'lucide-react';

interface FavoritesViewProps {
  favorites: FavoriteSubject[];
  onOpenManageModal: () => void;
  onToggleFavorite: (subjectName: string) => void;
}

export const FavoritesView: React.FC<FavoritesViewProps> = ({
  favorites,
  onOpenManageModal,
  onToggleFavorite,
}) => {
  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-800/80 border border-slate-700/70 p-4 rounded-2xl shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-500/20 border border-amber-500/30 rounded-xl text-amber-400">
            <Star className="w-6 h-6 fill-amber-400" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              선호 과목 (좋아하는 과목)
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {favorites.length}개 등록됨
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              선호하는 전공 및 교과목을 등록해두면 시간표 및 캘린더에서 특수 배지와 색상으로 하이라이트됩니다.
            </p>
          </div>
        </div>

        <button
          onClick={onOpenManageModal}
          className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white text-xs font-bold rounded-xl shadow-md shadow-amber-500/20 transition-all whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          선호 과목 추가 / 관리
        </button>
      </div>

      {/* Grid of Favorites */}
      {favorites.length === 0 ? (
        <div className="text-center py-16 bg-slate-800/60 border border-dashed border-slate-700/80 rounded-2xl p-6">
          <BookmarkCheck className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-200">등록된 선호 과목이 없습니다.</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            시간표에서 과목 옆 별(★)을 누르거나 [선호 과목 추가] 버튼으로 관심 있는 과목을 즐겨찾기 해보세요.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {favorites.map((fav) => (
            <div
              key={fav.name}
              className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-4 shadow-xl flex items-center justify-between hover:border-amber-500/50 transition-all"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-md"
                  style={{ backgroundColor: fav.color || '#f59e0b' }}
                >
                  ★
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-100">{fav.name}</h3>
                  <p className="text-[11px] text-slate-400">대진전자통신고 선호 과목</p>
                </div>
              </div>

              <button
                onClick={() => onToggleFavorite(fav.name)}
                className="p-2 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-700/60 transition-colors"
                title="선호 과목 삭제"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
