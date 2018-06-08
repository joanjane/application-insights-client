export const ERROR = 'ERROR';
export function errorAction(reason) {
    return { type: ERROR, payload: reason };
}