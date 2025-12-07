
import { AnalysisResult, AnalysisInput, RecommendationResult } from './types';

export const BUSINESS_TYPES = [
  "편의점", "카페", "치킨/호프", "한식 음식점", "중식", "일식", "양식", "분식점", 
  "베이커리", "미용실", "네일아트", "헬스장/PT", "부동산", "학원"
];

export const BUSINESS_BACKGROUNDS: Record<string, string> = {
  "편의점": "https://images.unsplash.com/photo-1604719312566-b7cb041b3a31?q=80&w=2000&auto=format&fit=crop", 
  "카페": "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=2000&auto=format&fit=crop",
  "치킨/호프": "https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=2000&auto=format&fit=crop",
  "한식 음식점": "https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=2000&auto=format&fit=crop",
  "중식": "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=2000&auto=format&fit=crop",
  "일식": "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=2000&auto=format&fit=crop",
  "양식": "https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=2000&auto=format&fit=crop",
  "분식점": "https://images.unsplash.com/photo-1580651315530-69c8e0026377?q=80&w=2000&auto=format&fit=crop",
  "베이커리": "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=2000&auto=format&fit=crop",
  "미용실": "https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=2000&auto=format&fit=crop",
  "네일아트": "https://images.unsplash.com/photo-1604654894610-df63bc536371?q=80&w=2000&auto=format&fit=crop",
  "헬스장/PT": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2000&auto=format&fit=crop",
  "부동산": "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=2000&auto=format&fit=crop",
  "학원": "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=2000&auto=format&fit=crop",
  "default": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop"
};

export const OPERATING_HOURS = [
  "24시간", "09:00 - 18:00 (오피스형)", "10:00 - 22:00 (일반)", 
  "17:00 - 02:00 (야간/주점)", "11:00 - 21:00 (식사 위주)"
];

export const CITIES = ["서울시", "경기도", "인천시", "부산시", "대구시", "대전시", "광주시"];

export const DISTRICTS: Record<string, string[]> = {
  "서울시": ["강남구", "서초구", "송파구", "마포구", "영등포구", "구로구", "종로구", "중구", "용산구", "성동구", "광진구", "강서구", "양천구", "동작구", "관악구", "은평구", "서대문구", "강동구", "노원구", "도봉구", "강북구", "성북구", "중랑구", "동대문구"],
  "경기도": ["수원시", "성남시", "고양시", "용인시", "부천시", "안산시", "안양시", "남양주시", "화성시", "평택시", "의정부시", "시흥시", "파주시", "김포시", "광명시", "이천시", "구리시", "양주시", "포천시", "오산시", "하남시", "군포시", "의왕시"],
  "인천시": ["중구", "동구", "미추홀구", "연수구", "남동구", "부평구", "계양구", "서구", "강화군", "옹진군"],
  "부산시": ["중구", "서구", "동구", "영도구", "부산진구", "동래구", "남구", "북구", "해운대구", "사하구", "금정구", "강서구", "연제구", "수영구", "사상구", "기장군"],
  "대구시": ["중구", "동구", "서구", "남구", "북구", "수성구", "달서구", "달성군"],
  "대전시": ["동구", "중구", "서구", "유성구", "대덕구"],
  "광주시": ["동구", "서구", "남구", "북구", "광산구"]
};

