import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ExtractedInfo {
  name?: string;
  email?: string;
  phone?: string;
  education?: Array<{
    degree: string;
    institution: string;
    year?: string;
    grade?: string;
  }>;
  projects?: Array<{
    title: string;
    description: string;
  }>;
  experience?: Array<{
    role: string;
    company: string;
    period?: string;
    description: string;
  }>;
  skills?: string[];
}

async function extractTextFromPDF(file: Uint8Array): Promise<string> {
  // For PDF processing, we'll use a simpler approach or ask user to convert
  // This is a placeholder - in production you'd use a PDF parsing library
  return "PDF text extraction not implemented in Edge Function yet";
}

async function extractTextFromDocx(file: Uint8Array): Promise<string> {
  // For DOCX processing, we'll use a simpler approach  
  // This is a placeholder - in production you'd use a DOCX parsing library
  return "DOCX text extraction not implemented in Edge Function yet";
}

async function extractInfoWithGroq(text: string): Promise<ExtractedInfo> {
  const groqApiKey = Deno.env.get('GROQ_API_KEY');
  
  if (!groqApiKey) {
    throw new Error('GROQ_API_KEY not found in environment variables');
  }

  const prompt = `You are an expert resume parser. Extract the following structured information from the resume text:
1. Full Name
2. Contact Information (Email, Phone Number)
3. Education (including Degree, Institution, Year and also Grade/Percentage if available)
4. Projects (Title and short description)
5. Internships/Work Experience (Role, Company, Period, Description)
6. Technical Skills

Provide the output as a JSON object with this exact structure:
{
  "name": "Full Name",
  "email": "email@example.com",
  "phone": "phone number",
  "education": [
    {
      "degree": "Degree Name",
      "institution": "Institution Name",
      "year": "Year",
      "grade": "Grade/Percentage if available"
    }
  ],
  "projects": [
    {
      "title": "Project Title",
      "description": "Brief description"
    }
  ],
  "experience": [
    {
      "role": "Job Title",
      "company": "Company Name",
      "period": "Start - End Date",
      "description": "Job description"
    }
  ],
  "skills": ["skill1", "skill2", "skill3"]
}

Resume Text:
"""${text}"""`;

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek-r1-distill-llama-70b',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.2,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No content received from Groq API');
    }

    // Extract JSON from the response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        const extractedInfo = JSON.parse(jsonMatch[0]);
        return extractedInfo;
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        throw new Error('Failed to parse JSON from AI response');
      }
    } else {
      throw new Error('No JSON found in AI response');
    }
  } catch (error) {
    console.error('Groq API error:', error);
    throw error;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        {
          status: 405,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    const formData = await req.formData()
    const file = formData.get('cv_file') as File

    if (!file) {
      return new Response(
        JSON.stringify({ error: 'No file uploaded' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    const fileName = file.name.toLowerCase()
    const fileBytes = new Uint8Array(await file.arrayBuffer())
    
    let extractedText = ""

    if (fileName.endsWith('.pdf')) {
      extractedText = await extractTextFromPDF(fileBytes)
    } else if (fileName.endsWith('.docx') || fileName.endsWith('.doc')) {
      extractedText = await extractTextFromDocx(fileBytes)
    } else if (fileName.endsWith('.txt')) {
      extractedText = new TextDecoder().decode(fileBytes)
    } else {
      return new Response(
        JSON.stringify({ error: 'Unsupported file type. Please upload PDF, DOCX, or TXT files.' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    if (!extractedText || extractedText.trim().length < 10) {
      return new Response(
        JSON.stringify({ error: 'Could not extract meaningful text from the file' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    const structuredInfo = await extractInfoWithGroq(extractedText)

    return new Response(
      JSON.stringify(structuredInfo),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Error in extract-cv function:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})