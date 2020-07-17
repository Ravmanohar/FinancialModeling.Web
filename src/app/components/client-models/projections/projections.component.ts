import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService, AuthenticationService } from 'src/app/services';
import { HttpErrorResponse } from '@angular/common/http';
import { ProjectionService } from 'src/app/services/projection.service';
import { ProjectionModel } from 'src/app/models/projection.model';
import { UtcDateService } from 'src/app/services/utc-date.service';
import { ParkingClientModel } from 'src/app/models/add-client-model';
// import { ProjectionInfoModel } from 'src/app/models/projection.model';

declare var toastr;
declare var $;
@Component({
  selector: 'app-projections',
  templateUrl: './projections.component.html',
  styleUrls: ['./projections.component.scss']
})
export class ProjectionsComponent implements OnInit {

  constructor(
    private router: Router,
    public projectionService: ProjectionService,
    public authService: AuthenticationService,
    private utcDateService: UtcDateService
  ) { }

  projectionsList: Array<ProjectionModel> = [];
  ngOnInit() {
    this.getProjections();
  }

  isShowLoader: boolean = false;
  clientInfo: ParkingClientModel = new ParkingClientModel();
  getProjections() {
    this.isShowLoader = true;
    let clientId: number = 0;
    if (this.authService.loggedInUser.role == 'Admin') {
      this.clientInfo = JSON.parse(localStorage.getItem('CurrentClient'));
      clientId = this.clientInfo.clientId;
    }
    else {
      clientId = this.authService.loggedInUser.clientId;
    }

    this.projectionService.getProjectionList(clientId)
      .subscribe((projections: Array<ProjectionModel>) => {
        this.projectionsList = projections;
        this.projectionsList.forEach((projection: ProjectionModel) => {
          projection.createdDateUtc = this.utcDateService.getUtcDate(projection.createdDate);
        });

        this.isShowLoader = false;
      }, (errorResponse: HttpErrorResponse) => {
        this.isShowLoader = false;
        toastr.error("Failed to get projections, please try again!", "Error");
      });
  }

  onViewClientDashboard() {
    this.router.navigate(['/financial-dashboard']);
  }

  onViewProjectionDashboard(projection: ProjectionModel) {
    localStorage.setItem('Projection', JSON.stringify(projection));
    this.router.navigate(['/financial-dashboard', projection.projectionId]);
  }

  projectionName: string = "";
  editedProjection: ProjectionModel = new ProjectionModel();
  onEditProjection(editedProjection: ProjectionModel) {
    this.editedProjection = editedProjection;
    this.projectionName = editedProjection.projectionName;
    $("#update-projection-name-popup").modal('show');
  }

  onUpdateProjection() {
    this.isShowLoader = true;
    this.editedProjection.projectionName = this.projectionName;
    this.projectionService.updateProjection(this.editedProjection)
      .subscribe((projection: ProjectionModel) => {
        toastr.success("Projection Name Updated Successfully.", "Success");
        $("#update-projection-name-popup").modal('hide');
        this.isShowLoader = false;
      }, (errorResponse: HttpErrorResponse) => {
        this.isShowLoader = false;
        toastr.error("Failed To Update Projection Name.", "Error");
      });
  }

  onDeleteProjection(projection: ProjectionModel) {
    this.isShowLoader = true;
    this.projectionService.deleteProjection(projection.projectionId)
      .subscribe((projection: ProjectionModel) => {
        let deletedIndex: number = this.projectionsList.findIndex(x => x.projectionId == projection.projectionId);
        this.projectionsList.splice(deletedIndex, 1);
        toastr.success("Projection Deleted Successfully.", "Success");
        this.isShowLoader = false;
      }, (errorResponse: HttpErrorResponse) => {
        this.isShowLoader = false;
        toastr.error("Failed To Delete Projection.", "Error");
      });
  }


}