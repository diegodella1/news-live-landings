const releaseCandidates = [
  process.env.APP_RELEASE,
  process.env.SOURCE_COMMIT,
  process.env.COOLIFY_RESOURCE_UUID,
  process.env.VERCEL_GIT_COMMIT_SHA,
  process.env.GIT_COMMIT_SHA,
  process.env.COMMIT_SHA,
  process.env.RAILWAY_GIT_COMMIT_SHA
].filter((value): value is string => typeof value === "string" && value.trim().length > 0);

export const appRelease = releaseCandidates[0]?.slice(0, 12) ?? "release-377d250";
