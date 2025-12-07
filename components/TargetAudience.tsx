
import React from 'react';
import { UserPlus, Storefront, Buildings, PresentationChart, CaretRight } from 'phosphor-react';

const TARGETS = [
  {
    title: "예비 창업자",
    desc: "입지와 유동인구 기반 예상 매출 분석",
    icon: <UserPlus weight="duotone" size={32} />,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-900/20",
    hoverBorder: "group-hover:border-blue-200 dark:group-hover:border-blue-800"
  },
  {
    title: "소상공인/자영업자",
    desc: "매출 감소 원인 분석과 개선 솔루션 추천",
    icon: <Storefront weight="duotone" size={32} />,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-900/20",
    hoverBorder: "group-hover:border-emerald-200 dark:group-hover:border-emerald-800"
  },
  {
    title: "프랜차이즈 본사",
    desc: "전국 입지 점수화 및 위험 최소화 분석",
    icon: <Buildings weight="duotone" size={32} />,
    color: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-50 dark:bg-purple-900/20",
    hoverBorder: "group-hover:border-purple-200 dark:group-hover:border-purple-800"
  },
  {
    title: "상권·부동산 컨설턴트",
    desc: "데이터 기반 보고서 자동 생성",
    icon: <PresentationChart weight="duotone" size={32} />,
    color: "text-orange-600 dark:text-orange-400",
    bg: "bg-orange-50 dark:bg-orange-900/20",
    hoverBorder: "group-hover:border-orange-200 dark:group-hover:border-orange-800"
  }
];

const TargetAudience: React.FC = () => {
  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">누구를 위한 서비스인가?</h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
          데이터가 필요한 모든 순간, BizInsight AI가 성공적인 의사결정을 지원합니다.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {TARGETS.map((target, idx) => (
          <div 
            key={idx}
            className={`group relative p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 ${target.hoverBorder}`}
          >
            {/* Hover Gradient Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none`}></div>
            
            <div className="relative z-10">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 ${target.bg} ${target.color} group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                  {target.icon}
                </div>
                
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {target.title}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                  {target.desc}
                </p>
                
                <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-xs font-bold text-slate-400 group-hover:text-blue-500 transition-colors">
                  <span>맞춤 솔루션 확인</span>
                  <div className="w-6 h-6 rounded-full bg-slate-50 dark:bg-slate-700 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30 flex items-center justify-center">
                     <CaretRight weight="bold" />
                  </div>
                </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TargetAudience;
