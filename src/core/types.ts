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
