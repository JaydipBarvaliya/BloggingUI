if (isUnsafePathComponent(packageId)) {
    throw new IllegalArgumentException("Invalid package ID.");
}
Path deletePath = Paths.get(directoryPath, packageId).normalize();
FileUtils.forceDelete(deletePath.toFile());