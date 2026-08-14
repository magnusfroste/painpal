const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are "Migraine Doctor", a warm, concise assistant inside the PainPal migraine tracking app.
You receive a list of the user's recent migraine/headache entries (location, intensity, time of day, suspected cause).
Analyse them and answer with:
1. A short summary of patterns you notice (timing, triggers, locations, intensity trends).
2. 2-4 concrete, practical suggestions.
Keep it under 180 words, friendly and plain language. Never give a medical diagnosis; remind the user to consult a doctor for persistent or severe symptoms.`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "AI is not configured." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { chatHistory } = await req.json();
    if (!Array.isArray(chatHistory) || chatHistory.length === 0) {
      return new Response(JSON.stringify({ error: "No entries to analyse." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...chatHistory.slice(-20).map((m: any) => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: String(m.content ?? ""),
      })),
      { role: "user", content: "Please analyse my entries above." },
    ];

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": apiKey,
        "X-Lovable-AIG-SDK": "fetch",
      },
      body: JSON.stringify({ model: "google/gemini-3.6-flash", messages }),
    });

    if (res.status === 429) {
      return new Response(JSON.stringify({ error: "Too many requests right now. Please try again in a moment." }), {
        status: 429,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (res.status === 402) {
      return new Response(JSON.stringify({ error: "AI credits are exhausted. Please top up to continue." }), {
        status: 402,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!res.ok) {
      const text = await res.text();
      console.error("AI gateway error:", res.status, text);
      return new Response(JSON.stringify({ error: "The assistant could not answer right now." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await res.json();
    const analysis = data?.choices?.[0]?.message?.content ?? "";

    return new Response(JSON.stringify({ analysis }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("PainPal Assistant error:", err);
    return new Response(JSON.stringify({ error: "Trouble talking to Migraine Doctor. Please try again soon!" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