export const DONGS: Record<string, string[]> = {
  "강남구": ["역삼동", "논현동", "신사동", "청담동", "삼성동", "대치동", "개포동", "도곡동", "압구정동", "세곡동", "자곡동", "율현동", "일원동", "수서동"],
  "서초구": ["서초동", "잠원동", "반포동", "방배동", "양재동", "내곡동", "염곡동", "신원동", "우면동", "원지동"],
  "송파구": ["잠실동", "신천동", "풍납동", "송파동", "석촌동", "삼전동", "가락동", "문정동", "장지동", "방이동", "오금동", "거여동", "마천동"],
  "마포구": ["서교동", "동교동", "연남동", "망원동", "합정동", "상수동", "상암동", "공덕동", "아현동", "도화동", "용강동", "대흥동", "염리동", "성산동", "중동"],
  "영등포구": ["영등포동", "여의도동", "당산동", "문래동", "양평동", "신길동", "대림동", "도림동"],
  "종로구": ["청운동", "신교동", "궁정동", "효자동", "창성동", "통의동", "적선동", "통인동", "누상동", "누하동", "사직동", "체부동", "필운동", "내자동", "삼청동", "안국동", "소격동", "화동", "사간동", "송현동", "가회동", "재동", "계동", "원서동", "인사동", "낙원동", "관훈동", "견지동", "공평동", "종로", "효제동", "연지동", "평창동", "부암동", "홍지동", "신영동", "무악동", "교남동", "교북동", "행촌동", "구기동", "혜화동", "명륜동", "이화동", "동숭동", "창신동", "숭인동"],
  "중구": ["무교동", "다동", "태평로", "을지로", "남대문로", "삼각동", "수하동", "장교동", "수표동", "소공동", "남창동", "북창동", "봉래동", "회현동", "명동", "남산동", "저동", "충무로", "예관동", "묵정동", "필동", "남학동", "주자동", "예장동", "장충동", "광희동", "쌍림동", "주교동", "방산동", "오장동", "입정동", "산림동", "초동", "인현동", "신당동", "흥인동", "무학동", "황학동", "중림동", "의주로", "만리동"],
  "용산구": ["후암동", "용산동", "갈월동", "남영동", "동자동", "서계동", "청파동", "원효로", "신창동", "산천동", "청암동", "효창동", "도원동", "용문동", "문배동", "한강로", "이촌동", "이태원동", "한남동", "동빙고동", "서빙고동", "주성동", "보광동"],
  "성동구": ["상왕십리동", "하왕십리동", "홍익동", "도선동", "마장동", "사근동", "행당동", "응봉동", "금호동", "옥수동", "성수동", "송정동", "용답동"],
  "광진구": ["중곡동", "능동", "구의동", "광장동", "자양동", "화양동", "군자동"],
  "수원시": ["파장동", "정자동", "이목동", "율전동", "천천동", "영화동", "송죽동", "조원동", "연무동", "세류동", "평동", "고색동", "오목천동", "평리동", "서둔동", "구운동", "탑동", "금곡동", "호매실동", "곡반정동", "권선동", "장지동", "대황교동", "입북동", "당수동", "팔달로", "남창동", "영동", "중동", "구천동", "남수동", "매향동", "북수동", "신풍동", "장안동", "교동", "매교동", "매산로", "고등동", "화서동", "지동", "우만동", "인계동", "매탄동", "원천동", "이의동", "하동", "영통동", "신동", "망포동"],
  "성남시": ["신흥동", "태평동", "수진동", "단대동", "산성동", "양지동", "복정동", "창곡동", "신촌동", "오야동", "심곡동", "고등동", "상적동", "둔전동", "시흥동", "금토동", "사송동", "성남동", "중동", "금광동", "은행동", "상대원동", "여수동", "도촌동", "갈현동", "하대원동", "분당동", "수내동", "정자동", "율동", "서현동", "이매동", "야탑동", "판교동", "삼평동", "백현동", "금곡동", "궁내동", "동원동", "구미동", "운중동", "대장동", "석운동", "하산운동"],
  "분당구": ["분당동", "수내동", "정자동", "율동", "서현동", "이매동", "야탑동", "판교동", "삼평동", "백현동", "금곡동", "궁내동", "동원동", "구미동", "운중동", "대장동", "석운동", "하산운동"],
};

export const ALL_DISTRICTS = [
  "강남구", "서초구", "송파구", "마포구", "영등포구", "종로구", "중구", "용산구", "성동구", "광진구", "부산진구", "해운대구", "수성구", "유성구", "분당구"
];

export const BUDGET_RANGES = ["100만원 이하", "100~200만원", "200~300만원", "300~500만원", "500만원 이상", "제한 없음"];
export const TARGET_AGES = ["10대", "20대", "30대", "40대", "50대 이상", "전 연령층"];
export const PARKING_OPTIONS = ["필수", "있으면 좋음", "상관 없음"];

