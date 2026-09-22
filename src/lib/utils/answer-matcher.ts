/**
 * Normalisasi jawaban untuk exact match:
 * - Case-insensitive
 * - Trim whitespace
 * - Ignore spasi
 */
export function normalizeAnswer(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/\s/g, '');
}

/**
 * Validasi jawaban exact match dengan normalisasi.
 * "Jawa Barat" === "JAWABARAT" === "jAWABARAT" === "JawaBarat"
 */
export function matchAnswer(input: string, correctAnswer: string): boolean {
  const normalizedInput = normalizeAnswer(input);
  const normalizedAnswer = normalizeAnswer(correctAnswer);

  if (normalizedInput === '' || normalizedAnswer === '') {
    return false;
  }

  return normalizedInput === normalizedAnswer;
}
