public static String createDirectories(String baseFolder, String... subFolder) {
    log.info("createDirectories");

    if (isUnsafePathComponent(baseFolder) || Arrays.stream(subFolder).anyMatch(SignatureTransformUtil::isUnsafePathComponent)) {
        throw new IllegalArgumentException("Invalid folder name.");
    }

    Path path = Paths.get(baseFolder, subFolder).normalize();
    Path safeBase = Paths.get(baseFolder).normalize();

    if (!path.startsWith(safeBase)) {
        throw new IllegalArgumentException("Unsafe folder path traversal");
    }

    try {
        path = Files.createDirectories(path);
    } catch (IOException e) {
        log.error("Failed to create Directory:");
    }
    return path.toString();
}