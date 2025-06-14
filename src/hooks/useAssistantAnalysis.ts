
import { useEffect, useState } from "react";

type AnalysisOptions = {
  history: any[];
  assistantId: string;
};

export function useAssistantAnalysis({ history, assistantId }: AnalysisOptions) {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!history.length) {
      setAnalysis(null);
      setLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;

    async function fetchAnalysis() {
      setLoading(true);
      setError(null);
      setAnalysis(null);

      try {
        const chatHistory = history.slice(-6).map((entry, idx) => ({
          role: "user",
          content: `Entry #${idx + 1}: Where: ${entry.where}, Amount: ${entry.amount}, When: ${entry.when}, Cause: ${entry.cause}`,
        }));

        // Instruction prompt for assistant. You can edit as needed!
        const systemPrompt =
          "You're PainPal, a friendly AI that helps interpret a child's headache log in very simple, positive sentences. Summarize the recent entries (max 4–5 sentences), encourage self-care, and highlight any common patterns if you see them, using cheerful language suitable for a 10 year-old. Emoji are nice!";

        const response = await fetch("https://api.openai.com/v1/assistants/" + assistantId + "/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${import.meta.env.PUBLIC_OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "gpt-4-1106-preview",
            messages: [
              { role: "system", content: systemPrompt },
              ...chatHistory
            ],
            max_tokens: 256,
            temperature: 0.38,
          }),
        });

        if (!response.ok) {
          throw new Error(`OpenAI error: ${response.statusText}`);
        }
        const json = await response.json();
        const aiText =
          json.choices?.[0]?.message?.content ||
          json.choices?.[0]?.text ||
          "Couldn't understand.";
        if (!cancelled) setAnalysis(aiText);
      } catch (err: any) {
        if (!cancelled) {
          setError(
            "Could not reach PainPal assistant right now! Showing regular summary instead."
          );
          setAnalysis(null);
        }
      }
      if (!cancelled) setLoading(false);
    }

    fetchAnalysis();
    return () => {
      cancelled = true;
    };
  }, [JSON.stringify(history), assistantId]);

  return { analysis, loading, error };
}
