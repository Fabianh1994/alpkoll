export async function POST(request) {
  return Response.json({ error: 'Scoring temporarily disabled' }, { status: 503 });
}