const axios = require('axios');

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';

exports.generateEmailTemplate = async (type, data) => {
  try {
    const prompt = `Generate a professional email template for ${type}. 
    Context: ${JSON.stringify(data)}. 
    Make it personalized, professional, and concise.`;

    const response = await axios.post(
      ANTHROPIC_API_URL,
      {
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [
          { role: 'user', content: prompt }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01'
        }
      }
    );

    return response.data.content[0].text;
  } catch (error) {
    console.error('AI email generation failed:', error);
    return null;
  }
};

exports.parseResume = async (resumeText) => {
  try {
    const prompt = `Extract structured information from this resume text and return ONLY valid JSON:
    
    ${resumeText}
    
    Return a JSON object with these fields:
    {
      "name": "extracted name",
      "email": "extracted email",
      "phone": "extracted phone",
      "skills": ["skill1", "skill2"],
      "education": [{"degree": "", "institution": "", "year": ""}],
      "experience": [{"role": "", "company": "", "duration": ""}],
      "projects": [{"title": "", "description": ""}]
    }`;

    const response = await axios.post(
      ANTHROPIC_API_URL,
      {
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2000,
        messages: [
          { role: 'user', content: prompt }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01'
        }
      }
    );

    const text = response.data.content[0].text;
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    return jsonMatch ? JSON.parse(jsonMatch[0]) : null;
  } catch (error) {
    console.error('Resume parsing failed:', error);
    return null;
  }
};

exports.analyzeJobFit = async (resumeData, jobRequirements) => {
  try {
    const prompt = `Analyze job fit between this resume and job requirements. Return a score from 0-100.
    
    Resume: ${JSON.stringify(resumeData)}
    Job Requirements: ${JSON.stringify(jobRequirements)}
    
    Consider skills match, education relevance, and experience. Return only a number.`;

    const response = await axios.post(
      ANTHROPIC_API_URL,
      {
        model: 'claude-sonnet-4-20250514',
        max_tokens: 100,
        messages: [
          { role: 'user', content: prompt }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01'
        }
      }
    );

    const score = parseInt(response.data.content[0].text.match(/\d+/)[0]);
    return Math.min(100, Math.max(0, score));
  } catch (error) {
    console.error('Job fit analysis failed:', error);
    return 0;
  }
};

exports.generateResumesuggestions = async (resumeData) => {
  try {
    const prompt = `Analyze this resume and provide 5 specific improvement suggestions:
    
    ${JSON.stringify(resumeData)}
    
    Focus on: missing skills, weak descriptions, formatting issues, missing sections.`;

    const response = await axios.post(
      ANTHROPIC_API_URL,
      {
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1500,
        messages: [
          { role: 'user', content: prompt }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01'
        }
      }
    );

    return response.data.content[0].text;
  } catch (error) {
    console.error('Resume suggestions failed:', error);
    return null;
  }
};