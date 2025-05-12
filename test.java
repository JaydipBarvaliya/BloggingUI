public static String createDirectory(String baseFolder, String subFolder) {
    // 1. Resolve and normalize the base path
    Path basePath = Paths.get(baseFolder)
                         .toAbsolutePath()
                         .normalize();

    // 2. Resolve the user-supplied piece against the base, then normalize
    Path targetPath = basePath.resolve(subFolder)
                              .normalize();

    // 3. Verify that the normalized target still lives under basePath
    if (!targetPath.startsWith(basePath)) {
        throw new IllegalArgumentException(
            "Invalid folder name: " + subFolder
        );
    }

    // 4. Create it (same as before) and return the string
    try {
        Files.createDirectories(targetPath);
    } catch (IOException e) {
        log.error("Failed to create directory {}", targetPath, e);
        throw new UncheckedIOException(e);
    }
    return targetPath.toString();
}