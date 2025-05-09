if (isUnsafePathComponent(packageId)) {
    throw new IllegalArgumentException("Invalid package ID.");
}
Path path = Paths.get(directoryPath, packageId + ".png").normalize();