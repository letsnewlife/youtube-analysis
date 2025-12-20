
import { GoogleGenAI } from "@google/genai";
import { AnalysisMetrics, YouTubeVideo } from "../types";

/**
 * 모델 우선순위 설정:
 * 1. gemini-3-flash-preview (최신/고성능)
 * 2. gemini-2.5-flash (표준)
 * 3. gemini-flash-lite-latest (경량/높은 할당량)
 */
const MODELS = [
  'gemini-3-flash-preview',
  'gemini-2.5-flash',
  'gemini-flash-lite-latest'
];

export const analyzeWithGeminiStream = async (
  apiKey: string,
  keyword: string,
  metrics: AnalysisMetrics,
  onChunk: (text: string) => void
): Promise<void> => {
  if (!apiKey) return;
  const ai = new GoogleGenAI({ apiKey: apiKey.trim() });
  const prompt = `
      당신은 유튜브 알고리즘 및 수익화 전략 전문가입니다.
      데이터 분석 결과: 키워드 "${keyword}", 시장규모 ${metrics.marketSizeLevel}, 난이도 ${metrics.difficultyLevel}.
      
      [작성 가이드라인]
      1. 🔍 키워드 확장 분석 (연관, 유사, 롱테일)
      2. 📊 콘텐츠 포맷 분류 및 예상 비율 (%)
      3. 🎯 시장 잠재력 및 알고리즘 분석
      4. 💡 차별화된 콘텐츠 주제 제안
      5. 🖼️ 클릭률 극대화 썸네일 & 카피 전략

      전문적이고 실행 가능한 톤으로 한국어로 작성해주세요.
    `;

  for (const modelName of MODELS) {
    try {
      const result = await ai.models.generateContentStream({
        model: modelName,
        contents: prompt,
      });

      for await (const chunk of result) {
        const text = chunk.text;
        if (text) onChunk(text);
      }
      return; // 성공 시 종료
    } catch (error: any) {
      const errorMessage = error?.message || "";
      const isQuotaError = errorMessage.includes("429") || 
                          errorMessage.includes("quota") || 
                          errorMessage.includes("exhausted") || 
                          errorMessage.includes("limit");

      // 할당량 초과 시 다음 모델로 폴백
      if (isQuotaError && MODELS.indexOf(modelName) < MODELS.length - 1) {
        console.warn(`[Fallback] ${modelName} 할당량 초과. ${MODELS[MODELS.indexOf(modelName) + 1]} 모델로 재시도합니다.`);
        continue;
      }
      
      console.error(`Gemini Streaming Error (${modelName}):`, error);
      onChunk("\n\n[오류] 모든 모델의 할당량이 소진되었거나 네트워크 오류가 발생했습니다.");
      break;
    }
  }
};

export const generateVideoScript = async (apiKey: string, userPrompt: string): Promise<string> => {
  if (!apiKey) throw new Error("API Key missing");
  const ai = new GoogleGenAI({ apiKey: apiKey.trim() });
  const systemInstruction = `당신은 100만 유튜버 메인 작가입니다. 강력한 후킹과 리텐션 설계를 중심으로 대본을 작성하세요.`;

  for (const modelName of MODELS) {
    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: userPrompt,
        config: { systemInstruction }
      });
      return response.text || "대본 생성 실패";
    } catch (error: any) {
      const errorMessage = error?.message || "";
      if ((errorMessage.includes("429") || errorMessage.includes("quota") || errorMessage.includes("exhausted") || errorMessage.includes("limit")) && MODELS.indexOf(modelName) < MODELS.length - 1) {
        continue;
      }
      throw error;
    }
  }
  return "대본 생성 실패";
};
