export type ArtifactMode = "trackable" | "local";

export type PhaseId =
  | "project-context"
  | "design-proposal"
  | "html-preview"
  | "review"
  | "human-approval"
  | "uispec";

export type WorkflowStatus =
  | "ready"
  | "running"
  | "waiting-for-questions"
  | "waiting-for-preview-review"
  | "waiting-for-approval"
  | "failed"
  | "blocked"
  | "complete";

export interface WorkflowState {
  version: 1;
  feature: string;
  artifactMode: ArtifactMode;
  phase: PhaseId;
  status: WorkflowStatus;
  answers: Record<string, string>;
  approvedAt: string | null;
  updatedAt: string;
}

export interface PhaseDefinition {
  id: PhaseId;
  displayName: string;
  prerequisites: readonly string[];
  allowedOutputs: readonly string[];
  requiredOutputs: readonly string[];
  nextPhase: PhaseId | null;
}

export interface MaterialQuestionChoice {
  id: string;
  label: string;
}

export interface MaterialQuestion {
  id: string;
  prompt: string;
  choices: MaterialQuestionChoice[];
}

export interface RuntimeResult {
  exitCode: number;
  stdout: string;
  stderr: string;
}

export interface RuntimePhaseInput {
  targetRoot: string;
  feature: string;
  phase: PhaseDefinition;
  artifactMode: ArtifactMode;
  answers: Record<string, string>;
}

export interface RuntimeAdapter {
  ensureAvailable(): Promise<void>;
  runPhase(input: RuntimePhaseInput): Promise<RuntimeResult>;
}

export interface WorkspaceSnapshot {
  git: Map<string, string>;
  files: Map<string, string>;
}

export interface ScopeIntegrityResult {
  changedPaths: string[];
  unexpectedPaths: string[];
}

export interface FeaturePaths {
  feature: string;
  root: string;
  state: string;
  projectContext: string;
  proposal: string;
  preview: string;
  review: string;
  currentUispec: string;
  targetUispec: string;
}
