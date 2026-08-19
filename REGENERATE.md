# Regenerate the corpus

There is no refresh pipeline. When `companies.json` goes stale, paste the prompt
below into an agent session, then commit the new JSON.

Do not write rows from memory alone. Use web search. Open a real source URL for
every row. Do not include valuations, headcount, round sizes, or growth/revenue
claims anywhere in the file.

---

## What this is

A flashcard drill that teaches me what startups do. The failure it fixes: someone
says "Harvey" or "Rippling" or "Sierra" in conversation and I either don't know
the name at all, or I know the name and can't go one level deeper. It is not a
news app and it is not a trivia game.

Static data, no backend, no accounts. Ships to Vercel or Netlify as a single page.

---

## Phase 1: build the corpus

Produce `companies.json`, roughly 300 rows. Use web search. Do not write rows from
memory alone.

### Who is in

Include:
- Private companies that have raised a Series A or later.
- Public companies within about three years of IPO. Circle and Figma are in.
  Coinbase and Airbnb are out.
- Non-AI companies that get said in the same rooms: Rippling, Ramp, Deel,
  Anduril, Applied Intuition and similar.
- Vertical AI companies used as "AI is eating profession X" proof points:
  Harvey, Abridge, OpenEvidence, EvenUp.
- Labs with no shipped product but heavy mindshare: SSI, Thinking Machines,
  Reflection AI. Rank these loud.
- International names with English-language mindshare: Mistral, DeepSeek,
  Moonshot, Sakana, Black Forest Labs.
- Faded names that still come up: Jasper, Character.AI, Stability, Inflection.
  Mark these `faded`.

Exclude:
- Anything below Series A, with one override: seed-stage companies that are
  genuinely loud (Cluely is the type case) can be included.
- Biotech-native companies. Recursion, Isomorphic, Tempus are out. If the
  conversation is with a bio person, one line would not have saved me anyway.
- The deep tail of Chinese labs. Zhipu and below are out.

### Row schema

```json
{
  "id": "harvey",
  "name": "Harvey",
  "domain": "harvey.ai",
  "vertical": "Legal",
  "does": "AI assistant for law firms, drafting and reviewing documents and research",
  "founded": 2022,
  "notable": "Backed by OpenAI Startup Fund",
  "status": "active",
  "loudness": 1,
  "source": "https://..."
}
```

Field rules, these matter:

- `does` is one sentence: what they sell and who buys it. Under 20 words.
- `notable` is a founder name or a recognizable investor. One clause.
- No valuations, no headcount, no round sizes, no growth or revenue claims,
  anywhere in the file. Those are the fields most likely to be wrong, fastest to
  rot, and least useful in an actual conversation.
- For `status: "faded"`, `does` describes what they were known for and why they
  faded, in past tense.
- `loudness` is 1 to 3, where 1 is a name I will hear this month and 3 is a name
  I might hear this year. Sort the file by loudness.
- `source` is a real URL you actually opened. Every row needs one.
- `domain` is the bare company domain, used for logo fetching.

### Before you hand it to me

Print 20 randomly sampled rows as a table so I can eyeball them. State plainly
which rows you were least confident about rather than smoothing over them.

Save the exact prompt you used to generate this as `REGENERATE.md` in the repo.
There is no refresh pipeline. When the corpus goes stale I re-run it by hand and
commit the new JSON.
