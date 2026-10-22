// Prefix public files with the GitHub Pages sub-path.
export const asset = (path: string) => (process.env.NEXT_PUBLIC_BASE_PATH || "") + path;
