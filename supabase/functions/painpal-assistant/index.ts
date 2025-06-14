import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get("OPENAI_API_KEY");
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { chatHistory } = await req.json();
    const assistantId = "asst_QdGLwLL2mn8p46MZ0xuryV3S";

    // 1. Create a thread with history
    const createThreadResp = await fetch("https://api.openai.com/v1/threads", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openAIApiKey}`,
        "Content-Type": "application/json",
        "OpenAI-Beta": "assistants=v2",
      },
      body: JSON.stringify({
        messages: chatHistory.map(msg => ({
          role: msg.role,
          content: msg.content,
        }))
      }),
    });

    if (!createThreadResp.ok) {
      const text = await createThreadResp.text();
      console.error("Failed to create thread:", text);
      return new Response(JSON.stringify({ error: `Error creating thread: ${text}` }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const thread = await createThreadResp.json();

    // 2. Create a run
    const runResp = await fetch(`https://api.openai.com/v1/threads/${thread.id}/runs`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openAIApiKey}`,
        "Content-Type": "application/json",
        "OpenAI-Beta": "assistants=v2",
      },
      body: JSON.stringify({
        assistant_id: assistantId,
      }),
    });

    if (!runResp.ok) {
      const text = await runResp.text();
      console.error("Failed to create run:", text);
      return new Response(JSON.stringify({ error: `Error creating run: ${text}` }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const run = await runResp.json();

    // 3. Poll for run completion
    let status = run.status;
    let runId = run.id;
    const maxAttempts = 40;
    let attempts = 0;
    let outputMessages = [];
    while (status !== "completed" && status !== "failed" && attempts < maxAttempts) {
      await sleep(500);
      attempts++;
      const pollResp = await fetch(`https://api.openai.com/v1/threads/${thread.id}/runs/${runId}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${openAIApiKey}`,
          "OpenAI-Beta": "assistants=v2",
        },
      });
      const pollData = await pollResp.json();
      status = pollData.status;
      if (status === "completed") {
        // Fetch the messages from the thread
        const msgResp = await fetch(`https://api.openai.com/v1/threads/${thread.id}/messages`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${openAIApiKey}`,
            "OpenAI-Beta": "assistants=v2",
          },
        });
        const msgData = await msgResp.json();
        // Find assistant messages
        outputMessages = msgData.data
          .filter((m: any) => m.role === "assistant")
          .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      }
    }

    if (status !== "completed" || outputMessages.length === 0) {
      return new Response(JSON.stringify({ error: "Migraine Doctor could not provide an answer in time. Please try again." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiText = outputMessages[0].content?.[0]?.text?.value
      || outputMessages[0].content
      || "Couldn't understand.";

    return new Response(JSON.stringify({ analysis: aiText }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("PainPal Assistant API error:", err);
    return new Response(JSON.stringify({ error: "Trouble talking to Migraine Doctor. Please try again soon!" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
