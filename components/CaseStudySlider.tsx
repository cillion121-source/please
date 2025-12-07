
import React from 'react';
import { AnalysisInput } from '../types';
import { SAMPLE_SCENARIOS, BUSINESS_BACKGROUNDS } from '../constants';
import { ArrowRight, TrendUp, Lightning, Storefront } from 'phosphor-react';

interface CaseStudySliderProps {
  onScenarioSelect: (input: AnalysisInput) => void;
  compact?: boolean; // If true, renders a smaller version for the dashboard header
}

const CaseStudySlider: React.FC<CaseStudySliderProps> = ({ onScenarioSelect, compact = false }) => {
  return (
    <div className={`w-full relative z-10 overflow-hidden ${compact ? 'mb-6' : 'mb-32'}`}>
      {!compact && (
        <div className="text-center mb-10 px-4">
            <span className="text-blue-600 dark:text-blue-400 font-bold text-sm tracking-wider uppercase mb-2 block flex items-center justify-center gap-1">
                <Lightning weight="fill" /> Live Insights
            </span>
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white">실시간 분석 케이스</h3>
        </div>
      )}

      {compact && (
         <div className="px-1 mb-3 flex items-center gap-2 text-slate-500 dark:text-slate-400">
            <TrendUp weight="bold" className="text-blue-500"/>
            <span className="text-xs font-bold uppercase tracking-wider">다른 분석 사례 보기</span>
         </div>
      )}
      
      <div className="relative w-full group">
          {/* Gradient Masks */}
          <div className={`absolute left-0 top-0 bottom-0 bg-gradient-to-r from-slate-50 dark:from-slate-900 to-transparent z-20 pointer-events-none ${compact ? 'w-16' : 'w-32'}`}></div>
          <div className={`absolute right-0 top-0 bottom-0 bg-gradient-to-l from-slate-50 dark:from-slate-900 to-transparent z-20 pointer-events-none ${compact ? 'w-16' : 'w-32'}`}></div>

          {/* Slider Container */}
          <div className={`flex animate-scroll hover:pause w-max ${compact ? 'gap-4 px-4' : 'gap-6 px-6'}`}>
            {/* Double the list for infinite loop */}
            {[...SAMPLE_SCENARIOS, ...SAMPLE_SCENARIOS].map((scenario, idx) => {
                const bgImage = BUSINESS_BACKGROUNDS[scenario.input.businessType] || BUSINESS_BACKGROUNDS['default'];
                
                return (
                  <div 
                    key={`${idx}-${scenario.title}`}
                    onClick={() => onScenarioSelect(scenario.input as AnalysisInput)}
                    className={`relative rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] flex-shrink-0 group/card border border-slate-200 dark:border-slate-700
                        ${compact ? 'w-[240px] h-[140px]' : 'w-[300px] md:w-[400px] h-[250px] rounded-3xl'}
                    `}
                  >
                      {/* Dark Overlay */}
                      <div className={`absolute inset-0 z-10 transition-colors duration-300 ${compact ? 'bg-slate-900/60 group-hover/card:bg-slate-900/50' : 'bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent'}`}></div>
                      
                      {/* Background Image */}
                      <div 
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover/card:scale-110"
                        style={{ backgroundImage: `url('${bgImage}')` }}
                      ></div>
                      
                      {/* Content */}
                      <div className={`absolute inset-0 flex flex-col justify-end z-20 text-white ${compact ? 'p-4' : 'p-6'}`}>
                        <div className={`backdrop-blur-md w-fit rounded-full font-bold mb-auto border border-white/20 flex items-center gap-1.5 shadow-sm
                            ${compact ? 'text-[10px] px-2 py-0.5 bg-black/30' : 'bg-white/20 px-3 py-1 text-xs mb-3'}
                        `}>
                            {!compact && <Storefront size={12} weight="fill" />}
                            {scenario.input.businessType}
                        </div>

                        <h4 className={`font-bold leading-tight shadow-sm text-white ${compact ? 'text-sm mb-1' : 'text-xl mb-2'}`}>
                            {scenario.title}
                        </h4>
                        
                        {!compact && (
                            <p className="text-sm text-slate-200 line-clamp-2 opacity-90 mb-2">
                                {scenario.description}
                            </p>
                        )}

                        <div className={`flex items-center gap-1 text-blue-300 font-bold opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 ${compact ? 'text-[10px]' : 'text-xs'}`}>
                            분석 보기 <ArrowRight />
                        </div>
                      </div>
                  </div>
                );
            })}
          </div>
      </div>
    </div>
  );
};

export default CaseStudySlider;
