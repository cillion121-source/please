
import React from 'react';
import { HistoryItem } from '../types';
import { X, ClockCounterClockwise, MapPin, MagnifyingGlass, Trash, ArrowRight, ChartBar, ThumbsUp } from 'phosphor-react';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onLoad: (item: HistoryItem) => void;
  onDelete: (id: string) => void;
}

const HistoryModal: React.FC<HistoryModalProps> = ({ isOpen, onClose, history, onLoad, onDelete }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-full max-w-2xl h-[80vh] flex flex-col overflow-hidden animate-fade-in border border-slate-200 dark:border-slate-700">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between bg-white dark:bg-slate-800 z-10">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                    <ClockCounterClockwise size={24} weight="fill" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white">분석 기록</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">저장된 상권 분석 및 입지 추천 내역입니다.</p>
                </div>
            </div>
            <button 
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
            >
                <X size={20} weight="bold" />
            </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-slate-50 dark:bg-slate-900/50">
            {history.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-60">
                    <ClockCounterClockwise size={64} weight="thin" className="mb-4" />
                    <p>저장된 기록이 없습니다.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {history.map((item) => {
                        const isAnalysis = item.type === 'analysis';
                        return (
                            <div 
                                key={item.id}
                                className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md hover:bg-blue-50/30 dark:hover:bg-slate-700/50 transition-all duration-200 group relative overflow-hidden cursor-pointer"
                                onClick={() => { onLoad(item); onClose(); }}
                            >
                                <div className="flex justify-between items-start gap-4 relative z-10">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className={`pl-1.5 pr-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide border flex items-center gap-1.5 w-fit ${
                                                isAnalysis 
                                                ? 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800' 
                                                : 'bg-purple-50 text-purple-700 border-purple-100 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800'
                                            }`}>
                                                {isAnalysis ? <ChartBar weight="fill" size={12} /> : <ThumbsUp weight="fill" size={12} />}
                                                {isAnalysis ? '상권분석' : '입지추천'}
                                            </span>
                                            <span className="text-xs text-slate-400 font-medium">{item.dateStr}</span>
                                        </div>
                                        <h3 className="font-bold text-slate-800 dark:text-white text-lg leading-tight mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                            {item.title}
                                        </h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-1">
                                            {isAnalysis ? <MapPin size={14} weight="fill" className="text-slate-400" /> : <MagnifyingGlass size={14} weight="bold" className="text-slate-400" />}
                                            {item.subtitle}
                                        </p>
                                    </div>
                                    
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
                                        className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors z-20"
                                        title="기록 삭제"
                                    >
                                        <Trash size={18} />
                                    </button>
                                </div>
                                
                                {/* Hover Arrow Indicator */}
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300 text-blue-500/20 pointer-events-none z-0">
                                    <ArrowRight size={80} weight="fill" />
                                </div>
                                <div className="absolute right-16 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-300 text-blue-600 dark:text-blue-400 pointer-events-none z-10">
                                    <ArrowRight size={24} weight="bold" />
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default HistoryModal;
