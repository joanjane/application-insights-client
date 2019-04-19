export function emptyAction() {
  return { type: 'never', payload: { }, retry: 0 };
}