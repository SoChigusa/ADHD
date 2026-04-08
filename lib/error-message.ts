export function getErrorMessage(
  error: unknown,
  fallback = "予期しないエラーが発生しました。",
): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}
