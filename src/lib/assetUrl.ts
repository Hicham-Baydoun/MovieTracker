const ASSET_FOLDER = 'assets/images/';

function normalizeAssetPath(path: string): string {
  const trimmedPath = path.trim().replace(/\\/g, '/');
  const assetStartIndex = trimmedPath.indexOf(ASSET_FOLDER);

  if (assetStartIndex >= 0) {
    return trimmedPath.slice(assetStartIndex);
  }

  return trimmedPath.replace(/^\.?\//, '');
}

export function getAssetUrl(path: string): string {
  if (!path) {
    return '';
  }

  if (/^(https?:)?\/\//i.test(path) || path.startsWith('data:')) {
    return path;
  }

  const normalizedPath = normalizeAssetPath(path);
  const baseUrl = import.meta.env.BASE_URL.endsWith('/')
    ? import.meta.env.BASE_URL
    : `${import.meta.env.BASE_URL}/`;

  return `${baseUrl}${normalizedPath}`;
}
