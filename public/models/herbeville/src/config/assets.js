export function assetPath(relativePath) {
  const cleanPath = relativePath.replace(/^\/+/, '')
  return `${import.meta.env.BASE_URL}${cleanPath}`
}
