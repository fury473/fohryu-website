declare const __FOHRYU_COMMITS_URL__: string;
declare const __FOHRYU_LAST_COMMIT_DATE__: string | null;

export type BuildMetadata = {
  commitsUrl: string;
  lastCommitDate: string | null;
};

export const buildMetadata: BuildMetadata = {
  commitsUrl: __FOHRYU_COMMITS_URL__,
  lastCommitDate: __FOHRYU_LAST_COMMIT_DATE__
};
