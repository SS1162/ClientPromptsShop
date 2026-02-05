import { Component } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-buttom-nevigation',
  imports: [DialogModule, ButtonModule,RouterLink],
  templateUrl: './buttom-nevigation.html',
  styleUrl: './buttom-nevigation.scss',
})
export class ButtomNevigation {



  isDialogVisible: boolean = false;

    showImage() {
        this.isDialogVisible = true;
    }
}
