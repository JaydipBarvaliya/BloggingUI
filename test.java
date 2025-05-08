if (!isSafePathComponent(baseFolder) || !isSafePathComponent(subFolder)) {
    throw new IllegalArgumentException("Invalid folder name.");
}