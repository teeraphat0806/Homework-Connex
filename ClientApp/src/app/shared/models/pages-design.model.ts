export interface HomeworkButton {
  label: string;
  theme : ButtonTheme;
  color: string;
  iconCode : string;
  iconSize: number;
  iconColor : string;
  buttonColor : string;
  disabled : boolean;
  textColor : string;
  size : 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export type ButtonTheme = 'Primary' | 'Secondary' | 'Danger';