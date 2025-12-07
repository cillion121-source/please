import { GoogleGenAI } from "@google/genai";
import { AnalysisInput, AnalysisResult, RecommendationInput, RecommendationResult, SourceLink } from '../types';
import { DEMO_RESULT, DEMO_RECOMMENDATION_RESULT } from '../constants';

// Helper to simulate delay for better UX
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper to clean text from citations and unwanted characters
const cleanText = (text: string): string => {
  if (!text) return "";
  return text
    .replace(/\[\d+\]/g, '') // Remove citation numbers like [1], [12]
    .replace(/【\d+】/g, '') // Remove bracketed numbers like 【1】
    .replace(/\(\d+\)/g, '') // Remove parenthesized numbers like (1)
    .replace(/[①-⑳]/g, '') // Remove circled numbers
    .replace(/\[\d+\s*-\s*from\s*[^\]]+\]/g, '') // Remove grounding citations like [2 - from third google_maps]
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
};

// Recursive function to clean all string values in an object
const cleanObject = (obj: any): any => {
  if (typeof obj === 'string') {
    return cleanText(obj);
  }
  if (Array.isArray(obj)) {
    return obj.map(item => cleanObject(item));
  }
  if (obj !== null && typeof obj === 'object') {
    const newObj: any = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        newObj[key] = cleanObject(obj[key]);
      }
    }
    return newObj;
  }
  return obj;
};

// Helper to extract grounding sources
const extractSources = (response: any): SourceLink[] => {
  const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
  const sources: SourceLink[] = [];
  const seenUrls = new Set<string>();

  chunks.forEach((chunk: any) => {
    let title = "";
    let url = "";

    if (chunk.web?.uri) {
      title = chunk.web.title || "Web Source";
      url = chunk.web.uri;
    } else if (chunk.maps?.sourcePlace?.uri) {
      title = chunk.maps.sourcePlace.name || "Google Maps Location";
      url = chunk.maps.sourcePlace.uri;
    } else if (chunk.maps?.uri) {
      title = chunk.maps.title || "Google Maps";
      url = chunk.maps.uri;
    }

    if (url && !seenUrls.has(url)) {
      seenUrls.add(url);
      sources.push({ title, url });
    }
  });

  return sources;
};