export const SAMPLE_SCENARIOS = [
  {
    title: "강남역 대형 카페",
    description: "유동인구 5만명 강남대로 메인 상권의 카페 수익률 분석",
    input: {
      address: "서울시 강남구 강남대로 396",
      businessType: "카페",
      hours: "09:00 - 22:00 (일반)",
      radius: "500m"
    }
  },
  {
    title: "홍대 입구 치킨/호프",
    description: "2030 젊은 층이 밀집한 홍대 상권의 심야 주점 경쟁 분석",
    input: {
      address: "서울시 마포구 홍익로 6길",
      businessType: "치킨/호프",
      hours: "17:00 - 02:00 (야간/주점)",
      radius: "500m"
    }
  },
  {
    title: "여의도 직장인 헬스장",
    description: "고소득 직장인이 밀집한 여의도 금융가의 점심/퇴근 시간대 PT 수요 분석",
    input: {
      address: "서울시 영등포구 국제금융로 10",
      businessType: "헬스장/PT",
      hours: "10:00 - 22:00 (일반)",
      radius: "500m"
    }
  },
  {
    title: "성수동 베이커리",
    description: "MZ세대 핫플레이스 성수동 카페거리의 베이커리 수요 예측",
    input: {
      address: "서울시 성동구 연무장길 33",
      businessType: "베이커리",
      hours: "10:00 - 22:00 (일반)",
      radius: "500m"
    }
  },
  {
    title: "분당 주거단지 헬스장",
    description: "안정적인 아파트 배후 수요를 가진 주거 밀집 지역 PT샵 분석",
    input: {
      address: "경기도 성남시 분당구 정자일로 1",
      businessType: "헬스장/PT",
      hours: "09:00 - 22:00 (일반)",
      radius: "500m"
    }
  },
  {
    title: "종로 직장인 한식당",
    description: "전통적인 오피스 상권 종로구의 점심 회전율 및 매출 분석",
    input: {
      address: "서울시 종로구 종로 1",
      businessType: "한식 음식점",
      hours: "11:00 - 21:00 (식사 위주)",
      radius: "500m"
    }
  }
];

export const DEMO_RESULT: AnalysisResult = {
  overallScore: 85,
  scoreLevel: 'A등급',
  summary: "선택하신 지역은 유동인구가 풍부하고 배후 수요가 탄탄한 우수 상권입니다. 특히 점심 시간대 직장인 수요가 많아 안정적인 매출이 기대됩니다. 다만 경쟁 강도가 다소 높으니 차별화 전략이 필요합니다.",
  revenue: {
    dailyCustomersMin: 150,
    dailyCustomersMax: 220,
    monthlyRevenueMin: 4500,
    monthlyRevenueMax: 5500,
    currencyUnit: "만원",
    netProfitMin: 900,
    netProfitMax: 1200,
    annualRevenueMin: 54000,
    annualRevenueMax: 66000
  },
  factors: [
    { category: "유동인구", score: 90, fullMark: 100, description: "일 평균 유동인구 약 5만명으로 매우 활발함" },
    { category: "경쟁분석", score: 70, fullMark: 100, description: "동종 업계 경쟁점이 반경 500m 내 12곳 존재" },
    { category: "접근성", score: 95, fullMark: 100, description: "지하철역 도보 3분 거리, 버스 정류장 인접" },
    { category: "구매력", score: 85, fullMark: 100, description: "인근 오피스 및 대단지 아파트 거주민 소득 수준 양호" },
    { category: "배후수요", score: 80, fullMark: 100, description: "반경 1km 내 5,000세대 거주 및 오피스 밀집" }
  ],
  demographics: {
    ageGroup: [
      { name: "10대", value: 10 },
      { name: "20대", value: 30 },
      { name: "30대", value: 35 },
      { name: "40대", value: 15 },
      { name: "50대+", value: 10 }
    ],
    timeFlow: [
      { time: "06-09", value: 10 },
      { time: "09-12", value: 20 },
      { time: "12-14", value: 60 },
      { time: "14-17", value: 30 },
      { time: "17-20", value: 50 },
      { time: "20-24", value: 20 }
    ]
  },
  competitors: [
    { name: "스타벅스 강남점", distance: "120m", "type": "카페", threatLevel: 5 },
    { name: "메가커피 역삼점", distance: "250m", "type": "카페", threatLevel: 3 },
    { name: "이디야커피", distance: "300m", "type": "카페", threatLevel: 2 }
  ],
  risks: [
    { risk: "높은 임대료 상승 가능성", severity: "주의", mitigation: "장기 계약 검토 필요" },
    { risk: "주변 유사 업종 과밀", severity: "중간", mitigation: "특화 메뉴 개발로 차별화" }
  ],
  opportunities: [
    { strength: "평일 점심 고정 수요 확보 용이", utilization: "직장인 대상 런치 세트 및 멤버십 운영" },
    { strength: "배달 수요 증가 추세", utilization: "배달 앱 프로모션 적극 활용" }
  ],
  strategies: [
    { phaseName: "1단계: 오픈 준비", period: "오픈 1개월 전", actions: ["인테리어 공사", "직원 채용", "가오픈 홍보"] },
    { phaseName: "2단계: 초기 운영", period: "오픈 후 1-3개월", actions: ["오픈 이벤트", "리뷰 관리", "단골 확보"] },
    { phaseName: "3단계: 안정화", period: "오픈 후 4-6개월", actions: ["메뉴 리뉴얼", "시즌 프로모션", "원가 절감"] }
  ]
};

