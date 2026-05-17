export const config = {
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // Apify / Firecrawl for Discovery Engine
  APIFY_API_TOKEN: process.env.APIFY_API_TOKEN || '',
  FIRECRAWL_API_KEY: process.env.FIRECRAWL_API_KEY || '',
  
  // LLMs
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
  
  // GitHub LTM
  GITHUB_PAT: process.env.GITHUB_PAT || '',
  GITHUB_REPO_OWNER: process.env.GITHUB_REPO_OWNER || '',
  GITHUB_REPO_NAME: process.env.GITHUB_REPO_NAME || ''
};

export function validateConfig() {
  const warnings: string[] = [];
  if (!config.OPENAI_API_KEY && !config.GEMINI_API_KEY) {
    warnings.push("No LLM API key provided. AI orchestration will fail in production.");
  }
  if (!config.GITHUB_PAT) {
    warnings.push("No GITHUB_PAT provided. LTM (Long-Term Memory) features will fail in production.");
  }
  
  if (warnings.length > 0) {
    console.warn("Production Configuration Warnings:\n", warnings.join("\n"));
  }
}
