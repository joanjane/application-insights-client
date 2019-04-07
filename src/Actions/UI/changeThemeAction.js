import { uiActionTypes } from '.';

export const UIThemes = [
  {
    name: 'Dark (default)',
    className: 'theme-default'
  },
  {
    name: 'Light',
    className: 'theme-light'
  }
];

export function changeThemeAction(theme) {
  return { type: uiActionTypes.CHANGE_UI_THEME, payload: { theme: theme } };
}