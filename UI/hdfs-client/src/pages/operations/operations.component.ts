import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HdfsServicesService } from '../../services/hdfs-services.service';
import { Subscription } from 'rxjs';
import { HadoopStatus } from '../../models/hadoop-status-request';
import { CommonModule } from '@angular/common';
import { SpinnerComponent } from "../../components/spinner/spinner.component";
import { AlertMessageComponent } from "../../components/alert-message/alert-message.component";
import { IJob } from '../../models/job';

@Component({
  selector: 'app-operations',
  standalone: true,
  imports: [RouterLink, CommonModule, SpinnerComponent, AlertMessageComponent],
  templateUrl: './operations.component.html',
  styleUrl: './operations.component.css'
})
export class OperationsComponent implements OnDestroy, OnInit{

  constructor(
    private hdfsService : HdfsServicesService,
  ) {}

  jobs: IJob[] = [
    { id: 1, title: 'Movie Ratings Count', description: 'Counts the total number of ratings for each movie' },
    { id: 2, title: 'Min-Max Ratings', description: 'Finds the lowest and highest ratings for each movie' },
    { id: 3, title: 'Movie Average Ratings', description: 'Calculates the average rating for each movie' },
    { id: 4, title: 'Rating Standard Deviation', description: 'Calculates the standard deviation of each movie ratings'},
    { id: 5, title: 'Rating Coefficient of Variation', description: 'Calculates coefficient of variation of each movie ratings' },
    { id: 6, title: 'Skewness of Movies\' Ratings', description: 'Computes skewness of each movie\'s overall rating distribution'}
  ];

  hdfsBtnTxt : string = "Start";
  yarnBtnTxt : string = "Start";
  hadoopStatus? : HadoopStatus;

  showSpinner : boolean = false;

  showAlertMessage : boolean = false;
  alertMessage : string = "";
  alertType : number = 0;

  toggleHdfsSubscription? : Subscription;
  toggleYarnSubscription? : Subscription;
  getHadoopStatusSubscription? : Subscription;

  ngOnInit(): void {
    this.getHadoopStatusSubscription = this.hdfsService.getHadoopStatus().subscribe({
      next : (response) => {
        this.hadoopStatus = response;
        this.changeHdfsBtnStatus();
        this.changeYarnBtnStatus();
      },
      error : (err) => {
        this.hadoopStatus = {
          status : "error",
          hdfs : false,
          yarn : false
        };
        console.log("Error retrieve hadoop status");
      }
    });
  }

  toggleHDFS() : void {
    this.showSpinner = true;
    if(this.hadoopStatus){
      this.toggleHdfsSubscription = this.hdfsService.toggleHDFS(!this.hadoopStatus.hdfs).subscribe({
        next : (response) => {
          console.log(response);
          this.showSpinner = false;
          if(this.hadoopStatus){
            this.hadoopStatus.hdfs = !this.hadoopStatus.hdfs;
          }
          this.changeHdfsBtnStatus();

        },error : (err) => {
          this.showSpinner = false;
          this.showAlertBox(`Could Not ${this.hdfsBtnTxt} Yarn. Try Again...`,0);
          console.log("Error Happened", err.message);
        }
      })
    }
  }

  toggleYarn() : void{
    this.showSpinner = true;
    if(this.hadoopStatus){
      this.toggleYarnSubscription = this.hdfsService.toggleYarn(!this.hadoopStatus.yarn).subscribe({
        next : (response) => {
          console.log(response);
          this.showSpinner = false;
          if(this.hadoopStatus){
            this.hadoopStatus.yarn = !this.hadoopStatus.yarn;
          }
          this.changeYarnBtnStatus();

        },error : (err) => {
          this.showSpinner = false;
          this.showAlertBox(`Could Not ${this.yarnBtnTxt} Yarn. Try Again...`,0);
          console.log("Error Happened", err.message);
        }
      })
    }
  }

  changeHdfsBtnStatus() : void {
    if(this.hadoopStatus?.hdfs){
      this.hdfsBtnTxt = "Stop";
    }else{
      this.hdfsBtnTxt = "Start";
    }
  }

  changeYarnBtnStatus() : void {
    if(this.hadoopStatus?.yarn){
      this.yarnBtnTxt = "Stop";
    }else{
      this.yarnBtnTxt = "Start";
    }
  }

  toggleAlertMessage() : void {
    this.showAlertMessage = !this.showAlertMessage;
  }

  showAlertBox(message : string, type: number): void{
    this.showAlertMessage = true;
    this.alertMessage = message;
    this.alertType = type;
  }

  ngOnDestroy(): void {
    this.toggleHdfsSubscription?.unsubscribe();
    this.getHadoopStatusSubscription?.unsubscribe();
    this.toggleYarnSubscription?.unsubscribe();
  }

}
