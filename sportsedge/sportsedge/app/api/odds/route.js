const SPORT_MAP = { nba: "basketball_nba", nfl: "americanfootball_nfl", mlb: "baseball_mlb", nhl: "icehockey_nhl", wnba: "basketball_wnba", soccer: "soccer_epl" };
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const sportKey = SPORT_MAP[searchParams.get("sport")?.toLowerCase()] || "basketball_nba";
  try {
    const res = await fetch(`https://api.the-odds-api.com/v4/sports/${sportKey}/odds/?apiKey=${process.env.ODDS_API_KEY}&regions=us&markets=h2h,spreads,totals&oddsFormat=american`, { next: { revalidate: 30 } });
    const games = await res.json();
    return Response.json({ games, meta: { remaining: res.headers.get("x-requests-remaining"), fetchedAt: new Date().toISOString() } });
  } catch(e) { return Response.json({ games: [], error: String(e) }); }
}
