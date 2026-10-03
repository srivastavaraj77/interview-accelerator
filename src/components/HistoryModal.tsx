import React from 'react';
import { PerformanceReport } from '../types';
import { History, X, Trash2, ArrowRight, Award } from 'lucide-react';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedReports: PerformanceReport[];
  onSelectReport: (report: PerformanceReport) => void;
  onClearHistory: () => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  savedReports,
  onSelectReport,
  onClearHistory
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div className="glass-card rounded-2xl p-6 max-w-xl w-full border-slate-700/80 shadow-2xl relative max-h-[85vh] flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Interview Session History</h2>
            <p className="text-xs text-slate-400">Review your past mock interviews and track progress</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-3 pr-1 my-2">
          {savedReports.length === 0 ? (
            <div className="text-center py-10 text-slate-500 text-xs">
              No previous interviews completed yet. Complete an interview to view saved reports!
            </div>
          ) : (
            savedReports.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onSelectReport(item);
                  onClose();
                }}
                className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-850 cursor-pointer transition-all flex items-center justify-between group"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-white group-hover:text-indigo-300 transition-colors">
                      {item.roleTitle}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                      item.readiness === 'Strong Candidate'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                    }`}>
                      {item.readiness}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1 flex items-center gap-3">
                    <span>Date: {new Date(item.createdAt).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>Questions: {item.questionFeedbacks.length}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-lg font-black text-indigo-400 font-mono">
                      {item.overallScore}/100
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            ))
          )}
        </div>

        {savedReports.length > 0 && (
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <button
              onClick={onClearHistory}
              className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1.5 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-200 hover:bg-slate-700 transition-colors"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
