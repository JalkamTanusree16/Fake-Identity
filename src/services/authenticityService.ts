// DEMO RESULTS deterministic map based on exact filename
const DEMO_RESULTS: Record<string, any> = {
  "genuine-passport.jpg": {
    status: "AUTHENTIC",
    label: "NO OBVIOUS ISSUE",
    confidence: 96,
    riskLevel: "LOW",
    riskScore: 12,
    reasons: [
      "All MRZ checksum fields validated successfully",
      "Document structure matches ICAO 9303 standard",
      "Security feature patterns consistent with issuing authority",
      "No pixel-level tampering indicators detected",
      "Biometric zone integrity confirmed"
    ],
    checks: [
      { name: "Quality", status: "PASS", detail: "Image resolution 412 DPI. Skew angle 0.3° (within 2° tolerance). No glare detected. File format valid." },
      { name: "Font", status: "PASS", detail: "7/7 mandatory fields extracted. Character confidence avg 98.3%. OCR-B font detected." },
      { name: "MRZ", status: "PASS", detail: "All 7 checksum digits verified. Document number, DOB, expiry, and composite check all match." },
      { name: "Structure", status: "PASS", detail: "All cross-field logical checks passed. Document matches India Passport Type-P template (ICAO 9303 Part 4)." },
      { name: "Field Consistency", status: "PASS", detail: "All cross-field logical checks passed. Document matches India Passport Type-P template (ICAO 9303 Part 4)." },
      { name: "ELA", status: "PASS", detail: "Uniform ELA response across document. No localized high-frequency artifacts. No clone-stamp signatures." },
      { name: "Biometric", status: "PASS", detail: "Photo zone intact. No splicing artifacts. Lighting gradient consistent. Face region hash matches document metadata." },
      { name: "Fusion", status: "PASS", detail: "Weighted fusion score: 12/100 (LOW RISK). All primary signals PASS. Document cleared." }
    ]
  },

  "fake-passport.jpg": {
    status: "FAKE",
    label: "FRAUDULENT DOCUMENT",
    confidence: 92,
    riskLevel: "HIGH",
    riskScore: 94,
    reasons: [
      "MRZ checksum mismatch detected on line 2",
      "Document structure deviates from ICAO standard",
      "Security features absent or simulated",
      "Multiple field inconsistencies found",
      "Pixel-level anomalies in biometric zone"
    ],
    checks: [
      { name: "Quality", status: "FAIL", detail: "Image resolution below 200 DPI. Cannot reliably extract text fields." },
      { name: "Font", status: "FAIL", detail: "Only 4/7 fields extracted. Low confidence on surname and DOB fields." },
      { name: "MRZ", status: "FAIL", detail: "Checksum mismatch on field 2 (document number). Expected check digit: 3. Found: 7. Indicates possible number alteration." },
      { name: "Structure", status: "FAIL", detail: "DOB indicates age 67 but expiry is 30 years from issue — inconsistent with Indian passport validity rules (10 years max)." },
      { name: "Field Consistency", status: "FAIL", detail: "DOB indicates age 67 but expiry is 30 years from issue — inconsistent with Indian passport validity rules (10 years max)." },
      { name: "ELA", status: "FAIL", detail: "Bright ELA region detected in DOB zone (coordinates 340x, 210y). Indicates localized re-save — consistent with digit alteration." },
      { name: "Biometric", status: "FAIL", detail: "Clone stamp signature detected along photo border. Lighting direction inconsistent with rest of document. Possible photo substitution." },
      { name: "Fusion", status: "FAIL", detail: "Weighted fusion score: 94/100 (HIGH RISK). 5 primary signals FAILED. FAKE classification with 92% confidence." }
    ]
  },

  "manipulated-passport.jpg": {
    status: "SUSPICIOUS",
    label: "POSSIBLE TAMPERING",
    confidence: 78,
    riskLevel: "MEDIUM",
    riskScore: 67,
    reasons: [
      "Partial MRZ field alteration suspected",
      "Name field shows reprint artifacts",
      "ELA analysis shows localized compression anomaly near DOB zone",
      "Biometric zone partially consistent",
      "Recommend escalation to Senior Reviewer"
    ],
    checks: [
      { name: "Quality", status: "PASS", detail: "Image resolution 320 DPI. Minor skew detected (0.8°) but within tolerance." },
      { name: "Font", status: "WARN", detail: "OCR character confidence avg 91.2%. Microtext font edges slightly fuzzy." },
      { name: "MRZ", status: "PASS", detail: "All MRZ checks passed. MRZ lines match visual text fields." },
      { name: "Structure", status: "PASS", detail: "All dates and formats are logically consistent." },
      { name: "Field Consistency", status: "FAIL", detail: "Name field reprint artifact detected" },
      { name: "ELA", status: "FAIL", detail: "ELA re-compression highlights localized anomaly in photo bounding box. High probability of pixel manipulation." },
      { name: "Biometric", status: "FAIL", detail: "Clone stamp signature detected along photo border. Possible photo substitution." },
      { name: "Fusion", status: "FAIL", detail: "Weighted fusion score: 76/100. Localized tampering detected in photo region. Recommended for Senior Case Investigation." }
    ]
  }
};

// Default for any other file uploaded
const DEFAULT_RESULT = {
  status: "SUSPICIOUS",
  label: "UNRECOGNIZED DOCUMENT",
  confidence: 61,
  riskLevel: "MEDIUM",
  riskScore: 55,
  reasons: ["Document type not in known template database", "Manual review recommended"],
  checks: [
    { name: "Quality", status: "WARN", detail: "Baseline unavailable for unknown document" },
    { name: "Font", status: "WARN", detail: "Cannot verify" },
    { name: "MRZ", status: "WARN", detail: "MRZ zone not detected" },
    { name: "Structure", status: "WARN", detail: "Template match score below threshold" },
    { name: "Field Consistency", status: "WARN", detail: "Cannot verify" },
    { name: "ELA", status: "WARN", detail: "Baseline unavailable for unknown document" },
    { name: "Biometric", status: "WARN", detail: "Cannot locate biometric zone" },
    { name: "Fusion", status: "WARN", detail: "Weighted fusion score: 55/100 (MEDIUM RISK)." }
  ]
};

/**
 * Returns matching authenticity result based on case-insensitive filename lookup.
 * Includes a 200ms artificial delay.
 */
export async function getAuthenticityResult(filename: string): Promise<any> {
  const nameLower = filename.toLowerCase().trim();
  let matchedKey = "";

  if (nameLower.includes("genuine-passport.jpg") || nameLower === "genuine-passport.jpg") {
    matchedKey = "genuine-passport.jpg";
  } else if (nameLower.includes("fake-passport.jpg") || nameLower === "fake-passport.jpg") {
    matchedKey = "fake-passport.jpg";
  } else if (nameLower.includes("manipulated-passport.jpg") || nameLower === "manipulated-passport.jpg") {
    matchedKey = "manipulated-passport.jpg";
  }

  const result = matchedKey ? DEMO_RESULTS[matchedKey] : DEFAULT_RESULT;

  // Add 200ms artificial delay
  await new Promise((resolve) => setTimeout(resolve, 200));

  // Deep clone to prevent mutating the source object
  return JSON.parse(JSON.stringify(result));
}

export const authenticityService = {
  async checkAuthenticity(params: { filename?: string; documentId?: string; scenarioId?: string }): Promise<any> {
    const filename = params.filename || params.documentId || params.scenarioId || "";
    return getAuthenticityResult(filename);
  }
};
