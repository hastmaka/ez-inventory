export function extractSelectValues(
  data: Record<string, unknown>,
): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(data)) {
    result[key] = (
      val && typeof val === 'object' && 'label' in val && 'value' in val
    )
      ? (val as { label: unknown; value: unknown }).value
      : val;
  }
  return result;
}
