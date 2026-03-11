import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request) {
  const { resorts, preferences } = await request.json();

  const prompt = `You are a ski trip expert. A skier has provided their preferences and I need you to score and rank the following resorts for them.

Skier preferences:
- Skill level: ${preferences.skillLevel}
- Budget (day pass max): ${preferences.budget} EUR
- Travel month: ${preferences.month}
- Priority: ${preferences.priority}

Here are the resorts to score (in JSON):
${JSON.stringify(resorts.map(r => ({
  slug: r.slug,
  name: r.name,
  country: r.country,
  top_altitude: r.top_altitude,
  piste_km: r.piste_km,
  snow_score: r.snow_score,
  beginner_score: r.beginner_score,
  expert_score: r.expert_score,
  offpiste_score: r.offpiste_score,
  snowpark_score: r.snowpark_score,
  village_charm: r.village_charm,
  apres_ski_score: r.apres_ski_score,
  day_pass_price: r.day_pass_price,
})), null, 2)}

Score each resort from 0-100 based on how well it matches the skier's preferences. Return ONLY a JSON array, no other text, like this:
[
  { "slug": "zermatt", "score": 92, "reason": "One sentence why" },
  { "slug": "verbier", "score": 87, "reason": "One sentence why" }
]

Return all resorts, sorted best match first.`;

  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 2000,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = message.content[0].text;
  const scored = JSON.parse(text);

  return Response.json({ scored });
}