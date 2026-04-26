import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { ButtonModule } from 'primeng/button';
import { AnimateOnScrollModule } from 'primeng/animateonscroll';
import { AccordionModule } from 'primeng/accordion';
import { environment } from '../../../environments/environment.development';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ChartModule, ButtonModule, AnimateOnScrollModule, AccordionModule,RouterModule],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home implements OnInit {
  chartData: any;
  chartOptions: any;
  BASIC_URL:string=environment.reviewImageBaseUrl;

  ngOnInit() {
    this.chartData = {
      labels: ['Ready Designs', 'Elements', 'Site Templates', 'Plugins'],
      datasets: [
        {
          label: 'Website Purchases',
          data: [540, 325, 702, 420],
          backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726', '#AB47BC'],
          hoverBackgroundColor: ['#64B5F6', '#81C784', '#FFB74D', '#BA68C8']
        }
      ]
    };

    this.chartOptions = {
      plugins: {
        legend: { position: 'bottom' }
      },
      responsive: true,
      maintainAspectRatio: false
    };
  }
}