
import { GoogleGenAI } from "@google/genai";
import { AnalysisMetrics, YouTubeVideo } from "../types";

// Gemini API Key verification using process.env.API_KEY
export const verifyGeminiApi = async (): Promise<boolean> => {
  try {
    const ai = new GoogleGenAI({ apiKey: (process.env as any).API_KEY });
    await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: 'ping',
      config: { maxOutputTokens: 1 }
    });
    return true;
  } catch (error) {
    console.error("Gemini Verification Error:", error);
    return false;
  }
};

// Streaming analysis using process.env.API_KEY
export const analyzeWithGeminiStream = async (
  keyword: string,
  metrics: AnalysisMetrics,
  onChunk: (text: string) => void
): Promise<void> => {
  try {
    const ai = new GoogleGenAI({ apiKey: (process.env as any).API_KEY });
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

    const result = await ai.models.generateContentStream({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    for await (const chunk of result) {
      const text = chunk.text;
      if (text) onChunk(text);
    }
  } catch (error) {
    console.error("Gemini Streaming Error:", error);
    onChunk("\n\n[오류] 분석 중 문제가 발생했습니다. API 키의 할당량이나 가용 지역을 확인해주세요.");
  }
};

// General script generation using process.env.API_KEY
export const generateVideoScript = async (userPrompt: string): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: (process.env as any).API_KEY });
    const systemInstruction = `당신은 100만 유튜버 메인 작가입니다. 강력한 후킹과 리텐션 설계를 중심으로 대본을 작성하세요.`;
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: userPrompt,
      config: { systemInstruction }
    });
    return response.text || "대본 생성 실패";
  } catch (error) {
    console.error("Gemini Script Error:", error);
    throw error;
  }
};

// Specific video script generation using process.env.API_KEY
export const generateVideoSpecificScript = async (video: YouTubeVideo): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: (process.env as any).API_KEY });
    const prompt = `제목: ${video.snippet.title}\n설명: ${video.snippet.description}\n위 정보를 기반으로 리텐션 최적화 대본을 재구성하세요.`;
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "대본 생성 실패";
  } catch (error) {
    console.error("Gemini Specific Script Error:", error);
    throw error;
  }
};
