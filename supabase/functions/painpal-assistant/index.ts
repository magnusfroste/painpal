
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get("OPENAI_API_KEY");

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { chatHistory } = await req.json();

    const systemPrompt =
      "You're PainPal, a friendly AI that helps interpret a child's headache log in very simple, positive sentences. Summarize the recent entries (max 4–5 sentences), encourage self-care, and highlight any common patterns if you see them, using cheerful language suitable for a 10 year-old. Emoji are nice!";

    const messages = [
      { role: "system", content: systemPrompt },
      ...chatHistory
    ];

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openAIApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4-1106-preview",
        messages,
        max_tokens: 256,
        temperature: 0.38,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return new Response(JSON.stringify({ error: `OpenAI error: ${response.statusText} - ${errText}` }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const json = await response.json();
    const aiText =
      json.choices?.[0]?.message?.content ||
      json.choices?.[0]?.text ||
      "Couldn't understand.";

    return new Response(JSON.stringify({ analysis: aiText }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Trouble talking to OpenAI. Please try again soon!" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
