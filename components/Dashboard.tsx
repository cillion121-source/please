
import React, { useState } from 'react';
import { AnalysisResult, FactorScore, RiskItem, OpportunityItem, StrategyPhase, RecommendationResult, RecommendedLocation, SourceLink, RentalAnalysis, GrowthPrediction, RealTimeAlert } from '../types';
import { CustomChart } from './Charts';
import { TrendUp, Info, CheckCircle, Warning, MapPin, CurrencyKrw, Users, Lightbulb, Storefront, Target, Clock, Megaphone, ArrowLeft, Money, ChartBar, Handshake, Car, ThumbsUp, BellRinging, ChartLineUp } from 'phosphor-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart, Line, Bar, LabelList } from 'recharts';

interface DashboardProps {
  result?: AnalysisResult;
  recommendationResult?: RecommendationResult;
  address?: string;
  businessType?: string;
  onBack?: () => void;
}

const SourcesSection: React.FC<{ sources?: SourceLink[] }> = ({ sources }) => {
  return (
    <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 mt-8 break-inside-avoid print:break-inside-avoid">
      <h4 className="font-bold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2 text-sm">
        <Info size={18} className="text-blue-500" weight="fill" /> 데이터 출처 및 고지사항
      </h4>
      <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
        본 리포트의 상권 시설 정보와 경쟁 현황은 <strong>Google Maps</strong>의 실시간 데이터와 <strong>공공데이터포털</strong>, <strong>국토교통부 실거래가</strong>를 기반으로 합니다.
        유동인구, 배후수요, 매출 시뮬레이션은 AI의 분석 모델에 의해 추정된 결과입니다. 
        실제 수치와 차이가 있을 수 있으므로 투자 결정 시 참고 자료로만 활용하시기 바랍니다.
      </p>
      {sources && sources.length > 0 && (
        <div>
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">참조된 데이터 소스:</p>
            <div className="flex flex-wrap gap-2">
            {sources.map((s, i) => (
                <a key={i} href={s.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors shadow-sm">
                <MapPin size={12} weight="fill" className="text-slate-400" />
                {s.title}
                </a>
            ))}
            </div>
        </div>
      )}
    </div>
  );
};

const RealTimeAlertsSection: React.FC<{ alerts?: RealTimeAlert[] }> = ({ alerts }) => {
  if (!alerts || alerts.length === 0) return null;

  return (
    <div className="bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-100 dark:border-red-900/30 p-4 mb-6 animate-fade-in break-inside-avoid">
      <h3 className="text-red-700 dark:text-red-400 font-bold flex items-center gap-2 mb-3 text-sm">
        <BellRinging size={20} weight="fill" className="animate-pulse" /> 실시간 상권 변동 알림
      </h3>
      <div className="space-y-3">
        {alerts.map((alert) => (
           <div key={alert.id} className="bg-white dark:bg-slate-800 p-3 rounded-lg border border-red-100 dark:border-red-900/20 shadow-sm flex flex-col md:flex-row gap-3 md:items-center">
              <div className="flex-1">
                 <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${alert.severity === 'high' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
                       {alert.type}
                    </span>
                    <span className="text-xs text-slate-400">{alert.timestamp}</span>
                    <span className="text-xs text-slate-400">• {alert.source}</span>
                 </div>
                 <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{alert.message}</p>
                 <p className="text-xs text-red-600 dark:text-red-400 mt-0.5">⚠️ 예상 영향: {alert.impact}</p>
              </div>
              <div className="md:border-l border-slate-100 dark:border-slate-700 md:pl-3 md:w-1/3">
                 <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">권장 조치:</p>
                 <p className="text-xs text-slate-700 dark:text-slate-300">{alert.action}</p>
              </div>
           </div>
        ))}
      </div>
    </div>
  );
};

const RentalAnalysisSection: React.FC<{ rentalData?: RentalAnalysis }> = ({ rentalData }) => {
  const [activeTab, setActiveTab] = useState<'stats' | 'negotiation'>('stats');

  if (!rentalData) return null;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700 overflow-hidden break-inside-avoid h-full">
       <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800">
          <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
             <Money size={20} className="text-green-500" weight="fill"/> 임대료 정밀 분석 (반경 {rentalData.radius})
          </h3>
          <div className="flex bg-slate-200 dark:bg-slate-700 rounded-lg p-1 text-xs font-bold">
             <button onClick={() => setActiveTab('stats')} className={`px-3 py-1.5 rounded-md transition-all ${activeTab === 'stats' ? 'bg-white dark:bg-slate-600 text-slate-800 dark:text-white shadow-sm' : 'text-slate-500'}`}>통계/추세</button>
             <button onClick={() => setActiveTab('negotiation')} className={`px-3 py-1.5 rounded-md transition-all ${activeTab === 'negotiation' ? 'bg-white dark:bg-slate-600 text-slate-800 dark:text-white shadow-sm' : 'text-slate-500'}`}>협상전략</button>
          </div>
       </div>

       <div className="p-6">
          {activeTab === 'stats' ? (
             <div className="flex flex-col lg:flex-row gap-6">
                {/* Left Column: Key Stats */}
                <div className="w-full lg:w-1/3 flex flex-col gap-4">
                   {/* 1. Average Rent */}
                   <div className="bg-green-50 dark:bg-green-900/10 p-5 rounded-xl border border-green-100 dark:border-green-900/30 shadow-sm relative overflow-hidden">
                      <div className="absolute right-0 top-0 p-3 opacity-10">
                         <Money size={60} weight="duotone" className="text-green-600"/>
                      </div>
                      <p className="text-xs text-green-700 dark:text-green-400 font-bold mb-1 uppercase tracking-wide">평균 월세 (평당)</p>
                      <p className="text-2xl font-extrabold text-slate-800 dark:text-white mb-2">{rentalData.stats.currentMean.toLocaleString()}만원</p>
                      <div className="flex items-center gap-2 text-xs font-medium">
                         <span className={`px-1.5 py-0.5 rounded ${rentalData.stats.monthlyChangeRate > 0 ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                           {rentalData.stats.monthlyChangeRate > 0 ? '▲' : '▼'} {Math.abs(rentalData.stats.monthlyChangeRate)}%
                         </span>
                         <span className="text-slate-400">전월 대비</span>
                      </div>
                   </div>

                   {/* 2. Average Deposit - New Highlighted Section */}
                   <div className="bg-blue-50 dark:bg-blue-900/10 p-5 rounded-xl border border-blue-100 dark:border-blue-900/30 shadow-sm relative overflow-hidden">
                      <div className="absolute right-0 top-0 p-3 opacity-10">
                         <Handshake size={60} weight="duotone" className="text-blue-600"/>
                      </div>
                      <p className="text-xs text-blue-700 dark:text-blue-400 font-bold mb-1 uppercase tracking-wide">평균 보증금 (평당)</p>
                      <p className="text-2xl font-extrabold text-slate-800 dark:text-white mb-2">
                        {rentalData.stats.averageDeposit ? rentalData.stats.averageDeposit.toLocaleString() : '-'}만원
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                         *해당 상권 실거래가 및 시세 기반 추정치
                      </p>
                   </div>

                   {/* 3. Stats Grid */}
                   <div className="grid grid-cols-2 gap-3">
                      <div className="bg-slate-50 dark:bg-slate-700/30 p-3 rounded-xl border border-slate-100 dark:border-slate-600">
                         <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold mb-1">유사 상권 대비</p>
                         <p className={`text-lg font-bold ${rentalData.benchmark.gapPercentage > 0 ? 'text-red-500' : 'text-green-500'}`}>
                            {rentalData.benchmark.gapPercentage > 0 ? '+' : ''}{rentalData.benchmark.gapPercentage}%
                         </p>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-700/30 p-3 rounded-xl border border-slate-100 dark:border-slate-600">
                         <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold mb-1">상위 10% 시세</p>
                         <p className="text-lg font-bold text-slate-800 dark:text-white">
                           {rentalData.stats.top10Percent?.toLocaleString()}만원
                         </p>
                      </div>
                   </div>
                </div>

                {/* Right Column: Chart */}
                <div className="w-full lg:w-2/3 bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 border border-slate-100 dark:border-slate-700 min-h-[300px] flex flex-col">
                    <div className="flex justify-between items-center mb-4">
                        <p className="text-sm font-bold text-slate-600 dark:text-slate-300 flex items-center gap-2">
                           <ChartLineUp weight="bold" /> 최근 1년 임대료 변동 추이
                        </p>
                        <span className="text-[10px] text-slate-400 bg-white dark:bg-slate-800 px-2 py-1 rounded border dark:border-slate-600">단위: 만원/평</span>
                    </div>
                    <div className="flex-1">
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={rentalData.trend} margin={{ top: 20, right: 30, left: 10, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis 
                                  dataKey="time" 
                                  axisLine={false} 
                                  tickLine={false} 
                                  tick={{fontSize: 11, fill: '#64748b'}} 
                                  dy={10}
                                  interval="preserveStartEnd"
                                />
                                <YAxis 
                                  axisLine={false} 
                                  tickLine={false} 
                                  tick={{fontSize: 11, fill: '#64748b'}} 
                                  domain={['auto', 'auto']}
                                  tickFormatter={(value) => `${value}`}
                                  width={40} 
                                />
                                <Tooltip 
                                  formatter={(value: number) => [`${value.toLocaleString()}만원`, '평당 임대료']}
                                  labelStyle={{ color: '#64748b' }}
                                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
                                />
                                <Line 
                                  type="monotone" 
                                  dataKey="value" 
                                  stroke="#10b981" 
                                  strokeWidth={3} 
                                  dot={{r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff'}} 
                                  activeDot={{r: 6}} 
                                  isAnimationActive={true}
                                >
                                    <LabelList 
                                      dataKey="value" 
                                      position="top" 
                                      offset={10} 
                                      style={{ fill: '#10b981', fontSize: '10px', fontWeight: 'bold' }} 
                                      formatter={(val: number) => val.toLocaleString()}
                                    />
                                </Line>
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>
                </div>
             </div>
          ) : (
             <div className="space-y-4">
                <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-900/30 mb-4">
                    <h4 className="font-bold text-blue-700 dark:text-blue-400 text-sm mb-2 flex items-center gap-2">
                        <Handshake size={18} weight="fill"/> AI 제안 계약 전략
                    </h4>
                    <p className="text-xs text-blue-600 dark:text-blue-300">
                        현재 상권의 공실률과 임대료 추세를 분석하여 생성된 맞춤형 협상 가이드입니다.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                   {rentalData.strategies.map((strat, i) => (
                      <div key={i} className="bg-slate-50 dark:bg-slate-700/30 p-4 rounded-xl border border-slate-200 dark:border-slate-600 hover:border-blue-400 transition-colors group">
                         <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-bold text-slate-800 dark:text-white">{strat.type}</span>
                         </div>
                         <div className="text-xs text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-100 dark:border-slate-700 mb-3 h-32 overflow-y-auto custom-scrollbar italic">
                            "{strat.template}"
                         </div>
                         <ul className="text-[10px] text-slate-500 dark:text-slate-400 space-y-1 list-disc pl-3">
                            {strat.keyPoints.map((pt, j) => <li key={j}>{pt}</li>)}
                         </ul>
                      </div>
                   ))}
                </div>
             </div>
          )}
       </div>
    </div>
  );
};

const GrowthPredictionSection: React.FC<{ growthData?: GrowthPrediction }> = ({ growthData }) => {
  if (!growthData) return null;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700 overflow-hidden break-inside-avoid h-full">
       <div className="p-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
          <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
             <ChartLineUp size={20} className="text-purple-500" weight="fill"/> 상권 성장성 예측 (재개발/인프라)
          </h3>
       </div>
       <div className="p-6">
          <div className="flex items-center gap-6 mb-6">
             <div className="relative w-28 h-28 flex-shrink-0 flex items-center justify-center">
                 <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-100 dark:text-slate-700" />
                    <circle
                        cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="8" fill="transparent"
                        strokeDasharray={2 * Math.PI * 30}
                        strokeDashoffset={2 * Math.PI * 30 - (growthData.score / 100) * 2 * Math.PI * 30}
                        strokeLinecap="round"
                        className="text-purple-500 transition-all duration-1000"
                    />
                 </svg>
                 <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-2xl font-bold text-slate-800 dark:text-white">{growthData.score}</span>
                    <span className="text-[10px] block text-slate-400">성장 점수</span>
                 </div>
             </div>
             <div className="flex-1">
                <p className="text-sm text-slate-600 dark:text-slate-300 mb-4 leading-relaxed font-medium">
                   {growthData.reasoning}
                </p>
                <div className="flex gap-4 text-xs">
                   <div className="bg-slate-50 dark:bg-slate-700 px-3 py-2 rounded-lg">
                      <span className="block text-slate-400 mb-1">3개월 후 예측</span>
                      <span className={`font-bold ${growthData.prediction3Month >= 0 ? 'text-red-500' : 'text-blue-500'}`}>
                         {growthData.prediction3Month > 0 ? '+' : ''}{growthData.prediction3Month}%
                      </span>
                   </div>
                   <div className="bg-slate-50 dark:bg-slate-700 px-3 py-2 rounded-lg">
                      <span className="block text-slate-400 mb-1">1년 후 예측</span>
                      <span className={`font-bold ${growthData.prediction1Year >= 0 ? 'text-red-500' : 'text-blue-500'}`}>
                         {growthData.prediction1Year > 0 ? '+' : ''}{growthData.prediction1Year}%
                      </span>
                   </div>
                </div>
             </div>
          </div>

          <div className="relative border-l-2 border-slate-200 dark:border-slate-700 ml-3 space-y-6 pl-6 py-2">
             {growthData.timeline.map((event, i) => (
                <div key={i} className="relative">
                   <div className={`absolute -left-[31px] top-1 w-4 h-4 rounded-full border-2 border-white dark:border-slate-800 ${
                      event.status === 'completed' ? 'bg-slate-400' : 
                      event.status === 'ongoing' ? 'bg-purple-500 animate-pulse' : 'bg-blue-400'
                   }`}></div>
                   <div className="flex justify-between items-start">
                      <div>
                         <span className="text-xs font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30 px-2 py-0.5 rounded mb-1 inline-block">{event.date}</span>
                         <h4 className="text-sm font-bold text-slate-800 dark:text-white">{event.eventName}</h4>
                         <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{event.description}</p>
                      </div>
                      <span className="text-xs font-bold text-slate-400">영향력 {event.impactScore}</span>
                   </div>
                </div>
             ))}
          </div>
       </div>
    </div>
  );
};

const ScoreGauge: React.FC<{ score: number; level: string }> = ({ score, level }) => {
  const getGradeInfo = (s: number) => {
    if (s >= 90) return { grade: 'S등급', color: 'text-emerald-600 border-emerald-500', bg: 'bg-emerald-50', desc: '매우 우수 (성공 가능성 매우 높음)' };
    if (s >= 80) return { grade: 'A등급', color: 'text-green-500 border-green-500', bg: 'bg-green-50', desc: '우수 (성공 가능성 높음)' };
    if (s >= 70) return { grade: 'B등급', color: 'text-yellow-500 border-yellow-500', bg: 'bg-yellow-50', desc: '양호 (안정적 운영 예상)' };
    if (s >= 60) return { grade: 'C등급', color: 'text-orange-500 border-orange-500', bg: 'bg-orange-50', desc: '보통 (신중한 검토 필요)' };
    if (s >= 50) return { grade: 'D등급', color: 'text-red-500 border-red-500', bg: 'bg-red-50', desc: '주의 (위험 요소 다수)' };
    return { grade: 'F등급', color: 'text-red-800 border-red-800', bg: 'bg-red-100', desc: '위험 (입지 재검토 권장)' };
  };

  const info = getGradeInfo(score);
  const circumference = 2 * Math.PI * 40;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700 h-full relative break-inside-avoid">
      <div className="relative w-40 h-40 flex items-center justify-center mb-4">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-100 dark:text-slate-700" />
          <circle
            cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="transparent"
            strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
            className={`${info.color.split(' ')[0]} transition-all duration-1000 ease-out`}
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className={`text-4xl font-bold ${info.color.split(' ')[0]}`}>{score}</span>
          <span className="text-xs text-slate-400 font-bold mt-1">종합 점수</span>
        </div>
      </div>
      
      <div className={`px-6 py-2 rounded-full text-lg font-bold border mb-2 ${info.color} ${info.bg} bg-opacity-30`}>
        {info.grade}
      </div>
      <p className="text-center text-slate-500 text-sm font-medium px-4">
        {info.desc}
      </p>
    </div>
  );
};

const FactorCard: React.FC<{ factor: FactorScore }> = ({ factor }) => (
  <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-xl group relative hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors break-inside-avoid">
    <div className="flex justify-between items-end mb-2">
      <span className="text-sm font-medium text-slate-600 dark:text-slate-300">{factor.category}</span>
      <div className="flex items-center gap-1">
          <span className="text-lg font-bold text-slate-800 dark:text-white">{factor.score}<span className="text-xs text-slate-400 font-normal">/100</span></span>
      </div>
    </div>
    <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2 mb-2">
      <div 
        className="bg-blue-500 h-2 rounded-full transition-all duration-1000" 
        style={{ width: `${factor.score}%` }}
      ></div>
    </div>
    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{factor.description}</p>
  </div>
);

const RevenueCard: React.FC<{ revenue: AnalysisResult['revenue'] }> = ({ revenue }) => (
  <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-6 rounded-2xl shadow-lg h-full flex flex-col justify-between relative overflow-hidden break-inside-avoid">
    <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-10 -mt-10"></div>
    
    <div className="z-10">
      <div className="flex items-center gap-2 mb-6 opacity-90 border-b border-white/20 pb-4">
        <CurrencyKrw size={24} />
        <h3 className="font-semibold text-lg">예상 월 매출 분석</h3>
      </div>
      
      <div className="space-y-6">
        <div>
          <p className="text-blue-100 text-sm mb-1 flex justify-between">
            <span>평균 예상 매출</span>
            <span className="bg-white/20 px-2 py-0.5 rounded text-xs">실현 가능성 ⭐</span>
          </p>
          <div className="text-4xl font-bold tracking-tight">
            {((revenue.monthlyRevenueMin + revenue.monthlyRevenueMax) / 2).toLocaleString()}
            <span className="text-xl font-normal ml-1">{revenue.currencyUnit}</span>
          </div>
          <div className="flex justify-between text-xs text-blue-200 mt-2 px-1">
             <span>최소: {revenue.monthlyRevenueMin.toLocaleString()}</span>
             <span>최대: {revenue.monthlyRevenueMax.toLocaleString()}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
            <p className="text-xs text-blue-100 mb-1">💰 예상 월 순이익</p>
            <p className="font-bold text-lg">
              {revenue.netProfitMin.toLocaleString()} ~ {revenue.netProfitMax.toLocaleString()}
              <span className="text-xs font-normal ml-1">만원</span>
            </p>
            <p className="text-[10px] text-blue-200 mt-1 opacity-70">(매출 대비 12-15%)</p>
          </div>
          <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
            <p className="text-xs text-blue-100 mb-1">📈 예상 연 매출</p>
            <p className="font-bold text-lg">
              {(revenue.annualRevenueMin / 10000).toFixed(1)} ~ {(revenue.annualRevenueMax / 10000).toFixed(1)}
              <span className="text-xs font-normal ml-1">억원</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const RealMapFrame: React.FC<{ address: string; title?: string; className?: string }> = ({ address, title, className }) => {
  const query = encodeURIComponent(address);
  const mapSrc = `https://maps.google.com/maps?q=${query}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className={`bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden flex flex-col break-inside-avoid ${className || 'h-full min-h-[350px]'}`}>
      <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800">
        <h3 className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
          <MapPin weight="fill" className="text-blue-600" /> 
          {title || "위치 확인 (분석 대상지)"}
        </h3>
        <span className="text-xs text-slate-500">Google Maps</span>
      </div>
      <div className="flex-1 relative bg-slate-100 dark:bg-slate-900 w-full">
        <iframe
          title="Google Map"
          width="100%"
          height="100%"
          frameBorder="0"
          scrolling="no"
          marginHeight={0}
          marginWidth={0}
          src={mapSrc}
          className="absolute inset-0 w-full h-full"
        ></iframe>
      </div>
    </div>
  );
};

const EnvironmentAnalysisCard: React.FC = () => {
  return (
    <div className="bg-slate-50 dark:bg-slate-700/30 rounded-2xl border border-slate-100 dark:border-slate-700 p-5 mb-4 break-inside-avoid">
      <h3 className="font-bold text-slate-700 dark:text-slate-200 mb-4 flex items-center gap-2 text-sm uppercase tracking-wide">
        <MapPin size={18} className="text-purple-500" weight="fill" /> 주변 환경 상세 분석
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div className="space-y-1">
          <p className="font-semibold text-slate-600 dark:text-slate-300">🏢 주변 시설</p>
          <ul className="text-slate-500 dark:text-slate-400 text-xs space-y-0.5">
            <li>오피스: 12개</li>
            <li>상업시설: 8개</li>
          </ul>
        </div>
        <div className="space-y-1">
          <p className="font-semibold text-slate-600 dark:text-slate-300">🏠 주거 인구</p>
          <ul className="text-slate-500 dark:text-slate-400 text-xs space-y-0.5">
            <li>배후세대: 3,300+</li>
            <li>추정인구: 8,000명</li>
          </ul>
        </div>
        <div className="space-y-1">
          <p className="font-semibold text-slate-600 dark:text-slate-300">🚇 교통 여건</p>
          <ul className="text-slate-500 dark:text-slate-400 text-xs space-y-0.5">
            <li>지하철: 도보 5분</li>
            <li>버스: 3개 노선</li>
          </ul>
        </div>
        <div className="space-y-1">
          <p className="font-semibold text-slate-600 dark:text-slate-300">🎓 주요 타겟</p>
          <ul className="text-slate-500 dark:text-slate-400 text-xs space-y-0.5">
            <li>직장인: 60%</li>
            <li>주거민: 30%</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

const CompetitorList: React.FC<{ competitors: AnalysisResult['competitors'] }> = ({ competitors }) => {
  const getThreatDotColor = (level?: number) => {
     if (!level) return 'bg-slate-300';
     if (level >= 4) return 'bg-red-500 shadow-red-500/50 shadow-sm';
     if (level === 3) return 'bg-yellow-400 shadow-yellow-400/50 shadow-sm';
     return 'bg-green-500 shadow-green-500/50 shadow-sm';
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 break-inside-avoid flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <Storefront size={20} className="text-red-500" />
          주요 경쟁 업체 ({competitors.length})
        </h3>
        <div className="flex items-center gap-2">
          {competitors.length > 3 && <span className="text-xs text-red-500 font-bold bg-red-50 px-2 py-1 rounded">경쟁 치열</span>}
        </div>
      </div>

      <EnvironmentAnalysisCard />

      <div className="space-y-3 flex-1 overflow-y-auto pr-2 custom-scrollbar min-h-0">
        {competitors.length > 0 ? (
          competitors.map((comp, idx) => (
            <div key={idx} className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors group">
              <div className="flex items-center gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-white dark:bg-slate-600 border border-slate-200 dark:border-slate-500 text-slate-600 dark:text-slate-300 rounded-full flex items-center justify-center text-xs font-bold shadow-sm group-hover:bg-red-50 group-hover:text-red-500 group-hover:border-red-200 transition-colors">
                  {idx + 1}
                </span>
                <div>
                  <div className="flex items-center gap-1.5">
                      <p className="font-medium text-slate-800 dark:text-slate-200 text-sm line-clamp-1">{comp.name}</p>
                      <div className={`w-2 h-2 rounded-full ${getThreatDotColor(comp.threatLevel)}`} title={`위협 수준: ${comp.threatLevel}/5`}></div>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    {comp.type} 
                    {idx === 0 && <span className="text-red-500 font-bold ml-1">• 가장 위협적</span>}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="block text-xs font-bold text-slate-700 dark:text-slate-300">{comp.distance}</span>
                <div className="flex text-yellow-400 text-[10px]">
                   {'★'.repeat(comp.threatLevel || 3)}
                   <span className="text-slate-300">{'★'.repeat(5 - (comp.threatLevel || 3))}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-slate-400 h-full">
            <Storefront size={32} className="mb-2 opacity-50" />
            <p className="text-sm">주변 경쟁업체 정보가 없습니다.</p>
          </div>
        )}
      </div>
      
      {competitors.length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
          <div className="flex items-center justify-center gap-4 text-[10px] text-slate-400 mb-2">
             <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>높음</span>
             <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-yellow-400"></span>중간</span>
             <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>낮음</span>
          </div>
          <p className="text-xs text-slate-500 text-center">
            💡 반경 300m 내 동일 업종 {competitors.length}개 존재. <span className="font-bold text-red-500">차별화 전략 필수!</span>
          </p>
        </div>
      )}
    </div>
  );
};

const TargetInsightCard: React.FC<{ demographics: AnalysisResult['demographics'], businessType: string }> = ({ demographics, businessType }) => {
  const maxAge = demographics.ageGroup.reduce((prev, current) => (prev.value > current.value) ? prev : current);
  const maxTime = demographics.timeFlow.reduce((prev, current) => (prev.value > current.value) ? prev : current);
  
  const getMarketingTip = (age: string, time: string, type: string) => {
    if (age.includes('20') || age.includes('30')) return `${type} 트렌드에 민감한 MZ세대를 위해 SNS 홍보와 ${time} 시간대 타임세일을 공략하세요.`;
    if (age.includes('40') || age.includes('50')) return `구매력이 높은 중장년층을 위해 ${time} 시간대 프리미엄 서비스와 편안한 좌석을 강조하세요.`;
    return `${time} 시간대 유동인구를 잡기 위해 외부 입간판과 가시성을 높이는 전략이 필요합니다.`;
  };

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 text-white p-6 rounded-2xl shadow-lg border border-slate-700 relative overflow-hidden break-inside-avoid h-full flex flex-col justify-between">
       <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500 opacity-10 rounded-full -mr-6 -mt-6"></div>
       
       <div className="flex justify-between items-start mb-4 relative z-10">
          <h3 className="font-bold text-white flex items-center gap-2">
            <Target size={20} className="text-blue-400" weight="fill" />
            핵심 타겟 및 마케팅 전략
          </h3>
       </div>

       <div className="grid grid-cols-2 gap-4 mb-4 relative z-10">
         <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-blue-200 text-xs mb-1">
              <Users size={14} weight="fill" /> 주력 고객층
            </div>
            <div className="text-2xl font-bold">{maxAge.name}</div>
            <div className="text-[10px] text-slate-300 opacity-80">전체 유동인구의 {maxAge.value}%</div>
         </div>
         <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-orange-200 text-xs mb-1">
              <Clock size={14} weight="fill" /> 골든 타임
            </div>
            <div className="text-2xl font-bold">{maxTime.time}</div>
            <div className="text-[10px] text-slate-300 opacity-80">매출 집중 예상 시간</div>
         </div>
       </div>

       <div className="bg-blue-600/20 border border-blue-500/30 rounded-xl p-3 relative z-10">
         <div className="flex items-start gap-2">
           <Megaphone size={16} className="text-blue-300 mt-0.5 flex-shrink-0" weight="fill" />
           <p className="text-xs text-blue-50 leading-relaxed">
             <span className="font-bold text-blue-300 block mb-1">AI 마케팅 팁:</span>
             {getMarketingTip(maxAge.name, maxTime.time, businessType)}
           </p>
         </div>
       </div>
    </div>
  );
};

const RiskItemComponent: React.FC<{ item: RiskItem }> = ({ item }) => {
  const getSeverityColor = (sev: string) => {
    if (sev === '높음') return 'bg-red-100 text-red-700 border-red-200';
    if (sev === '중간') return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    return 'bg-orange-100 text-orange-700 border-orange-200';
  };

  return (
    <li className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-red-100 dark:border-red-900/30 shadow-sm group relative break-inside-avoid">
      <div className="flex items-start justify-between gap-3 mb-2">
         <span className={`text-xs font-bold px-2 py-1 rounded border ${getSeverityColor(item.severity)} flex-shrink-0`}>
           {item.severity === '높음' ? '🔴 높은 위험' : item.severity === '중간' ? '🟡 중간 위험' : '🟠 주의 필요'}
         </span>
      </div>
      <p className="text-slate-800 dark:text-slate-200 font-medium text-sm mb-3">{item.risk}</p>
      <div className="flex items-start gap-2 bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg">
        <Lightbulb size={16} className="text-amber-500 flex-shrink-0 mt-0.5" weight="fill" />
        <div className="text-xs text-slate-600 dark:text-slate-300">
          <span className="font-bold text-slate-700 dark:text-slate-200 mr-1">대응책:</span>
          {item.mitigation}
        </div>
      </div>
    </li>
  );
};

const OpportunityItemComponent: React.FC<{ item: OpportunityItem }> = ({ item }) => (
  <li className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-green-100 dark:border-green-900/30 shadow-sm group relative break-inside-avoid">
     <div className="mb-3 flex justify-between items-start">
        <div>
            <span className="text-xs font-bold px-2 py-1 rounded bg-green-100 text-green-700 border border-green-200 mb-2 inline-block">
            💚 핵심 강점
            </span>
            <p className="text-slate-800 dark:text-slate-200 font-medium text-sm">{item.strength}</p>
        </div>
     </div>
     <div className="flex items-start gap-2 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-100 dark:border-blue-800">
        <div className="bg-blue-500 text-white rounded-full p-1 flex-shrink-0">
           <CheckCircle size={12} weight="fill" />
        </div>
        <div className="text-xs text-slate-600 dark:text-slate-300">
          <span className="font-bold text-blue-700 dark:text-blue-300 mr-1">활용법:</span>
          {item.utilization}
        </div>
      </div>
  </li>
);

const StrategyItemComponent: React.FC<{ item: StrategyPhase }> = ({ item }) => (
  <div className="relative pl-8 pb-8 last:pb-0 border-l-2 border-blue-200 dark:border-blue-800 ml-2 group break-inside-avoid">
    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-blue-500 border-4 border-white dark:border-slate-900"></div>
    <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
      <div className="flex justify-between items-center mb-3 border-b border-slate-100 dark:border-slate-700 pb-2">
        <div className="flex items-center gap-2">
            <h4 className="font-bold text-slate-800 dark:text-white text-sm">{item.phaseName}</h4>
            <span className="text-xs text-blue-600 dark:text-blue-400 font-medium bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded">
            {item.period}
            </span>
        </div>
      </div>
      <ul className="space-y-2">
        {item.actions.map((action, i) => (
          <li key={i} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
            <CheckCircle size={14} className="text-blue-500 flex-shrink-0 mt-0.5" />
            <span>{action}</span>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

const RecommendationView: React.FC<{ result: RecommendationResult }> = ({ result }) => {
  const getRankStyle = (rank: number) => {
    switch(rank) {
      case 1: return { icon: "🥇", color: "from-yellow-400 to-yellow-600", border: "border-yellow-400", bg: "bg-yellow-50" };
      case 2: return { icon: "🥈", color: "from-slate-300 to-slate-400", border: "border-slate-300", bg: "bg-slate-50" };
      case 3: return { icon: "🥉", color: "from-amber-600 to-amber-700", border: "border-amber-600", bg: "bg-orange-50" };
      default: return { icon: rank, color: "from-blue-500 to-blue-600", border: "border-blue-200", bg: "bg-white" };
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
       <div className="hidden print:block mb-8">
            <div className="flex items-center justify-between border-b pb-4 mb-4">
                <h1 className="text-3xl font-bold text-slate-900">BizInsight 입지 추천 리포트</h1>
                <div className="text-right">
                    <p className="text-sm text-slate-500">분석 일시: {new Date().toLocaleDateString()}</p>
                    <p className="text-sm text-slate-500">Powered by AI</p>
                </div>
            </div>
       </div>

       <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden break-inside-avoid">
          <div className="flex items-start gap-4">
             <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
                <ThumbsUp size={32} weight="fill" />
             </div>
             <div>
                <h2 className="text-2xl font-bold mb-2">AI 입지 추천 결과</h2>
                <p className="text-lg opacity-90 leading-relaxed mb-4">{result.summary}</p>
                <div className="bg-black/20 rounded-lg p-4 text-sm flex items-start gap-2 border border-white/10">
                   <Lightbulb size={20} className="text-yellow-300 shrink-0" weight="fill" />
                   <div>
                      <span className="font-bold text-yellow-300 block mb-1">전문가 조언:</span>
                      {result.expertAdvice}
                   </div>
                </div>
             </div>
          </div>
       </div>

       <div className="space-y-6">
          {result.locations.map((loc) => {
             const style = getRankStyle(loc.rank);
             return (
                <div key={loc.rank} className={`bg-white dark:bg-slate-800 rounded-2xl border-2 ${style.border} shadow-lg overflow-hidden break-inside-avoid`}>
                   <div className="p-6 md:p-8">
                      <div className="flex flex-col md:flex-row gap-6">
                         <div className="flex-shrink-0 flex flex-col items-center">
                            <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${style.color} flex items-center justify-center text-4xl shadow-md text-white font-bold mb-2`}>
                               {typeof style.icon === 'string' ? style.icon : <span className="text-2xl">{style.icon}위</span>}
                            </div>
                            <div className="text-2xl font-bold text-slate-800 dark:text-white">{loc.score}점</div>
                            <div className="text-xs text-slate-500 font-medium">종합 점수</div>
                         </div>

                         <div className="flex-1">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4">
                               <div>
                                  <h3 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                     {loc.locationName}
                                  </h3>
                                  <p className="text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1">
                                     <MapPin size={16} /> {loc.area}
                                  </p>
                                </div>
                               <div className="flex gap-2 items-center">
                                  <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold border border-blue-100">
                                    유동인구 {loc.dailyFloatingPopulation.toLocaleString()}명
                                  </span>
                                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${loc.competitionIntensity === '높음' ? 'bg-red-50 text-red-700 border-red-100' : 'bg-green-50 text-green-700 border-green-100'}`}>
                                    경쟁 강도: {loc.competitionIntensity}
                                  </span>
                               </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mb-6 bg-slate-50 dark:bg-slate-700/30 p-4 rounded-xl">
                               <div className="space-y-2">
                                  <div className="flex justify-between text-sm">
                                     <span className="text-slate-500">💰 예상 월 매출</span>
                                     <span className="font-bold text-slate-800 dark:text-white">{loc.estimatedRevenueMin.toLocaleString()}~{loc.estimatedRevenueMax.toLocaleString()}만원</span>
                                  </div>
                                  <div className="flex justify-between text-sm">
                                     <span className="text-slate-500">💵 예상 임대료</span>
                                     <span className="font-bold text-slate-800 dark:text-white">{loc.estimatedRentMin.toLocaleString()}~{loc.estimatedRentMax.toLocaleString()}만원</span>
                                  </div>
                               </div>
                               <div className="space-y-2">
                                  <div className="flex justify-between text-sm">
                                     <span className="text-slate-500">👥 주 타겟층</span>
                                     <span className="font-bold text-slate-800 dark:text-white">{loc.mainAgeGroup}</span>
                                  </div>
                                  <div className="flex justify-between text-sm">
                                     <span className="text-slate-500">⏰ 피크 타임</span>
                                     <span className="font-bold text-slate-800 dark:text-white">{loc.peakTime}</span>
                                  </div>
                               </div>
                            </div>

                            <div className="mb-6 h-[320px] w-full rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                                <RealMapFrame 
                                    address={`${loc.area} ${loc.locationName}`} 
                                    title={`📍 ${loc.locationName} 위치 확인`}
                                    className="h-full border-0 shadow-none"
                                />
                            </div>

                            <div className="space-y-3">
                               <div className="flex gap-2">
                                  <CheckCircle size={20} className="text-green-500 shrink-0 mt-0.5" weight="fill" />
                                  <p className="text-sm text-slate-700 dark:text-slate-200"><span className="font-bold">추천 이유:</span> {loc.reason}</p>
                               </div>
                               <div className="flex gap-2">
                                  <Warning size={20} className="text-orange-500 shrink-0 mt-0.5" weight="fill" />
                                  <p className="text-sm text-slate-700 dark:text-slate-200"><span className="font-bold">주의사항:</span> {loc.caution}</p>
                               </div>
                               <div className="flex gap-4 text-xs text-slate-500 mt-2 pl-7">
                                  <span className="flex items-center gap-1"><Car /> 주차: {loc.parkingInfo}</span>
                                  <span className="flex items-center gap-1"><Storefront /> {loc.surroundingEnvironment}</span>
                               </div>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
             );
          })}
       </div>

       <SourcesSection sources={result.sources} />
    </div>
  );
};

const Dashboard: React.FC<DashboardProps> = ({ result, recommendationResult, address, businessType, onBack }) => {
  const [activeDemographicTab, setActiveDemographicTab] = useState<'age' | 'time'>('age');

  return (
    <div className="animate-fade-in space-y-8 relative pb-20">
      <div className="hidden print:block mb-8 border-b-2 border-slate-800 pb-4">
          <div className="flex items-center justify-between">
             <div>
                <h1 className="text-3xl font-extrabold text-slate-900 mb-1">BizInsight Analysis Report</h1>
                <p className="text-sm text-slate-500">AI Based Commercial Analysis & Revenue Simulation</p>
             </div>
             <div className="text-right">
                <p className="text-sm font-bold text-slate-700">Report Date</p>
                <p className="text-lg text-slate-900">{new Date().toLocaleDateString()}</p>
             </div>
          </div>
          {result && (
              <div className="grid grid-cols-2 gap-8 mt-6">
                <div className="border border-slate-300 rounded-lg p-3">
                    <p className="text-xs text-slate-500 uppercase font-bold">Target Location</p>
                    <p className="text-lg font-bold text-slate-900">{address}</p>
                </div>
                <div className="border border-slate-300 rounded-lg p-3">
                    <p className="text-xs text-slate-500 uppercase font-bold">Business Type</p>
                    <p className="text-lg font-bold text-slate-900">{businessType}</p>
                </div>
              </div>
          )}
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 print:hidden">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors font-medium text-sm"
        >
          <ArrowLeft size={18} />
          {recommendationResult ? "처음부터 다시 시작하기" : "처음부터 다시 시작하기"}
        </button>
      </div>

      {recommendationResult ? (
        <RecommendationView result={recommendationResult} />
      ) : result ? (
        <>
          <RealTimeAlertsSection alerts={result.realTimeAlerts} />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4 xl:col-span-3">
              <ScoreGauge score={result.overallScore} level={result.scoreLevel} />
            </div>
            <div className="lg:col-span-8 xl:col-span-9 flex flex-col md:flex-row gap-6">
               <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700 flex-1 flex flex-col justify-center relative break-inside-avoid">
                 <h3 className="font-bold text-slate-800 dark:text-white text-xl mb-4 flex items-center gap-2">
                   <Info size={24} className="text-blue-500" weight="fill" /> 종합 분석 요약
                 </h3>
                 <p className="text-slate-600 dark:text-slate-300 leading-loose text-lg">{result.summary}</p>
               </div>
               <div className="w-full md:w-96 flex-shrink-0"><RevenueCard revenue={result.revenue} /></div>
            </div>
          </div>

          {/* Rental & Growth Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
             <RentalAnalysisSection rentalData={result.rentalAnalysis} />
             <GrowthPredictionSection growthData={result.growthPrediction} />
          </div>

          {/* Map, Competitors, and Factors Layout */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            {/* Left Column: Map & Competitors */}
            <div className="xl:col-span-5 flex flex-col gap-6 h-full">
                <div className="h-[400px] flex-shrink-0 break-inside-avoid shadow-lg rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden">
                    <RealMapFrame address={address || ""} />
                </div>
                {/* CompetitorList fills the remaining space to balance height with right column */}
                <CompetitorList competitors={result.competitors} />
            </div>

            {/* Right Column: Detailed Factors + Demographics/Strategy */}
            <div className="xl:col-span-7 flex flex-col gap-6 h-full">
                {/* Factors Card - Auto Height */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700 relative break-inside-avoid">
                    <h3 className="font-bold text-slate-800 dark:text-white text-lg mb-4 flex items-center gap-2">
                        <CheckCircle size={20} className="text-blue-500" weight="fill" /> 세부 평가 지표
                    </h3>
                    <div className="space-y-4">
                        {result.factors.map((factor, idx) => <FactorCard key={idx} factor={factor} />)}
                    </div>
                </div>

                {/* Moved Components: Demographics & Target Strategy - Grid Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
                    {/* Combined Chart Card */}
                    <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700 flex flex-col">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-slate-800 dark:text-white text-sm flex items-center gap-2">
                                <Users size={18} className="text-indigo-500" weight="fill" /> 유동인구 상세
                            </h3>
                            <div className="flex bg-slate-100 dark:bg-slate-700 p-1 rounded-lg text-[10px] font-bold">
                                <button 
                                    onClick={() => setActiveDemographicTab('age')}
                                    className={`px-2 py-1 rounded transition-all ${activeDemographicTab === 'age' ? 'bg-white dark:bg-slate-600 text-slate-800 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400'}`}
                                >
                                    연령
                                </button>
                                <button 
                                    onClick={() => setActiveDemographicTab('time')}
                                    className={`px-2 py-1 rounded transition-all ${activeDemographicTab === 'time' ? 'bg-white dark:bg-slate-600 text-slate-800 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400'}`}
                                >
                                    시간
                                </button>
                            </div>
                        </div>
                        
                        {/* Compact Chart */}
                        <div className="flex-1 min-h-[200px]">
                            {activeDemographicTab === 'age' ? (
                                <CustomChart type="bar" title="" data={result.demographics.ageGroup} className="h-full border-0 shadow-none p-0" />
                            ) : (
                                <CustomChart type="area" title="" data={result.demographics.timeFlow} className="h-full border-0 shadow-none p-0" />
                            )}
                        </div>
                    </div>

                    {/* Marketing Strategy Card */}
                    <div className="h-full">
                        <TargetInsightCard demographics={result.demographics} businessType={businessType || ""} />
                    </div>
                </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div className="bg-red-50/50 dark:bg-red-900/10 p-6 rounded-2xl border border-red-100 dark:border-red-900/30 group break-inside-avoid">
               <div className="flex justify-between items-start mb-6">
                 <h3 className="font-bold text-red-700 dark:text-red-400 text-xl flex items-center gap-2"><Warning size={24} weight="fill" /> 주의 및 위험 요인</h3>
               </div>
               <ul className="space-y-4">{result.risks.map((item, i) => <RiskItemComponent key={i} item={item} />)}</ul>
             </div>
             <div className="bg-green-50/50 dark:bg-green-900/10 p-6 rounded-2xl border border-green-100 dark:border-green-900/30 group break-inside-avoid">
               <div className="flex justify-between items-start mb-6">
                 <h3 className="font-bold text-green-700 dark:text-green-400 text-xl flex items-center gap-2"><TrendUp size={24} weight="fill" /> 기회 및 긍정 요인</h3>
               </div>
               <ul className="space-y-4">{result.opportunities.map((item, i) => <OpportunityItemComponent key={i} item={item} />)}</ul>
             </div>
             <div className="bg-blue-50/50 dark:bg-blue-900/10 p-6 rounded-2xl border border-blue-100 dark:border-blue-900/30 group break-inside-avoid">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="font-bold text-blue-700 dark:text-blue-400 text-xl flex items-center gap-2"><Lightbulb size={24} weight="fill" /> AI 맞춤 전략 제안</h3>
                </div>
                <div className="pt-2">{result.strategies.map((item, i) => <StrategyItemComponent key={i} item={item} />)}</div>
             </div>
          </div>
          
          <SourcesSection sources={result.sources} />
        </>
      ) : null}
    </div>
  );
};

export default Dashboard;
