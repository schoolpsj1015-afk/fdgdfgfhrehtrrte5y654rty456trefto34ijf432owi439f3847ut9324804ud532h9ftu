import React, { useState } from 'react';
import {
  getStoredNeisApiKey,
  saveStoredNeisApiKey,
  SCHOOL_INFO
} from '../data/timetableData';
import { X, Key, ExternalLink, Check, ShieldCheck, Sparkles, HelpCircle } from 'lucide-react';

interface NeisKeySettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKeySaved: () => void;
}

export const NeisKeySettingsModal: React.FC<NeisKeySettingsModalProps> = ({
  isOpen,
  onClose,
  onKeySaved,
}) => {
  const [apiKey, setApiKey] = useState(() => getStoredNeisApiKey());
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveStoredNeisApiKey(apiKey);
    setSavedSuccess(true);
    onKeySaved();
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 rounded-xl">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">나이스(NEIS) Open API 키 설정</h3>
              <p className="text-xs text-slate-400">
                2026년, 2027년 및 미래 실시간 시간표 연동을 위한 개발자 인증키 설정
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

        {/* Content */}
        <form onSubmit={handleSave} className="p-5 space-y-4 text-xs">
          {/* Notice info */}
          <div className="p-3 bg-indigo-950/60 border border-indigo-500/30 rounded-xl text-indigo-200 leading-relaxed space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-indigo-300">
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
              <span>학교별 API Key가 아닌 개인 인증키 구조 안내</span>
            </div>
            <p className="text-[11px] text-slate-300">
              나이스 교육정보 개방 포털은 <strong>학교 전용 API Key를 별도로 발행하지 않으며</strong>, 누구나
              <strong className="text-emerald-400"> [open.neis.go.kr]</strong>에서 무료로 발급받은 개인 인증키로 대진전자통신고등학교(행정코드: {SCHOOL_INFO.schoolCode})의 실시간 시간표 데이터를 조회할 수 있습니다.
            </p>
          </div>

          {/* Key Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-1 flex items-center justify-between">
              <span>나이스 인증키 (API Key)</span>
              <a
                href="https://open.neis.go.kr"
                target="_blank"
                rel="noreferrer"
                className="text-emerald-400 hover:underline flex items-center gap-0.5 text-[11px]"
              >
                인증키 무료 발급 <ExternalLink className="w-3 h-3" />
              </a>
            </label>

            <input
              type="text"
              placeholder="예: c703b41fb377484488820f4c28f114df (미입력 시 공개 키 연동)"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full bg-slate-800 text-slate-100 text-xs font-mono px-3 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-indigo-400 placeholder-slate-500"
            />
          </div>

          {/* Explanation Box */}
          <div className="p-3 bg-slate-800/80 border border-slate-700 rounded-xl space-y-1.5">
            <span className="font-bold text-slate-200 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              2026년 / 2027년 실시간 동기화 동작 방식
            </span>
            <ul className="list-disc list-inside text-[11px] text-slate-400 space-y-1 pl-1">
              <li>
                시스템 날짜(`new Date()`) 기준으로 <strong className="text-slate-200">학년도(AY)와 학기(SEM)</strong>를 자동으로 실시간 계산합니다.
              </li>
              <li>
                2026년, 2027년 및 그 이후 미래 날짜 선택 시 자동으로 해당 연도의 나이스 Open API 엔드포인트를 호출합니다.
              </li>
              <li>
                학교 수업 일정 변경, 개학, 방학 등 변경사항이 발생해도 실시간으로 반영됩니다.
              </li>
            </ul>
          </div>

          {/* Success Message */}
          {savedSuccess && (
            <div className="p-2.5 bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 rounded-xl flex items-center justify-center gap-2 font-semibold animate-fade-in">
              <Check className="w-4 h-4 text-emerald-400" />
              API Key가 성공적으로 저장되었습니다!
            </div>
          )}

          {/* Footer Buttons */}
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
              저장 및 적용
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
