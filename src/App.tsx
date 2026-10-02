import React, { useState } from 'react';
import {
  UserClassSelection,
  HomeworkItem,
  AfterSchoolItem,
  FavoriteSubject
} from './types';
import { LocalDatabase } from './db/localDb';
import { Header } from './components/Header';
import { TimetableGrid } from './components/TimetableGrid';
import { CalendarView } from './components/CalendarView';
import { AfterSchoolView } from './components/AfterSchoolView';
import { FavoritesView } from './components/FavoritesView';
import { HomeworkModal } from './components/HomeworkModal';
import { AfterSchoolModal } from './components/AfterSchoolModal';
import { FavoriteSubjectsModal } from './components/FavoriteSubjectsModal';
import { NeisLiveModal } from './components/NeisLiveModal';
import { NeisKeySettingsModal } from './components/NeisKeySettingsModal';

import {
  Download,
  Upload,
  RotateCcw,
  CheckCircle2,
  BookOpen,
  Clock,
  Star,
  Sparkles
} from 'lucide-react';

export default function App() {
  // Local DB state
  const [userClass, setUserClass] = useState<UserClassSelection>(() =>
    LocalDatabase.getUserClass()
  );
  const [homeworks, setHomeworks] = useState<HomeworkItem[]>(() =>
    LocalDatabase.getHomeworks()
  );
  const [afterSchools, setAfterSchools] = useState<AfterSchoolItem[]>(() =>
    LocalDatabase.getAfterSchools()
  );
  const [favoriteSubjects, setFavoriteSubjects] = useState<FavoriteSubject[]>(() =>
    LocalDatabase.getFavoriteSubjects()
  );

  // Active View Tab
  const [activeTab, setActiveTab] = useState<'timetable' | 'calendar' | 'afterschool' | 'favorites'>('timetable');

  // Modal States
  const [isHomeworkModalOpen, setIsHomeworkModalOpen] = useState(false);
  const [presetSubject, setPresetSubject] = useState<string | undefined>();
  const [presetDate, setPresetDate] = useState<string | undefined>();

  const [isAfterSchoolModalOpen, setIsAfterSchoolModalOpen] = useState(false);
  const [isFavoritesModalOpen, setIsFavoritesModalOpen] = useState(false);
  const [isNeisModalOpen, setIsNeisModalOpen] = useState(false);
  const [isNeisKeyModalOpen, setIsNeisKeyModalOpen] = useState(false);

  // Toast Notice State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Class Selection Handler
  const handleUserClassChange = (newSel: UserClassSelection) => {
    setUserClass(newSel);
    LocalDatabase.saveUserClass(newSel);
    showToast(`${newSel.grade}학년 ${newSel.classNum}반 (${newSel.department}) 선택 변경되었습니다.`);
  };

  // Homework Handlers
  const handleAddHomework = (hw: Omit<HomeworkItem, 'id' | 'createdAt'>) => {
    const newItem = LocalDatabase.addHomework(hw);
    setHomeworks(LocalDatabase.getHomeworks());
    showToast(`숙제 "${newItem.title}" 등록이 완료되었습니다.`);
  };

  const handleToggleHomework = (id: string) => {
    const updated = LocalDatabase.toggleHomeworkComplete(id);
    setHomeworks(LocalDatabase.getHomeworks());
    if (updated) {
      showToast(updated.completed ? '과제를 완료 처리하였습니다.' : '과제를 미완료 상태로 변경했습니다.');
    }
  };

  const handleDeleteHomework = (id: string) => {
    LocalDatabase.deleteHomework(id);
    setHomeworks(LocalDatabase.getHomeworks());
    showToast('숙제 기록이 삭제되었습니다.');
  };

  const handleQuickAddHomework = (subject: string, date: string) => {
    setPresetSubject(subject);
    setPresetDate(date);
    setIsHomeworkModalOpen(true);
  };

  // After-School Handlers
  const handleAddAfterSchool = (item: Omit<AfterSchoolItem, 'id'>) => {
    const newAfter = LocalDatabase.addAfterSchool(item);
    setAfterSchools(LocalDatabase.getAfterSchools());
    setHomeworks(LocalDatabase.getHomeworks());
    showToast(`방과후 "${newAfter.name}" 이(가) 등록되었습니다.`);
  };

  const handleDeleteAfterSchool = (id: string) => {
    LocalDatabase.deleteAfterSchool(id);
    setAfterSchools(LocalDatabase.getAfterSchools());
    showToast('방과후 프로그램이 삭제되었습니다.');
  };

  // Favorite Subject Handlers
  const handleToggleFavorite = (subjectName: string) => {
    const isNowFav = LocalDatabase.toggleFavoriteSubject(subjectName);
    setFavoriteSubjects(LocalDatabase.getFavoriteSubjects());
    showToast(isNowFav ? `"${subjectName}"을(를) 선호 과목으로 등록했습니다.` : `"${subjectName}" 선호 과목 해제`);
  };

  // Data Reset & Backup
  const handleResetData = () => {
    if (window.confirm('로컬 DB 데이터를 초기 상태로 리셋하시겠습니까? (이 작업은 취소할 수 없습니다)')) {
      LocalDatabase.resetToDefault();
      setUserClass(LocalDatabase.getUserClass());
      setHomeworks(LocalDatabase.getHomeworks());
      setAfterSchools(LocalDatabase.getAfterSchools());
      setFavoriteSubjects(LocalDatabase.getFavoriteSubjects());
      showToast('로컬 DB 데이터가 성공적으로 초기화되었습니다.');
    }
  };

  const handleExportData = () => {
    const jsonStr = LocalDatabase.exportFullData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `대진전자통신고_학사데이터_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('DB 데이터가 JSON 파일로 내보내기되었습니다.');
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content && LocalDatabase.importFullData(content)) {
        setUserClass(LocalDatabase.getUserClass());
        setHomeworks(LocalDatabase.getHomeworks());
        setAfterSchools(LocalDatabase.getAfterSchools());
        setFavoriteSubjects(LocalDatabase.getFavoriteSubjects());
        showToast('JSON 데이터 복원이 완료되었습니다.');
      } else {
        alert('올바르지 않은 JSON 파일 형식입니다.');
      }
    };
    reader.readAsText(file);
  };

  const favoriteNames = favoriteSubjects.map((f) => f.name);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-['Noto_Sans_KR',sans-serif]">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-indigo-600 text-white px-4 py-2.5 rounded-2xl shadow-2xl border border-indigo-400/50 text-xs font-semibold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <Header
        selection={userClass}
        onSelectionChange={handleUserClassChange}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenHomeworkModal={() => {
          setPresetSubject(undefined);
          setPresetDate(undefined);
          setIsHomeworkModalOpen(true);
        }}
        onOpenAfterSchoolModal={() => setIsAfterSchoolModalOpen(true)}
        onOpenNeisModal={() => setIsNeisModalOpen(true)}
        onOpenNeisKeyModal={() => setIsNeisKeyModalOpen(true)}
      />

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Quick Info Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div
            onClick={() => setActiveTab('timetable')}
            className="p-3 bg-slate-800/80 border border-slate-700/80 rounded-2xl cursor-pointer hover:border-indigo-500/50 transition-all flex items-center gap-3"
          >
            <div className="p-2 bg-indigo-600/20 text-indigo-400 rounded-xl">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-medium">선택 학급</p>
              <p className="text-xs font-bold text-white">
                {userClass.grade}학년 {userClass.classNum}반 ({userClass.department})
              </p>
            </div>
          </div>

          <div
            onClick={() => setActiveTab('calendar')}
            className="p-3 bg-slate-800/80 border border-slate-700/80 rounded-2xl cursor-pointer hover:border-indigo-500/50 transition-all flex items-center gap-3"
          >
            <div className="p-2 bg-rose-600/20 text-rose-400 rounded-xl">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-medium">미완료 숙제</p>
              <p className="text-xs font-bold text-rose-300">
                {homeworks.filter((h) => !h.completed).length}개 남아있음
              </p>
            </div>
          </div>

          <div
            onClick={() => setActiveTab('afterschool')}
            className="p-3 bg-slate-800/80 border border-slate-700/80 rounded-2xl cursor-pointer hover:border-indigo-500/50 transition-all flex items-center gap-3"
          >
            <div className="p-2 bg-cyan-600/20 text-cyan-400 rounded-xl">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-medium">방과후 활동</p>
              <p className="text-xs font-bold text-cyan-300">
                {afterSchools.length}개 수강중
              </p>
            </div>
          </div>

          <div
            onClick={() => setActiveTab('favorites')}
            className="p-3 bg-slate-800/80 border border-slate-700/80 rounded-2xl cursor-pointer hover:border-indigo-500/50 transition-all flex items-center gap-3"
          >
            <div className="p-2 bg-amber-600/20 text-amber-400 rounded-xl">
              <Star className="w-4 h-4 fill-amber-400" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-medium">선호 과목</p>
              <p className="text-xs font-bold text-amber-300">
                {favoriteSubjects.length}개 과목 등록
              </p>
            </div>
          </div>
        </div>

        {/* Tab 1: Timetable View */}
        {activeTab === 'timetable' && (
          <TimetableGrid
            selection={userClass}
            favoriteSubjects={favoriteNames}
            onToggleFavorite={handleToggleFavorite}
            onQuickAddHomework={handleQuickAddHomework}
            homeworks={homeworks}
            afterSchools={afterSchools}
          />
        )}

        {/* Tab 2: Calendar & Homework Panel View */}
        {activeTab === 'calendar' && (
          <CalendarView
            selection={userClass}
            homeworks={homeworks}
            afterSchools={afterSchools}
            favoriteSubjects={favoriteNames}
            onToggleCompleteHomework={handleToggleHomework}
            onDeleteHomework={handleDeleteHomework}
            onOpenAddHomeworkModal={(pDate) => {
              setPresetSubject(undefined);
              setPresetDate(pDate);
              setIsHomeworkModalOpen(true);
            }}
            onOpenAddAfterSchoolModal={() => setIsAfterSchoolModalOpen(true)}
          />
        )}

        {/* Tab 3: After School View */}
        {activeTab === 'afterschool' && (
          <AfterSchoolView
            afterSchools={afterSchools}
            selection={userClass}
            onOpenAddModal={() => setIsAfterSchoolModalOpen(true)}
            onDeleteAfterSchool={handleDeleteAfterSchool}
          />
        )}

        {/* Tab 4: Favorites Manager View */}
        {activeTab === 'favorites' && (
          <FavoritesView
            favorites={favoriteSubjects}
            onOpenManageModal={() => setIsFavoritesModalOpen(true)}
            onToggleFavorite={handleToggleFavorite}
          />
        )}
      </main>

      {/* Footer & DB Utilities */}
      <footer className="mt-auto border-t border-slate-800 bg-slate-950/80 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-200">대진전자통신고등학교</span>
            <span>·</span>
            <span>부산광역시 금정구 장전로 62</span>
            <span>·</span>
            <span className="text-emerald-400 font-mono text-[11px]">2026/2027 NEIS API 실시간 연동</span>
          </div>

          {/* Local DB Management Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleExportData}
              className="flex items-center gap-1 text-slate-400 hover:text-indigo-300 transition-colors"
              title="로컬 DB 백업 JSON 다운로드"
            >
              <Download className="w-3.5 h-3.5" />
              DB 백업
            </button>

            <label
              className="flex items-center gap-1 text-slate-400 hover:text-indigo-300 transition-colors cursor-pointer"
              title="JSON 백업 파일 복원"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>DB 복원</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImportData}
                className="hidden"
              />
            </label>

            <button
              onClick={handleResetData}
              className="flex items-center gap-1 text-slate-500 hover:text-rose-400 transition-colors"
              title="로컬 DB 초기화"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              DB 초기화
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <HomeworkModal
        isOpen={isHomeworkModalOpen}
        onClose={() => setIsHomeworkModalOpen(false)}
        selection={userClass}
        presetSubject={presetSubject}
        presetDate={presetDate}
        onAddHomework={handleAddHomework}
      />

      <AfterSchoolModal
        isOpen={isAfterSchoolModalOpen}
        onClose={() => setIsAfterSchoolModalOpen(false)}
        selection={userClass}
        onAddAfterSchool={handleAddAfterSchool}
      />

      <FavoriteSubjectsModal
        isOpen={isFavoritesModalOpen}
        onClose={() => setIsFavoritesModalOpen(false)}
        favorites={favoriteSubjects}
        onToggleFavorite={handleToggleFavorite}
      />

      <NeisLiveModal
        isOpen={isNeisModalOpen}
        onClose={() => setIsNeisModalOpen(false)}
        selection={userClass}
      />

      <NeisKeySettingsModal
        isOpen={isNeisKeyModalOpen}
        onClose={() => setIsNeisKeyModalOpen(false)}
        onKeySaved={() => showToast('NEIS API Key가 저장되었습니다.')}
      />
    </div>
  );
}
