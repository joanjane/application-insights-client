export const CHANGE_UI_THEME = 'CHANGE_UI_THEME';

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
  return { type: CHANGE_UI_THEME, payload: { theme: theme } };
}