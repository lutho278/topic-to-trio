import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, textType, tone, length } = await req.json();
    console.log('Generating text with:', { prompt, textType, tone, length });

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Build system prompt based on text type
    let systemPrompt = '';
    switch (textType) {
      case 'story':
        systemPrompt = `You are a creative storyteller. Write engaging, imaginative stories with vivid descriptions and compelling narratives. Use a ${tone} tone.`;
        break;
      case 'blog':
        systemPrompt = `You are a professional blog writer. Create informative, well-structured blog posts with clear headings and engaging content. Use a ${tone} tone.`;
        break;
      case 'poem':
        systemPrompt = `You are a skilled poet. Write beautiful, evocative poetry with rhythm and emotion. Use a ${tone} tone.`;
        break;
      case 'social':
        systemPrompt = `You are a social media content creator. Write catchy, engaging posts that capture attention and encourage interaction. Use a ${tone} tone. Keep it concise and impactful.`;
        break;
      default:
        systemPrompt = `You are a helpful AI writer. Create high-quality content with a ${tone} tone.`;
    }

    // Adjust length instruction
    let lengthInstruction = '';
    if (length === 'short') {
      lengthInstruction = textType === 'social' ? 'Keep it under 280 characters.' : 'Keep it brief, around 100-150 words.';
    } else if (length === 'medium') {
      lengthInstruction = textType === 'social' ? 'Write 1-2 paragraphs.' : 'Write around 200-300 words.';
    } else {
      lengthInstruction = textType === 'social' ? 'Write a longer post with 3-4 paragraphs.' : 'Write a detailed piece of 400-500 words.';
    }

    const fullPrompt = `${prompt}\n\n${lengthInstruction}`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: fullPrompt }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Insufficient credits. Please add credits to your Lovable AI workspace in Settings → Workspace → Usage.' }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: 'AI Gateway request failed' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const generatedText = data.choices[0].message.content;

    console.log('Text generated successfully');
    return new Response(
      JSON.stringify({ text: generatedText }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in generate-text function:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
