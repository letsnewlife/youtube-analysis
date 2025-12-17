
import { GoogleGenAI } from "@google/genai";
import { AnalysisMetrics, YouTubeVideo } from "../types";

/**
 * Gemini API Key Verification
 * Uses the provided key to ensure it works before allowing AI features.
 */
export const verifyGeminiApi = async (apiKey: string): Promise<boolean> => {
  if (!apiKey || !apiKey.trim()) return false;
  try {
    // Guidelines require initialization with apiKey. 
    // We prioritize the sidebar input for user flexibility.
    const ai = new GoogleGenAI({ apiKey: apiKey.trim() });
    
    await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: 'ping',
      config: {
        maxOutputTokens: 1,
      }
    });
    
    return true;
  } catch (error) {
    console.error("Gemini Verification Error:", error);
    return false;
  }
};

/**
 * Comprehensive Keyword & Strategy Analysis
 */
export const analyzeWithGemini = async (
  apiKey: string,
  keyword: string,
  metrics: AnalysisMetrics
): Promise<string> => {
  if (!apiKey) return "API 키가 유효하지 않습니다.";

  try {
    const ai = new GoogleGenAI({ apiKey: apiKey.trim() });
    
    const prompt = `
      당신은 유튜브 알고리즘, SEO(검색 엔진 최적화), 그리고 수익화 전략에 정통한 **유튜브 채널 전문 컨설턴트**입니다.
      
      아래 제공된 [데이터 분석 결과]를 바탕으로, 검색어 "${keyword}"에 대한 심층 키워드 분석과 고품질의 종합 전략을 제안해주세요.
      
      [데이터 분석 결과]
      - 타겟 키워드: "${keyword}"
      - 시장 규모(평균 조회수): ${Math.round(metrics.avgViews).toLocaleString()}회 (규모 등급: ${metrics.marketSizeLevel})
      - 사용자 반응(Engagement): ${metrics.engagementRate.toFixed(2)}% (난이도: ${metrics.difficultyLevel})
      - 상위 노출 태그: ${metrics.topTags.join(', ')}

      [작성 가이드라인 - 아래 항목을 반드시 포함하여 구체적으로 작성]

      1. 🔍 **키워드 확장 분석**:
         - **연관 키워드**: 해당 주제와 직접적으로 연관된 핵심 키워드 5개
         - **유사 키워드**: 시청자들이 함께 검색할 법한 비슷한 의도의 키워드 5개
         - **롱테일 키워드 추천**: 경쟁은 낮고 타겟팅은 명확한 구체적인 키워드 조합 3~5개

      2. 📊 **콘텐츠 포맷 분류 및 예상 비율**:
         - 상위 노출 영상들의 성격(예: 하우투/리뷰/비교/썰/브이로그/뉴스/실험 등)을 분석하여 현재 시장의 포맷 점유율을 %로 추정해 제시하세요.
         - 예: [리뷰 40%, 하우투 30%, 썰풀기 20%, 기타 10%]

      3. 🎯 **시장 잠재력 및 알고리즘 분석**:
         - 이 키워드가 현재 유튜브 알고리즘 상에서 트래픽을 끌어오기 유리한지 평가하세요.
         - 초보 채널이 진입하기에 적절한 시기인지, 아니면 틈새 전략이 필요한지 분석하세요.

      4. 💡 **차별화된 콘텐츠 및 주제 제안**:
         - 경쟁자들과 다르게 접근할 수 있는 구체적인 주제(Topic)를 2~3가지 제안하고 영상 구성 팁을 포함하세요.

      5. 🖼️ **클릭을 부르는 썸네일 & 카피라이팅 전략**:
         - 클릭률(CTR)을 높이기 위한 썸네일 디자인 요소와 제목 패턴을 제시하세요.

      어조: 매우 전문적이고 분석적이며 실행 가능한 정보를 제공하는 신뢰감 있는 톤.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
    });

    return response.text || "분석 결과를 생성할 수 없습니다.";
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return "AI 분석 중 오류가 발생했습니다. 할당량이나 키 상태를 확인해주세요.";
  }
};

/**
 * Creative Script Generation with retention-focused instructions
 */
export const generateVideoScript = async (apiKey: string, userPrompt: string): Promise<string> => {
  if (!apiKey) throw new Error("API Key missing");

  try {
    const ai = new GoogleGenAI({ apiKey: apiKey.trim() });
    
    const systemInstruction = `
      당신은 **100만 유튜버를 배출한 전설적인 메인 작가**이자 **유튜브 알고리즘 해커**입니다.
      시청자의 뇌를 자극하여 '끝까지 보게 만드는' 치밀한 설계도를 작성해야 합니다.

      [필수 대본 구조]
      1. **[썸네일/제목 제안]**: 클릭률(CTR) 10% 이상을 목표로 하는 카피 3가지.
      2. **[인트로]**: 강력한 훅(Hook) 설계.
      3. **[본론]**: 리텐션 설계를 위한 단계별 구성과 편집 지시사항.
      4. **[아웃트로]**: 액션 유도(CTA).

      한국어 구어체(해요체)를 완벽하게 구사하며, 친근하면서도 권위 있는 톤을 유지하세요.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: userPrompt,
      config: {
        systemInstruction: systemInstruction
      }
    });

    return response.text || "대본을 생성할 수 없습니다.";
  } catch (error) {
    console.error("Gemini Script Error:", error);
    throw error;
  }
};

/**
 * Metadata-based Video Script Reconstruction
 */
export const generateVideoSpecificScript = async (apiKey: string, video: YouTubeVideo): Promise<string> => {
  if (!apiKey) throw new Error("API Key missing");

  try {
    const ai = new GoogleGenAI({ apiKey: apiKey.trim() });
    const prompt = `
      당신은 전문 스크립트 복원가입니다. 
      아래 메타데이터를 기반으로, 실제 영상에서 진행되었을 법한 **전체 대본(Full Script)**을 상세하게 재구성해주세요.
      
      [영상 정보]
      - 제목: ${video.snippet.title}
      - 길이: ${video.contentDetails.duration}
      - 채널명: ${video.snippet.channelTitle}
      - 설명: ${video.snippet.description}
      
      [출력 형식]
      00:00 [오프닝]: (인사 및 훅)
      ...
      [본론]: (주제 전개)
      ...
      [클로징]: (마무리 및 구독 요청)
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
    });

    return response.text || "대본 생성 실패";
  } catch (error) {
    console.error("Gemini Specific Script Error:", error);
    throw error;
  }
}
