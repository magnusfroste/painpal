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
        // Prepare chatHistory for API
        const chatHistory = history.slice(-6).map((entry, idx) => ({
          role: "user",
          content: `Entry #${idx + 1}: Where: ${entry.where}, Amount: ${entry.amount}, When: ${entry.when}, Cause: ${entry.cause}`,
        }));

        // Call the edge function instead of the OpenAI API directly
        const response = await fetch(
          "https://umjqoizuhfrxzjgrdvei.functions.supabase.co/painpal-assistant",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ chatHistory }),
          }
        );

        if (!response.ok) {
          throw new Error(`Assistant error: ${response.statusText}`);
        }
        const result = await response.json();
        if (result.error) {
          throw new Error(result.error);
        }
        if (!cancelled) setAnalysis(result.analysis);
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
