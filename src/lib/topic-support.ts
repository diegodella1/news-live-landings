import type { LandingContent, Source } from "./types";

type ResearchOutputLike = {
  sources: Source[];
  facts: Array<{ claim: string; sourceUrl: string }>;
};

const matchupSeparator = /\s+(?:vs\.?|versus|v\.?)\s+/i;
const stopWords = new Set([
  "the", "fc", "cf", "club", "de", "la", "el", "los", "las", "and", "at", "a", "an"
]);

const normalize = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s/:-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const tokensForEntity = (value: string) =>
  normalize(value)
    .split(" ")
    .map(token => token.trim())
    .filter(token => token.length >= 3 && !stopWords.has(token));

export const extractMatchupEntities = (topic: string) => {
  const parts = topic.split(matchupSeparator).map(part => part.trim()).filter(Boolean);
  if (parts.length !== 2) return null;
  const [left, right] = parts;
  if (!left || !right) return null;
  return { left, right };
};

const textMentionsEntity = (haystack: string, entity: string) => {
  const normalizedHaystack = normalize(haystack);
  if (!normalizedHaystack) return false;
  const normalizedEntity = normalize(entity);
  if (normalizedEntity && normalizedHaystack.includes(normalizedEntity)) return true;
  const tokens = tokensForEntity(entity);
  if (tokens.length === 0) return false;
  return tokens.every(token => normalizedHaystack.includes(token));
};

const sourceMentionsMatchup = (source: Source, left: string, right: string) => {
  const haystack = `${source.title} ${source.outlet} ${source.url}`;
  return textMentionsEntity(haystack, left) && textMentionsEntity(haystack, right);
};

const sourceLooksGenericTeamPage = (source: Source, entity: string) => {
  const url = normalize(source.url);
  return (
    textMentionsEntity(`${source.title} ${source.url}`, entity)
    && /\/team\/(?:fixtures|results|stats|squad|transfers)\//.test(url)
  );
};

export const evaluateResearchTopicSupport = (topic: string, input: ResearchOutputLike) => {
  const matchup = extractMatchupEntities(topic);
  if (!matchup) return { supported: true as const, kind: "general" as const };

  const directSource = input.sources.find(source => sourceMentionsMatchup(source, matchup.left, matchup.right));
  if (directSource) {
    return { supported: true as const, kind: "matchup" as const };
  }

  const genericSources = input.sources.filter(source =>
    sourceLooksGenericTeamPage(source, matchup.left) || sourceLooksGenericTeamPage(source, matchup.right)
  );
  const reason = genericSources.length > 0
    ? `The topic names a direct matchup (${matchup.left} vs ${matchup.right}), but research only found generic team pages or indirect context. No direct fixture, match report, or result source mentions both sides together.`
    : `The topic names a direct matchup (${matchup.left} vs ${matchup.right}), but research did not verify that exact event with a source mentioning both sides together.`;

  return {
    supported: false as const,
    kind: "matchup" as const,
    reason
  };
};

export const evaluateLandingTopicSupport = (content: LandingContent) => {
  const matchup = extractMatchupEntities(content.topic);
  if (!matchup) return { supported: true as const, kind: "general" as const };

  const directSource = content.sources.find(source => sourceMentionsMatchup(source, matchup.left, matchup.right));
  if (directSource) {
    return { supported: true as const, kind: "matchup" as const };
  }

  return {
    supported: false as const,
    kind: "matchup" as const,
    reason: `The landing topic names a direct matchup (${matchup.left} vs ${matchup.right}), but the source set does not include a direct fixture, match report, or result source that mentions both sides together.`
  };
};
