import { Component } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-bottom-navigation',
  imports: [DialogModule, ButtonModule,RouterLink],
  templateUrl: './bottom-navigation.html',
  styleUrl: './bottom-navigation.scss',
})
export class BottomNavigation {



  isDialogVisible: boolean = false;

    showImage() {
        this.isDialogVisible = true;
    }
}
