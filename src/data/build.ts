declare const __FOHRYU_APP_VERSION__: string;
declare const __FOHRYU_COMMITS_URL__: string;
declare const __FOHRYU_LAST_COMMIT_DATE__: string | null;

export type BuildMetadata = {
  appVersion: string;
  commitsUrl: string;
  lastCommitDate: string | null;
};

export const buildMetadata: BuildMetadata = {
  appVersion: __FOHRYU_APP_VERSION__,
  commitsUrl: __FOHRYU_COMMITS_URL__,
  lastCommitDate: __FOHRYU_LAST_COMMIT_DATE__
};