export const analyzeLocation = async (input: AnalysisInput): Promise<AnalysisResult> => {
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    console.warn("No API Key found in environment. Using Demo Data.");
    await delay(2500);
    return DEMO_RESULT;
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    const prompt = `
    You are 'BizInsight AI', an expert commercial real estate and business strategy consultant.
    
    Task: Perform a deep, FACT-BASED analysis for a business location.
    
    **INPUTS:**
    - Address: "${input.address}"
    - Business Type: ${input.businessType}
    - Operating Hours: ${input.hours}
    - Radius: ${input.radius}
    
    **CRITICAL INSTRUCTIONS FOR ACCURACY (MUST USE GOOGLE SEARCH):**
    
    1.  **Rental & Deposit Analysis (HIGH PRECISION REQUIRED)**:
        - **SEARCH MANDATE**: You MUST use the \`googleSearch\` tool to find ACTUAL recent data (2024-2025) for this specific Dong/District.
        - **Specific Queries to Execute**:
          - "${input.address} 1층 상가 임대료 시세" (Rent)
          - "${input.address} 상가 권리금 및 보증금 시세" (Deposit)
          - "한국부동산원 ${input.address.split(' ')[1]} 상업용부동산 임대동향 2024"
          - "네이버 부동산 ${input.address} 상가 월세 실거래가"
        - **Data Extraction**:
          - **Monthly Rent**: Find the specific Price per Pyung (3.3㎡).
          - **Average Deposit**: Find the specific Average Deposit per Pyung (3.3㎡) or standard deposit for 10-15 pyung store.
          - **IMPORTANT**: If exact building data is missing, use the **average for the specific Neighborhood (Dong)**. Do not output zero.
        - **Trend**: Analyze news/reports to see if the area is rising or falling in the last 12 months. The trend line MUST reflect this reality.
    
    2.  **Competitor & Environment**:
        - Use \`googleMaps\` to find real competitor counts within ${input.radius}.
    
    3.  **Strategic Deep Dive (DETAILED & ACTIONABLE)**:
        - **Risks**: Identify 3 specific, data-backed risks.
          - *Risk*: Don't say "Competition". Say "Aggressive pricing from [Competitor Name] 50m away" or "High vacancy rate in adjacent block".
          - *Mitigation*: Concrete steps. "Differentiation" is bad. "Introduce signature menu X not found in competitor Y" is good.
        - **Opportunities**: Identify 3 specific potentials based on demographics.
          - *Strength*: Link to stats (e.g., "High 20s female population").
          - *Utilization*: Specific tactic (e.g., "Instagrammable interior & dessert menu for viral marketing").
        - **Strategies**: Create a detailed 3-phase roadmap.
          - Phase 1 (Launch): Focus on acquisition.
          - Phase 2 (Growth): Focus on retention.
          - Phase 3 (Expansion): Focus on profit/scale.
          - *Actions*: Provide 3-4 very specific, actionable tasks per phase (e.g., "Partnership with local gym", "Time-sale event 2-4PM").
    
    **OUTPUT FORMAT**: Strictly valid JSON inside markdown code block. 
    - **NO comments** inside the JSON.
    - Escape any double quotes in strings.
    
    {
      "overallScore": number (0-100),
      "scoreLevel": "S등급" | "A등급" | "B등급" | "C등급" | "D등급" | "F등급",
      "summary": "Concise summary.",
      "revenue": {
        "dailyCustomersMin": number,
        "dailyCustomersMax": number,
        "monthlyRevenueMin": number (Unit: Man-won),
        "monthlyRevenueMax": number,
        "currencyUnit": "만원",
        "netProfitMin": number,
        "netProfitMax": number,
        "annualRevenueMin": number,
        "annualRevenueMax": number
      },
      "factors": [
        { "category": "유동인구", "score": number, "fullMark": 100, "description": "Concise explanation" },
        { "category": "경쟁분석", "score": number, "fullMark": 100, "description": "Concise explanation" },
        { "category": "접근성", "score": number, "fullMark": 100, "description": "Concise explanation" },
        { "category": "구매력", "score": number, "fullMark": 100, "description": "Concise explanation" },
        { "category": "배후수요", "score": number, "fullMark": 100, "description": "Concise explanation" }
      ],
      "demographics": {
        "ageGroup": [ {"name": "10대", "value": number}, {"name": "20대", "value": number}, {"name": "30대", "value": number}, {"name": "40대", "value": number}, {"name": "50대+", "value": number} ],
        "timeFlow": [ {"time": "06-09", "value": number}, {"time": "09-12", "value": number}, {"time": "12-14", "value": number}, {"time": "14-17", "value": number}, {"time": "17-20", "value": number}, {"time": "20-24", "value": number} ]
      },
      "competitors": [
        { "name": "Name", "distance": "120m", "type": "Type", "threatLevel": 1-5 }
      ],
      "risks": [
        { "risk": "Specific Risk Title", "severity": "높음"|"중간"|"주의", "mitigation": "Detailed mitigation strategy..." }
      ],
      "opportunities": [
        { "strength": "Specific Strength Title", "utilization": "Detailed utilization strategy..." }
      ],
      "strategies": [
         { "phaseName": "1단계 (오픈~3개월)", "period": "초기 정착기", "actions": ["Specific Action 1", "Specific Action 2", "Specific Action 3"] }
      ],
      "rentalAnalysis": {
        "radius": "${input.radius}",
        "stats": {
           "currentMean": number (Monthly Rent Man-won/3.3m2),
           "averageDeposit": number (Deposit Man-won/3.3m2),
           "median": number,
           "top10Percent": number,
           "bottom10Percent": number,
           "monthlyChangeRate": number,
           "annualizedGrowth": number,
           "zScore": number,
           "standardDeviation": number
        },
        "trend": [ 
          {"time": "2024-03", "value": number},
          ... (12 items)
        ],
        "benchmark": {
           "targetArea": number,
           "similarArea": number,
           "gapPercentage": number
        },
        "cashFlows": [
           { "scenario": "optimistic", "monthlyRevenue": number, "rentCost": number, "otherCosts": number, "netProfit": number, "rentToRevenueRatio": number }
        ],
        "strategies": [
           { "type": "단기 계약", "template": "...", "keyPoints": ["..."] },
           { "type": "중기 계약", "template": "...", "keyPoints": ["..."] },
           { "type": "장기 계약", "template": "...", "keyPoints": ["..."] }
        ],
        "sources": []
      },
      "growthPrediction": {
         "score": number,
         "prediction3Month": number,
         "prediction6Month": number,
         "prediction1Year": number,
         "timeline": [
            { "date": "YYYY-MM", "eventName": "...", "impactScore": number, "description": "...", "status": "planned"|"ongoing"|"completed" }
         ],
         "reasoning": "...",
         "sources": []
      },
      "realTimeAlerts": [
         {
            "id": "alert-1",
            "timestamp": "YYYY-MM-DD HH:mm",
            "type": "weather"|"traffic"|"event",
            "severity": "high"|"medium"|"low",
            "message": "...",
            "impact": "...",
            "action": "...",
            "source": "..."
         }
      ]
    }
    
    Translate all text to Korean.
    Ensure "trend" array has exactly 12 items (last 12 months).
    Ensure "averageDeposit" is a realistic number based on "Deposit Market Price" search results.
    Make "risks", "opportunities", and "strategies" very detailed and actionable.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        tools: [{ googleMaps: {} }, { googleSearch: {} }],
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    // Parse JSON from Markdown code block
    const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
    let jsonString = "";
    
    if (jsonMatch && jsonMatch[1]) {
      jsonString = jsonMatch[1];
    } else {
      const start = text.indexOf('{');
      const end = text.lastIndexOf('}');
      if (start !== -1 && end !== -1) {
        jsonString = text.substring(start, end + 1);
      }
    }

    if (!jsonString) {
      console.error("Raw response:", text);
      throw new Error("Failed to parse JSON from AI response");
    }

    // Attempt to fix common JSON errors before parsing
    // 1. Remove trailing commas
    jsonString = jsonString.replace(/,\s*([\]}])/g, '$1');
    // 2. Remove comments (// ...)
    jsonString = jsonString.replace(/\/\/.*$/gm, '');

    const result = JSON.parse(jsonString);
    const cleanedResult = cleanObject(result) as AnalysisResult;
    
    // Attach sources from grounding metadata (Google Search/Maps)
    const externalSources = extractSources(response);
    
    // Merge external sources with the ones generated inside the JSON if any
    if (!cleanedResult.sources) cleanedResult.sources = [];
    cleanedResult.sources = [...cleanedResult.sources, ...externalSources];

    return cleanedResult;

  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    return DEMO_RESULT; 
  }
};

export const recommendLocations = async (input: RecommendationInput): Promise<RecommendationResult> => {
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    console.warn("No API Key found. Using Demo Recommendation.");
    await delay(3000);
    return DEMO_RECOMMENDATION_RESULT;
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    const dongText = input.dong && input.dong !== '전체' ? input.dong : '';
    const districtText = input.district === '전체' ? '' : input.district;
    const region = `${input.city} ${districtText} ${dongText}`.trim();

    const prompt = `
    You are an expert commercial real estate consultant 'BizInsight'.
    
    Task: Recommend top 3-5 commercial locations for a specific business in a target region using FACT-BASED analysis.
    
    Input Info:
    - Business: ${input.businessType}
    - Region: ${region}
    - Hours: ${input.hours}
    - Budget: ${input.budget}
    - Target Age: ${input.targetAge}
    - Parking: ${input.parking}
    
    **CRITICAL**: Use \`googleSearch\` and \`googleMaps\` to find actual commercial districts with detailed rental prices and vacancy data.
    
    Output Format: Strict JSON inside markdown code block. No comments.
    
    {
      "summary": "Overview of the recommendation in Korean",
      "expertAdvice": "Expert tip for this business and region",
      "locations": [
        {
          "rank": 1,
          "locationName": "Specific Location Name (e.g. Gangnam Station Exit 1)",
          "area": "City District Neighborhood",
          "score": 95,
          "dailyFloatingPopulation": number,
          "peakTime": "string (e.g. 12:00-14:00)",
          "mainAgeGroup": "string",
          "competitionIntensity": "낮음" | "중간" | "높음",
          "surroundingEnvironment": "string",
          "transportAccess": "string",
          "parkingInfo": "string",
          "estimatedRentMin": number (unit: Man-won),
          "estimatedRentMax": number,
          "estimatedRevenueMin": number (unit: Man-won),
          "estimatedRevenueMax": number,
          "reason": "Why this is #1",
          "caution": "Risk factor"
        },
        ... (at least 3 locations)
      ]
    }
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        tools: [{ googleMaps: {} }, { googleSearch: {} }],
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response");

    const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
    let jsonString = "";
    if (jsonMatch && jsonMatch[1]) {
      jsonString = jsonMatch[1];
    } else {
      const start = text.indexOf('{');
      const end = text.lastIndexOf('}');
      if (start !== -1 && end !== -1) {
        jsonString = text.substring(start, end + 1);
      }
    }

    if (!jsonString) throw new Error("Failed to parse JSON");
    
    // Fix potential trailing commas
    jsonString = jsonString.replace(/,\s*([\]}])/g, '$1');

    const result = JSON.parse(jsonString);
    const cleanedResult = cleanObject(result) as RecommendationResult;
    
    // Attach sources
    cleanedResult.sources = extractSources(response);
    
    return cleanedResult;

  } catch (error) {
    console.error("Recommendation Failed:", error);
    return DEMO_RECOMMENDATION_RESULT;
  }
};
