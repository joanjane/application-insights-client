export const ERROR = 'ERROR';
export function error(reason) {
    return { type: ERROR, payload: reason };
}