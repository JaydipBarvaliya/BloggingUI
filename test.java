if (!isSafePathComponent(baseFolder) || 
    Arrays.stream(subFolder).anyMatch(s -> !isSafePathComponent(s))) {
    throw new IllegalArgumentException("Invalid folder name.");
}