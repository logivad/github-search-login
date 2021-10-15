export interface IGithubSearchResult<T> {
  total_count: number;
  incomplete_results: boolean;
  items: Array<T>;
}

// This is not complete and includes just fields
// needed for this demo app
export interface IGithubSearchUsersResult {
  avatar_url: string;
  login: string;
  type: string;
}
