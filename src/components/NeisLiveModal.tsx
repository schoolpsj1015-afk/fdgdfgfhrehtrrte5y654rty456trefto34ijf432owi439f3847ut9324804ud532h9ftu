import React, { useState } from 'react';
import { UserClassSelection } from '../types';
import { SCHOOL_INFO } from '../data/timetableData';
import { X, Radio, Search, RefreshCw, CheckCircle2, AlertCircle, ExternalLink } from 'lucide-react';

interface NeisLiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  selection: UserClassSelection;
}

interface NeisTimetableItem {
  ALL_CLASS_BA_DATA: string;
  GRADE: string;
  CLASS_NM: string;
  PERIO: string;
  ITRT_CNTNT: string;
}

export const NeisLiveModal: React.FC<NeisLiveModalProps> = ({
  isOpen,
  onClose,
  selection,
}) => {
  const [targetDate, setTargetDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<NeisTimetableItem[] | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFetchNeis = async () => {
    setLoading(true);
    setErrorMsg(null);
    setResults(null);

    const formattedDate = targetDate.replace(/-/g, '');
    const apiKey = 'sample'; // Open NEIS public key or CORS proxy
    const url = `https://open.neis.go.kr/hub/hisTimetable?Type=json&pIndex=1&pSize=100&ATPT_OFCDC_SC_CODE=${SCHOOL_INFO.officeCode}&SD_SCHUL_CODE=${SCHOOL_INFO.schoolCode}&ALL_TI_YMD=${formattedDate}&GRADE=${selection.grade}&CLASS_NM=${selection.classNum}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.hisTimetable && data.hisTimetable[1] && data.hisTimetable[1].row) {
        const rows: NeisTimetableItem[] = data.hisTimetable[1].row;
        setResults(rows);
      } else if (data.RESULT) {
        setErrorMsg(`[NEIS 응답] ${data.RESULT.MESSAGE || '해당 날짜의 시간표 데이터가 없습니다.'}`);
      } else {
        setErrorMsg('NEIS 서버 응답 데이터 형식이 올바르지 않습니다.');
      }
    } catch (err: any) {
      console.error('NEIS API fetch error', err);
      setErrorMsg('NEIS API 호출 중 네트워크 통신 오류가 발생하였습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-xl">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                나이스 (NEIS) 실시간 시간표 연동
              </h3>
              <p className="text-xs text-slate-400">
                교육청 표준 행정코드({SCHOOL_INFO.schoolCode}) 대진전자통신고등학교 API
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
          {/* Controls */}
          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 space-y-3">
            <div className="flex items-center justify-between text-slate-300">
              <span className="font-semibold">조회 대상:</span>
              <span className="text-emerald-400 font-bold">
                {selection.grade}학년 {selection.classNum}반 ({selection.department})
              </span>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="flex-1 bg-slate-900 text-slate-100 text-xs px-3 py-2 rounded-xl border border-slate-600 focus:outline-none focus:border-emerald-400"
              />
              <button
                onClick={handleFetchNeis}
                disabled={loading}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all disabled:opacity-50"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
                조회하기
              </button>
            </div>
          </div>

          {/* Error Notice */}
          {errorMsg && (
            <div className="p-3 bg-rose-950/40 border border-rose-500/30 text-rose-300 rounded-xl flex items-start gap-2 text-xs">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Results List */}
          {results && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-300 font-semibold">
                <span className="flex items-center gap-1 text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                  NEIS 실시간 시간표 응답 완료 ({results.length}건)
                </span>
              </div>

              <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1 custom-scrollbar">
                {results.map((r, i) => (
                  <div
                    key={`neis-row-${i}`}
                    className="flex items-center justify-between p-2.5 bg-slate-800/80 border border-slate-700/80 rounded-xl"
                  >
                    <span className="font-bold text-indigo-300 w-16">
                      {r.PERIO}교시
                    </span>
                    <span className="font-semibold text-slate-100 flex-1 text-center">
                      {r.ITRT_CNTNT}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {r.GRADE}학년 {r.CLASS_NM}반
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* NEIS Portal Info */}
          <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl text-[11px] text-slate-400 flex items-center justify-between">
            <span>출처: 교육부 나이스 열린교육행정포털</span>
            <a
              href="https://open.neis.go.kr/portal/data/service/selectServicePage.do?page=1&rows=10&sortColumn=&sortDirection=&infId=OPEN18620200826103326268120&infSeq=2"
              target="_blank"
              rel="noreferrer"
              className="text-emerald-400 hover:underline flex items-center gap-0.5 font-medium"
            >
              원본 서비스 <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Footer */}
          <div className="pt-2 text-right">
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
