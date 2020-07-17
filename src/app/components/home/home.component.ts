import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

declare var $;
declare var Chart;
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
    $(document).ready(() => {
      this.renderLineChart();

      this.renderPieChart("#pieChart", [500, 200, 300]);
      this.renderPieChart("#pieChart1", [300, 50, 100]);
      this.renderPieChart("#pieChart2", [600, 50, 100]);
    });
  }

  renderPieChart(elementId: string, data: any) {
    var ctxPie = $(elementId).get(0).getContext("2d");
    new Chart(ctxPie, {
      type: 'pie', data:
      {
        labels: ["OnStreet", "OffStreet", "Garages"],
        datasets: [
          {
            data: data,
            backgroundColor: ["#5b9bd5", "#1f3864", "#4472c4"]
          }
        ]
      }
      , options: { responsive: true }
    });
  }

  renderLineChart() {
    var lineData = {
      labels: ["Year1", "Year2", "Year3", "Year4", "Year5"],
      datasets: [
        {
          label: "OnStreet",
          backgroundColor: '#5b9bd5',
          borderColor: '#5b9bd5',
          pointBorderColor: "#fff",
          data: [400000, 200000, 100000, 200000, 200000],
          fill: false,
        },
        {
          label: "OffStreet",
          backgroundColor: '#1f3864',
          borderColor: '#1f3864',
          pointBorderColor: "#fff",
          data: [800000, 300000, 100000, 200000, 200000],
          fill: false,
        },
        {
          label: "Garages",
          backgroundColor: '#4472c4',
          borderColor: '#4472c4',
          pointBorderColor: "#fff",
          data: [500000, 100000, 100000, 200000, 200000],
          fill: false,
        }
      ]
    };
    var lineOptions = {
      responsive: true,
    };
    var ctxLine = $("#lineChart").get(0).getContext("2d");
    new Chart(ctxLine, { type: 'line', data: lineData, options: lineOptions });
  }

}
