
export interface AnalysisInput {
  address: string;
  businessType: string;
  hours: string;
  radius: '250m' | '500m' | '1km'; // Added radius selection
}

export interface RecommendationInput {
  businessType: string;
  city: string;
  district: string;
  dong: string;
  hours: string;
  budget: string;
  targetAge: string;
  parking: string;
}

export interface DemographicData {
  name: string;
  value: number;
}

export interface TimeSeriesData {
  time: string;
  value: number;
}

export interface FactorScore {
  category: string;
  score: number;
  fullMark: number;
  description: string;
}

export interface Competitor {
  name: string;
  distance: string;
  type: string;
  threatLevel?: number; // 1-5
}

// New Structured Interfaces
export interface RiskItem {
  risk: string;
  severity: '높음' | '중간' | '주의';
  mitigation: string;
}

export interface OpportunityItem {
  strength: string;
  utilization: string;
}

export interface StrategyPhase {
  phaseName: string;
  period: string;
  actions: string[];
}

export interface SourceLink {
  title: string;
  url: string;
  type?: 'official' | 'real_transaction' | 'public_data' | 'news'; // Source type
  confidence?: 'high' | 'medium' | 'low';
}

// --- NEW: Advanced Rental Analysis ---
export interface RentalStats {
  currentMean: number; // 평균 월세 (평당/만원)
  averageDeposit: number; // 평균 보증금 (평당/만원) -- Added
  median: number; // 중앙값
  top10Percent: number; // 상위 10%
  bottom10Percent: number; // 하위 10%
  monthlyChangeRate: number; // 전월 대비 변화율 (%)
  annualizedGrowth: number; // 연 환산 상승률 (%)
  zScore: number; // 지역 평균 이탈도
  standardDeviation: number; // 표준편차
}

export interface CashFlowSimulation {
  scenario: 'optimistic' | 'neutral' | 'pessimistic';
  monthlyRevenue: number;
  rentCost: number;
  otherCosts: number;
  netProfit: number;
  rentToRevenueRatio: number; // 임대료 비중
}

export interface NegotiationStrategy {
  type: '단기 계약' | '중기 계약' | '장기 계약';
  template: string; // 협상 멘트
  keyPoints: string[]; // 협상 포인트 (CPI 연동, 렌트프리 등)
}

export interface RentalAnalysis {
  radius: string;
  stats: RentalStats;
  trend: TimeSeriesData[]; // 최근 12개월 추세
  benchmark: {
    targetArea: number; // 해당 상권 평균
    similarArea: number; // 유사 상권 평균
    gapPercentage: number; // 격차 (%)
  };
  cashFlows: CashFlowSimulation[];
  strategies: NegotiationStrategy[];
  sources: SourceLink[]; // 근거 데이터 (국토부 실거래가 등)
}

// --- NEW: Growth & Redevelopment ---
export interface GrowthEvent {
  date: string; // 예상 시기 (YYYY-MM)
  eventName: string; // 이벤트명 (예: GTX 개통, 대단지 입주)
  impactScore: number; // 영향력 (0-100)
  description: string;
  status: 'planned' | 'ongoing' | 'completed' | 'rumor';
}

export interface GrowthPrediction {
  score: number; // 성장 가능성 점수 (0-100)
  prediction3Month: number; // 3개월 후 예상 변동률 (%)
  prediction6Month: number; // 6개월 후 예상 변동률 (%)
  prediction1Year: number; // 1년 후 예상 변동률 (%)
  timeline: GrowthEvent[];
  reasoning: string; // 예측 근거 (SHAP 등 인과 해석)
  sources: SourceLink[]; // 근거 데이터
}

// --- NEW: Real-time Volatility ---
export interface RealTimeAlert {
  id: string;
  timestamp: string;
  type: 'weather' | 'traffic' | 'event' | 'competitor' | 'construction';
  severity: 'high' | 'medium' | 'low';
  message: string;
  impact: string; // 예상 영향 (예: "매출 -15% 예상")
  action: string; // 권장 조치
  source: string; // 출처 (기상청, 교통정보센터 등)
}

export interface AnalysisResult {
  overallScore: number;
  scoreLevel: '위험' | '보통' | '좋음' | '매우 좋음' | 'S등급' | 'A등급' | 'B등급' | 'C등급' | 'D등급' | 'F등급';
  summary: string;
  revenue: {
    dailyCustomersMin: number;
    dailyCustomersMax: number;
    monthlyRevenueMin: number; // Numeric for calculation
    monthlyRevenueMax: number; // Numeric for calculation
    currencyUnit: string; // e.g. "만원"
    netProfitMin: number;
    netProfitMax: number;
    annualRevenueMin: number;
    annualRevenueMax: number;
  };
  factors: FactorScore[];
  demographics: {
    ageGroup: DemographicData[];
    timeFlow: TimeSeriesData[];
  };
  competitors: Competitor[];
  
  risks: RiskItem[];
  opportunities: OpportunityItem[];
  strategies: StrategyPhase[];
  
  // Advanced Features
  rentalAnalysis?: RentalAnalysis;
  growthPrediction?: GrowthPrediction;
  realTimeAlerts?: RealTimeAlert[];
  
  // Data Sources
  sources?: SourceLink[];
}

export interface RecommendedLocation {
  rank: number;
  locationName: string; // Specific location (e.g., Gangnam Station Exit 1)
  area: string; // City + District + Road
  score: number;
  dailyFloatingPopulation: number;
  peakTime: string;
  mainAgeGroup: string;
  competitionIntensity: '낮음' | '중간' | '높음';
  surroundingEnvironment: string;
  transportAccess: string;
  parkingInfo: string;
  estimatedRentMin: number;
  estimatedRentMax: number;
  estimatedRevenueMin: number;
  estimatedRevenueMax: number;
  reason: string;
  caution: string;
}

export interface RecommendationResult {
  summary: string;
  expertAdvice: string;
  locations: RecommendedLocation[];
  sources?: SourceLink[];
}

export enum LoadingStage {
  IDLE,
  ANALYZING_TRAFFIC,
  CHECKING_COMPETITION,
  CALCULATING_REVENUE,
  FINALIZING,
  COMPLETE,
  ERROR
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  dateStr: string;
  type: 'analysis' | 'recommendation';
  title: string;
  subtitle: string;
  input: AnalysisInput | RecommendationInput;
  result: AnalysisResult | RecommendationResult;
}
