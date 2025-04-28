private SharedServiceLayerException buildBadRequestException(String message) {
    return new SharedServiceLayerException(new Status(HttpStatus.BAD_REQUEST.value(), Severity.Error), message);
}
