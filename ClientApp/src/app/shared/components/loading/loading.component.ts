import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingService } from '../../../core/services/loading.service';
import { DxLoadIndicatorModule } from 'devextreme-angular';
@Component({
  selector: 'loading',
  standalone: true,
  imports: [CommonModule, DxLoadIndicatorModule],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.css',
})
export class LoadingComponent {
  @Input() fullscreen = false;
  @Input() text = '';

  constructor(public loading: LoadingService) {}
}
