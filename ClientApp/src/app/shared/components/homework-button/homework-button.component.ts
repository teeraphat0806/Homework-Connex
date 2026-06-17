import { Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';
import { ButtonTheme } from '../../models/pages-design.model';

@Component({
  selector: 'homework-button',
  standalone: true,
  imports: [],
  templateUrl: './homework-button.component.html',
  styleUrl: './homework-button.component.css',
})
export class HomeworkButton implements OnInit, OnChanges {
  @Input() label: string = '';
  @Input() theme: ButtonTheme = 'Primary';
  @Input() showDefaultLabel: boolean = true;
  @Input() iconCode: string = '';
  @Input() iconSize: number = 16;
  @Input() iconColor: string = '';

  @Input() buttonColor: string = '';
  @Input() textColor: string | null = null;

  @Input() disabled: boolean = false;

  @Input() stylingMode: 'contained' | 'outlined' | 'text' = 'contained';

  @Input() size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' = 'md';

  @Output() onClick = new EventEmitter<void>();

  public defaultTextColor: string | null = '#000000';

  ngOnInit(): void {
    if (!this.label && this.showDefaultLabel) {
      this.setDefaultLabel();
    }

    this.initThemeColor();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['theme'] || changes['stylingMode'] || changes['label'] || changes['showDefaultLabel']) {
      if (!this.label && this.showDefaultLabel) {
        this.setDefaultLabel();
      }
      this.initThemeColor();
    }
  }

  private setDefaultLabel(): void {
    this.label =
      this.theme === 'Primary' ? 'Confirm' : this.theme === 'Secondary' ? 'Cancel' : 'Delete';
  }

  public onClickButton(): void {
    if (this.disabled) return;

    this.onClick.emit();
  }

  public get themeClass(): string {
    const map: Record<string, string> = {
      Primary: 'homework-button-primary',
      Secondary: 'homework-button-secondary',
      Danger: 'homework-button-danger',
    };

    return map[this.theme] ?? map['Primary'];
  }

  public get sizeClass(): string {
    const map: Record<string, string> = {
      xs: 'homework-button-xs',
      sm: 'homework-button-sm',
      md: 'homework-button-md',
      lg: 'homework-button-lg',
      xl: 'homework-button-xl',
      '2xl': 'homework-button-2xl',
    };

    return map[this.size] ?? map['md'];
  }

  public initThemeColor(): void {
    const isOutlinedOrText = this.stylingMode === 'outlined' || this.stylingMode === 'text';

    switch (this.theme) {
      case 'Primary':
        this.defaultTextColor = isOutlinedOrText ? '#2e8ef8' : '#FFFFFF';
        break;

      case 'Secondary':
        this.defaultTextColor = isOutlinedOrText ? '#475569' : '#2E8EF8';
        break;

      case 'Danger':
        this.defaultTextColor = isOutlinedOrText ? '#ef4444' : '#FFFFFF';
        break;

      default:
        this.defaultTextColor = '#000000';
        break;
    }
  }
}
