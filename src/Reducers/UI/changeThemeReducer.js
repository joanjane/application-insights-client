import { CHANGE_UI_THEME } from 'Actions/UI';

export function changeThemeReducer(state, action) {
    if (action.type !== CHANGE_UI_THEME) return;

    const ui = { ...state.ui, ...{ theme: action.payload.theme } };
    return { ...state, ...{ ui: { ...ui } } };
}