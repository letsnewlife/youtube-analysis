import { GoogleGenAI } from "@google/genai";
import { AnalysisMetrics, YouTubeVideo } from "../types";

// Verify Gemini API Key validity via actual SDK call
export const verifyGeminiApi = async (apiKey: string): Promise<boolean> => {
  if (!apiKey || !apiKey.trim()) return false;
  try {
    const ai = new GoogleGenAI({ apiKey: apiKey.trim() });
    
    // Attempt a very cheap, minimal generation to verify the key works.
    await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: 'hi',
      config: {
        maxOutputTokens: 1,
      }
    });
    
    return true;
  } catch (error) {
    console.error("Gemini verification failed:", error);
    return false;
  }
};

export const analyzeWithGemini = async (
  apiKey: string,
  keyword: string,
  metrics: AnalysisMetrics
): Promise<string> => {
  if (!apiKey) {
    return "Gemini API 키가 설정되지 않아 AI 분석을 사용할 수 없습니다.";
  }

  // Double check: ensure we are NOT using any environment variable
  const safeKey = apiKey.trim();

  try {
    const ai = new GoogleGenAI({ apiKey: safeKey });
    
    const prompt = `
      당신은 유튜브 알고리즘, SEO(검색 엔진 최적화), 그리고 수익화 전략에 정통한 **유튜브 채널 전문 컨설턴트**입니다.
      사용자는 채널 운영자 혹은 개발 관련 영상을 업로드하려는 크리에이터입니다.
      
      아래 제공된 [데이터 분석 결과]를 바탕으로, 경쟁 우위를 점하고 수익화를 극대화할 수 있는 **고품질의 종합 전략**을 제안해주세요.
      
      [데이터 분석 결과]
      - 타겟 키워드: "${keyword}"
      - 시장 규모(평균 조회수): ${Math.round(metrics.avgViews).toLocaleString()}회 (규모 등급: ${metrics.marketSizeLevel})
      - 사용자 반응(Engagement): ${metrics.engagementRate.toFixed(2)}% (난이도: ${metrics.difficultyLevel})
      - 상위 노출 태그: ${metrics.topTags.join(', ')}

      [작성 가이드라인 - 아래 4가지 항목을 필수적으로 포함하여 구체적으로 작성]

      1. 🎯 **시장 잠재력 및 알고리즘 분석**:
         - 이 키워드가 현재 유튜브 알고리즘 상에서 트래픽을 끌어오기 유리한지 평가하세요.
         - 초보 채널이 진입하기에 적절한 시기인지, 아니면 틈새 전략이 필요한지 분석하세요.

      2. 💡 **차별화된 콘텐츠 및 주제 제안**:
         - 경쟁자들과 다르게 접근할 수 있는 구체적인 주제(Topic)를 2~3가지 제안하세요.
         - 시청 지속 시간(Retention)을 늘리기 위한 영상 구성 팁을 포함하세요.

      3. 🖼️ **클릭을 부르는 썸네일 & 카피라이팅 전략**:
         - 클릭률(CTR)을 높이기 위한 썸네일 디자인 요소(색상, 텍스트 배치 등)를 제안하세요.
         - 검색 노출(SEO)과 호기심 자극을 동시에 잡을 수 있는 제목 패턴을 제시하세요.

      4. 💰 **수익화 및 성장 부스트 전략**:
         - 조회수 수익 외에 이 키워드로 창출할 수 있는 수익 모델(제휴 마케팅, 멤버십 등)이 있다면 언급하세요.
         - 구글 SEO 정책을 준수하면서 검색 상위에 랭크되기 위한 팁을 추가하세요.

      어조: 매우 전문적이고 분석적이며, 동시에 실행 가능한 액션 아이템을 제시하는 격려하는 톤.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "분석 결과를 생성할 수 없습니다.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "AI 분석 중 오류가 발생했습니다. 키가 유효한지 확인해주세요.";
  }
};

export const generateVideoScript = async (apiKey: string, userPrompt: string): Promise<string> => {
  if (!apiKey) {
    throw new Error("Gemini API Key is missing");
  }

  const safeKey = apiKey.trim();

  try {
    const ai = new GoogleGenAI({ apiKey: safeKey });
    
    // Improved System Persona and Instruction
    const systemInstruction = `
      당신은 **100만 유튜버를 배출한 전설적인 메인 작가**이자 **유튜브 알고리즘 해커**입니다.
      단순히 글을 쓰는 것이 아니라, 시청자의 뇌를 자극하여 '끝까지 보게 만드는' 치밀한 설계도를 작성해야 합니다.

      [당신의 역할]
      - 지루한 정보 나열을 금지합니다.
      - "이 영상 하나로 종결합니다"와 같은 강력한 후킹을 사용합니다.
      - 3초마다 화면이 전환되는 듯한 역동적인 호흡으로 대본을 작성합니다.
      - 구어체(해요체)를 완벽하게 구사하며, 친근하면서도 권위 있는 톤을 유지합니다.

      [필수 대본 구조]
      1. **[썸네일/제목 제안]**: 클릭률(CTR) 10% 이상을 목표로 하는 자극적이고 호기심 넘치는 카피 3가지.
      2. **[인트로 (00:00~00:45) - 훅(Hook)]**: 
         - 문제 제기 -> 공감 형성 -> 이 영상이 해결책임(보상)을 제시.
         - "여러분, 혹시 이런 적 없으신가요?" 처럼 질문 던지기.
      3. **[본론 (Body) - 리텐션 설계]**:
         - 3가지 핵심 포인트(Step 1, 2, 3)로 명확히 구분.
         - *[편집 지시]*: (자료화면: OOO), (효과음: 띵!), (텍스트 강조) 등 편집자를 위한 지침을 괄호 안에 포함.
         - 반전 요소를 넣거나 시청자의 예상 밖의 팁을 제공.
      4. **[아웃트로 (CTA) - 액션 유도]**:
         - 오늘 내용 3줄 요약.
         - "도움이 되셨다면 구독까진 아니더라도 좋아요는 꼭 부탁드립니다" 식의 부담 없는 유도.

      [작성 톤앤매너]
      - 한국어 구어체 (말하듯이 자연스럽게)
      - 문장은 짧고 간결하게 끊어주세요.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
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

export const generateVideoSpecificScript = async (apiKey: string, video: YouTubeVideo): Promise<string> => {
  if (!apiKey) {
    throw new Error("Gemini API Key is missing");
  }

  const safeKey = apiKey.trim();

  try {
    const ai = new GoogleGenAI({ apiKey: safeKey });
    
    // ISO duration parser for prompt context
    const duration = video.contentDetails.duration;
    
    const prompt = `
      당신은 전문 스크립트 복원가입니다. 
      아래 제공된 메타데이터를 기반으로, 실제 영상에서 진행되었을 법한 **전체 대본(Full Script)**을 최대한 상세하게 재구성(Reconstruct)해주세요.
      
      [영상 정보]
      - 제목: ${video.snippet.title}
      - 길이: ${duration} (이 길이에 맞춰서 분량을 조절해주세요)
      - 채널명: ${video.snippet.channelTitle}
      - 설명: ${video.snippet.description}
      - 태그: ${video.snippet.tags?.join(', ') || '없음'}
      
      [요청 사항]
      1. **주의**: 단순히 요약하지 마세요. 실제 영상처럼 오프닝 인사부터 클로징까지 대사 톤으로 작성하세요.
      2. 설명란에 타임스탬프가 있다면 그 순서를 철저히 따르세요.
      3. 설명란의 내용을 대사에 자연스럽게 녹여내세요.
      4. 한국어 구어체(해요체/합니다체)를 사용하세요.
      
      [출력 형식]
      (시간 흐름에 따른 구성)
      00:00 [오프닝]: (인사 및 훅)
      ...
      [본론]: (주제 전개)
      ...
      [클로징]: (마무리 및 구독 요청)
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "대본을 생성할 수 없습니다.";
  } catch (error) {
    console.error("Gemini Specific Script Error:", error);
    throw error;
  }
}