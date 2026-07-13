import type { MaterialQuestion, MaterialQuestionChoice } from "./types.js";

const QUESTION_ID = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const HEADING = "### Material Questions (CLI)";

function valueFor(line: string, prefix: string): string {
  if (!line.startsWith(prefix)) {
    throw new Error(`Expected ${prefix.trim()}`);
  }

  const value = line.slice(prefix.length).trim();
  if (!value) {
    throw new Error(`Expected a value for ${prefix.trim()}`);
  }
  return value.replace(/^(?:"([\s\S]*)"|'([\s\S]*)')$/, "$1$2");
}

function assertId(id: string, subject: string): void {
  if (!QUESTION_ID.test(id)) {
    throw new Error(`${subject} must use lowercase kebab-case`);
  }
}

export function parseMaterialQuestions(proposalMarkdown: string): MaterialQuestion[] {
  const headingIndex = proposalMarkdown.split(/\r?\n/).findIndex((line) => line.trim() === HEADING);
  if (headingIndex === -1) return [];

  const sourceLines = proposalMarkdown.split(/\r?\n/);
  const fenceStart = sourceLines.findIndex((line, index) => index > headingIndex && line.trim() === "```yaml");
  if (fenceStart === -1) {
    throw new Error("Material Questions (CLI) must contain a YAML fence");
  }

  const fenceEnd = sourceLines.findIndex((line, index) => index > fenceStart && line.trim() === "```");
  if (fenceEnd === -1) {
    throw new Error("Material Questions (CLI) YAML fence is not closed");
  }

  const lines = sourceLines.slice(fenceStart + 1, fenceEnd).filter((line) => line.trim() !== "");
  if (lines.shift() !== "questions:") {
    throw new Error("Material Questions (CLI) must begin with questions:");
  }

  const questions: MaterialQuestion[] = [];
  const ids = new Set<string>();
  let index = 0;

  while (index < lines.length) {
    const id = valueFor(lines[index]!, "  - id:");
    assertId(id, "Question ID");
    if (ids.has(id)) throw new Error(`Duplicate question ID: ${id}`);
    ids.add(id);
    index += 1;

    if (lines[index] !== "    material: true") {
      throw new Error(`Question ${id} must declare material: true`);
    }
    index += 1;

    const prompt = valueFor(lines[index]!, "    prompt:");
    index += 1;

    if (lines[index] !== "    choices:") {
      throw new Error(`Question ${id} must declare choices`);
    }
    index += 1;

    const choices: MaterialQuestionChoice[] = [];
    const choiceIds = new Set<string>();
    while (index < lines.length && lines[index]!.startsWith("      - id:")) {
      const choiceId = valueFor(lines[index]!, "      - id:");
      assertId(choiceId, `Choice ID for ${id}`);
      if (choiceIds.has(choiceId)) throw new Error(`Duplicate choice ID in ${id}: ${choiceId}`);
      choiceIds.add(choiceId);
      index += 1;

      const label = valueFor(lines[index]!, "        label:");
      choices.push({ id: choiceId, label });
      index += 1;
    }

    if (choices.length === 0) {
      throw new Error(`Question ${id} must contain at least one choice`);
    }
    questions.push({ id, prompt, choices });
  }

  return questions;
}
