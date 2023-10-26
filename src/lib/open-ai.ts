import OpenAI from "openai";

export const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_SECRET_KEY,
  organization: process.env.OPEN_AI_ORGANIZATION_ID,
});
