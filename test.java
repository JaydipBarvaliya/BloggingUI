Path safeBase = Paths.get(baseFolder).normalize();
Path fullPath = safeBase.resolve(Paths.get(subFolder)).normalize();
if (!fullPath.startsWith(safeBase)) {
    throw new IllegalArgumentException("Unsafe folder path traversal");
}