if (!isSafePathComponent(packageId)) {
    throw new IllegalArgumentException("Invalid package ID.");
}

Path imagePath = Paths.get(path, packageId + ".png").normalize();
File f = imagePath.toFile();