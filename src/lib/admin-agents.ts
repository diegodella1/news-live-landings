import { mkdir, readFile, writeFile } from "node:fs/promises";
import { env } from "./config";

export type EditableAgentId = "research" | "writer" | "designer" | "critic";

export type EditableAgent = {
  id: EditableAgentId;
  label: string;
  role: string;
  filePath: string;
  override: string;
};

const agentDefinitions: Array<Omit<EditableAgent, "override">> = [
  {
    id: "research",
    label: "Research Agent",
    role: "Finds current sources, source-bound facts, images, quotes, and data before writing.",
    filePath: "src/lib/agents/research.ts"
  },
  {
    id: "writer",
    label: "Writer Agent",
    role: "Creates headline, summary, sections, quotes, and data points from the research package.",
    filePath: "src/lib/agents/writer.ts"
  },
  {
    id: "designer",
    label: "Designer Agent",
    role: "Chooses layout, visual hierarchy, design spec, visuals, and final LandingContent structure.",
    filePath: "src/lib/agents/designer.ts"
  },
  {
    id: "critic",
    label: "Critic Agent",
    role: "Reviews safety, sourcing, section quality, visual relevance, and publication readiness.",
    filePath: "src/lib/agents/critic.ts"
  }
];

const storeDirectory = () => process.env.AGENT_OVERRIDES_DIR ?? (env.pipelineEnv === "prod" ? "/data" : "/tmp");
const storePath = () => `${storeDirectory().replace(/\/$/, "")}/admin-agent-overrides.json`;

const readOverrides = async (): Promise<Partial<Record<EditableAgentId, string>>> => {
  try {
    return JSON.parse(await readFile(storePath(), "utf8")) as Partial<Record<EditableAgentId, string>>;
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") return {};
    throw error;
  }
};

export const listEditableAgents = async (): Promise<EditableAgent[]> => {
  const overrides = await readOverrides();
  return agentDefinitions.map(agent => ({
    ...agent,
    override: overrides[agent.id] ?? ""
  }));
};

export const getAgentOverride = async (agentId: EditableAgentId) => {
  const overrides = await readOverrides();
  const override = overrides[agentId]?.trim();
  if (!override) return "";
  return `\n\nAdmin override for ${agentId} agent:\n${override}\n`;
};

export const saveAgentOverride = async (agentId: EditableAgentId, override: string) => {
  if (!agentDefinitions.some(agent => agent.id === agentId)) {
    throw new Error(`Unknown editable agent: ${agentId}`);
  }
  const cleaned = override.trim();
  const overrides = await readOverrides();
  if (cleaned) {
    overrides[agentId] = cleaned;
  } else {
    delete overrides[agentId];
  }
  await mkdir(storeDirectory(), { recursive: true });
  await writeFile(storePath(), `${JSON.stringify(overrides, null, 2)}\n`, "utf8");
  return cleaned;
};

export const isEditableAgentId = (value: unknown): value is EditableAgentId =>
  typeof value === "string" && agentDefinitions.some(agent => agent.id === value);
