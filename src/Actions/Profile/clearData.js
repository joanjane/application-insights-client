export const CLEAR_DATA = 'CLEAR_DATA';
export function clearData() {
    return { type: CLEAR_DATA, payload: null };
}