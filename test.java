Description
We have identified several logging statements in SignatureTransformUtil that write untrusted data (e.g. packageId, exception messages) directly into our log files.  An attacker who controls these values could embed CR, LF or other control characters and manipulate our logs (a CWE-117 “Improper Output Neutralization for Logs” vulnerability).

Remediation
All log messages that include user-controlled strings must wrap those values in our centralized sanitizer, LogSanitizeUtil.sanitizeLogObj(...), which strips out any dangerous characters before writing to the log.



// logs packageId and raw exception text — attacker could inject newlines or ANSI codes
log.error("Failed to decode image for packageId: {}, error: {}",
          packageId,
          e.getMessage());


// both packageId and exception message are neutralized before logging
log.error("Failed to decode image for packageId: {}, error: {}",
          LogSanitizeUtil.sanitizeLogObj(packageId),
          LogSanitizeUtil.sanitizeLogObj(e.getMessage()));





Every log.*(...) call in SignatureTransformUtil that interpolates user-supplied strings uses LogSanitizeUtil.sanitizeLogObj(...).
	•	Unit tests (or manual smoke tests) confirm that control characters (e.g. "\r\n", "\u001b") in inputs are removed or escaped.
	•	No new log-injection findings appear on the next Veracode scan.


