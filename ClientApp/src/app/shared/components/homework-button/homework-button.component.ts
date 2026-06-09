import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ButtonTheme } from '../../models/pages-design.model';

@Component({
  selector: 'homework-button',
  imports: [],
  templateUrl: './homework-button.component.html',
  styleUrl: './homework-button.component.css',
})
export class HomeworkButton {
  @Input() label: string = '';
  @Input() theme: ButtonTheme = 'Primary';
  @Input() iconCode: string = '';
  @Input() iconSize: number = 16;
  @Input() iconColor: string = '';
  @Input() buttonColor: string = '';
  @Input() disabled: boolean = false;
  @Input() type: 'normal' | 'default' | 'success' | 'danger' = 'default';
  @Input() stylingMode: 'contained' | 'outlined' | 'text' = 'contained';

  @Input() textColor: string | null = null;
  @Input() size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' = 'md';

  @Output() onClick = new EventEmitter<boolean>();

  public defaultTextColor: string | null = "#000000";
  ngOnInit(): void {
    if (!this.label) {
      this.setDefaultLabel()
    }

    this.initThemeColor();
  }


  private setDefaultLabel() {
    this.label = this.theme == "Primary" ? "Confirm" :
      this.theme == "Secondary" ? "Cancel" : "Delete"
  }

  public onClickButton() {
    if (this.disabled) return;
    this.onClick.emit();
  }

  public get sizeClass(): string {
    const map: Record<string, string> = {
      'xs': 'px-2  py-0.5 text-[10px]',
      'sm': 'px-3  py-1   text-xs',
      'md': 'px-8  py-2   text-sm',
      'lg': 'px-10  py-2   text-base',
      'xl': 'px-12  py-2.5 text-lg',
      '2xl': 'px-14  py-3   text-xl',
    };
    return map[this.size] ?? map['md'];
  }

  public initThemeColor(): string {
    switch (this.theme) {
      case 'Primary': return this.defaultTextColor = '#FFFFFF';
      case 'Secondary': return this.defaultTextColor = '#2E8EF8';
      case 'Danger': return this.defaultTextColor = '#FFFFFF';
      default: return this.defaultTextColor = '#000000';
    }
  }
}
