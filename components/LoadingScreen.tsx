
import React from 'react';
import { LoadingStage } from '../types';
import { CircleNotch, CheckCircle, Brain, UsersThree, Storefront, ChartLineUp, FileText } from 'phosphor-react';

interface LoadingScreenProps {
  stage: LoadingStage;
}

const STEPS = [
  { id: LoadingStage.ANALYZING_TRAFFIC, label: "유동인구 데이터 분석", icon: <UsersThree size={24} />, description: "주변 유동인구 패턴과 인구 통계 정보를 수집하고 있습니다." },
  { id: LoadingStage.CHECKING_COMPETITION, label: "경쟁 업체 및 상권 탐색", icon: <Storefront size={24} />, description: "반경 500m 내 동종 업계 경쟁 현황을 파악 중입니다." },
  { id: LoadingStage.CALCULATING_REVENUE, label: "예상 매출 시뮬레이션", icon: <ChartLineUp size={24} />, description: "수집된 데이터를 기반으로 월 매출 범위를 예측합니다." },
  { id: LoadingStage.FINALIZING, label: "종합 리포트 생성", icon: <FileText size={24} />, description: "분석 결과를 정리하여 리포트를 작성하고 있습니다." },
];

const LoadingScreen: React.FC<LoadingScreenProps> = ({ stage }) => {
  const currentStepIndex = STEPS.findIndex(s => s.id === stage);
  const isComplete = stage === LoadingStage.COMPLETE;

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 max-w-2xl mx-auto w-full">
      <div className="mb-8 relative">
        <div className="absolute inset-0 bg-blue-500 blur-[40px] opacity-20 rounded-full animate-pulse"></div>
        <div className="relative z-10 bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-xl border border-blue-100 dark:border-blue-900/30 animate-bounce-slow">
           <Brain size={64} weight="duotone" className="text-blue-600 dark:text-blue-400" />
        </div>
      </div>
      
      <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2 text-center animate-fade-in">
        AI가 상권을 분석하고 있습니다
      </h2>
      <p className="text-slate-500 dark:text-slate-400 mb-8 text-center text-sm">
        잠시만 기다려주세요. 약 10~15초 정도 소요됩니다.
      </p>

      <div className="w-full space-y-3">
        {STEPS.map((step, index) => {
          let status: 'waiting' | 'active' | 'completed' = 'waiting';
          
          if (isComplete) {
            status = 'completed';
          } else if (currentStepIndex === -1) {
            status = 'waiting';
          } else if (index < currentStepIndex) {
            status = 'completed';
          } else if (index === currentStepIndex) {
            status = 'active';
          }

          return (
            <div 
              key={step.id} 
              className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-500 ${
                status === 'active' 
                  ? 'bg-white dark:bg-slate-800 border-blue-500 shadow-lg scale-102 ring-1 ring-blue-500' 
                  : status === 'completed'
                  ? 'bg-blue-50 dark:bg-slate-800/50 border-blue-100 dark:border-slate-700'
                  : 'bg-slate-50 dark:bg-slate-900/50 border-transparent opacity-60'
              }`}
            >
              <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                status === 'active' ? 'bg-blue-100 text-blue-600' : 
                status === 'completed' ? 'bg-green-100 text-green-600' : 'bg-slate-200 text-slate-400'
              }`}>
                {status === 'active' ? <CircleNotch size={20} className="animate-spin" /> :
                 status === 'completed' ? <CheckCircle size={20} weight="fill" /> :
                 step.icon}
              </div>
              
              <div className="flex-1">
                <h4 className={`font-bold text-sm ${status === 'active' ? 'text-blue-700 dark:text-blue-400' : 'text-slate-700 dark:text-slate-300'}`}>
                  {step.label}
                </h4>
                <div className={`overflow-hidden transition-all duration-500 ${status === 'active' ? 'max-h-20 opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {step.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LoadingScreen;