export const DEMO_RECOMMENDATION_RESULT: RecommendationResult = {
  summary: "요청하신 조건에 기반하여 분석한 결과, 매출 잠재력이 가장 높은 상위 3개 지역을 추천합니다. 해당 지역들은 유동인구와 배후 수요가 균형 잡혀 있어 안정적인 수익 창출이 기대됩니다.",
  expertAdvice: "초기 진입 시 임대료 부담을 줄이기 위해 권리금이 없거나 낮은 점포를 우선적으로 탐색하는 것을 권장합니다.",
  locations: [
    {
      rank: 1,
      locationName: "홍대입구역 3번 출구 인근",
      area: "서울시 마포구 연남동",
      score: 92,
      dailyFloatingPopulation: 85000,
      peakTime: "18:00 - 22:00",
      mainAgeGroup: "20~30대",
      competitionIntensity: "높음",
      surroundingEnvironment: "핫플레이스, 카페거리",
      transportAccess: "지하철 2호선, 공항철도",
      parkingInfo: "공영주차장 이용",
      estimatedRentMin: 300,
      estimatedRentMax: 500,
      estimatedRevenueMin: 6000,
      estimatedRevenueMax: 8000,
      reason: "젊은 층 유동인구가 압도적으로 많고 소비 성향이 강함",
      caution: "임대료가 매우 높고 경쟁이 치열함"
    },
    {
      rank: 2,
      locationName: "성수동 카페거리 메인",
      area: "서울시 성동구 성수동",
      score: 88,
      dailyFloatingPopulation: 62000,
      peakTime: "12:00 - 20:00",
      mainAgeGroup: "20~30대",
      competitionIntensity: "중간",
      surroundingEnvironment: "문화공간, 오피스",
      transportAccess: "지하철 2호선 성수역",
      parkingInfo: "협소함",
      estimatedRentMin: 250,
      estimatedRentMax: 400,
      estimatedRevenueMin: 5000,
      estimatedRevenueMax: 7000,
      reason: "트렌디한 상권으로 외부 유입 인구가 지속 증가 중",
      caution: "주차 공간 부족 문제"
    },
    {
      rank: 3,
      locationName: "문래 창작촌 입구",
      area: "서울시 영등포구 문래동",
      score: 85,
      dailyFloatingPopulation: 45000,
      peakTime: "17:00 - 23:00",
      mainAgeGroup: "20~40대",
      competitionIntensity: "낮음",
      surroundingEnvironment: "예술촌, 노포",
      transportAccess: "지하철 2호선 문래역",
      parkingInfo: "보통",
      estimatedRentMin: 150,
      estimatedRentMax: 250,
      estimatedRevenueMin: 3500,
      estimatedRevenueMax: 5000,
      reason: "상대적으로 낮은 임대료와 독특한 분위기의 신흥 상권",
      caution: "낮 시간대 유동인구가 적을 수 있음"
    }
  ]
};
