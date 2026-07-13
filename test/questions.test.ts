import assert from "node:assert/strict";
import test from "node:test";

import { parseMaterialQuestions } from "../src/core/questions.js";

const markdown = `# Design Proposal

### Material Questions (CLI)

\`\`\`yaml
questions:
  - id: data-source
    material: true
    prompt: Which data source should the dashboard use?
    choices:
      - id: existing-monitoring-api
        label: Existing monitoring API
\`\`\`
`;

test("parses only material questions from the Open Questions YAML fence", () => {
  assert.deepEqual(parseMaterialQuestions(markdown), [{
    id: "data-source",
    prompt: "Which data source should the dashboard use?",
    choices: [{ id: "existing-monitoring-api", label: "Existing monitoring API" }],
  }]);
});

test("rejects duplicate material question IDs", () => {
  assert.throws(
    () => parseMaterialQuestions(markdown.replace("\n\`\`\`\n", "\n  - id: data-source\n    material: true\n    prompt: Duplicate?\n    choices:\n      - id: duplicate\n        label: Duplicate\n\`\`\`\n")),
    /duplicate question id/i,
  );
});
