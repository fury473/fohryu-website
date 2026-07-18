declare const __FOHRYU_COMMITS_URL__: string;
declare const __FOHRYU_LAST_COMMIT_DATE__: string | null;
declare const __FOHRYU_REVISION__: string;
declare const __FOHRYU_REVISION_URL__: string | null;
declare const __FOHRYU_SOFTWARE_VERSION__: string;

export type BuildMetadata = {
  commitsUrl: string;
  lastCommitDate: string | null;
  revision: string;
  revisionUrl: string | null;
  softwareVersion: string;
};

export const buildMetadata: BuildMetadata = {
  commitsUrl: __FOHRYU_COMMITS_URL__,
  lastCommitDate: __FOHRYU_LAST_COMMIT_DATE__,
  revision: __FOHRYU_REVISION__,
  revisionUrl: __FOHRYU_REVISION_URL__,
  softwareVersion: __FOHRYU_SOFTWARE_VERSION__
};
