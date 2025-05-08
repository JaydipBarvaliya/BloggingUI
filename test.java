public static void decodeToImage(String imageString, String directoryPath, String packageId)
        throws SharedServiceLayerException {

    log.debug("decodeToImage");

    BufferedImage image = null;
    byte[] imageByte;

    try {
        // Validate untrusted input
        if (!isSafePathComponent(packageId)) {
            throw new IllegalArgumentException("Invalid package ID.");
        }

        imageByte = Base64.getDecoder().decode(imageString);
        ByteArrayInputStream bais = new ByteArrayInputStream(imageByte);
        image = ImageIO.read(bais);

        // Safe path creation
        String dirPath = createDirectories(directoryPath, packageId);
        Path imagePath = Paths.get(dirPath, packageId + ".png").normalize();

        if (image != null) {
            ImageIO.write(image, "png", imagePath.toFile());
        }

        bais.close();

    } catch (Exception e) {
        log.error("Failed to decode image for packageId: {}, error: {}",
                LogSanitizeUtil.sanitizeLogObj(packageId),
                LogSanitizeUtil.sanitizeLogObj(e.getMessage()));
        throw new SharedServiceLayerException("Failed to decode signature image");
    }
}