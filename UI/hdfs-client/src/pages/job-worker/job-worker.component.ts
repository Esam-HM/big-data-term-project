import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { SpinnerComponent } from '../../components/spinner/spinner.component';
import { AutoCompleteInputComponent } from '../../components/auto-complete-input/auto-complete-input.component';
import { AlertMessageComponent } from '../../components/alert-message/alert-message.component';
import { HdfsServicesService } from '../../services/hdfs-services.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-job-worker',
  standalone: true,
  imports: [CommonModule, SpinnerComponent, AutoCompleteInputComponent, AlertMessageComponent],
  templateUrl: './job-worker.component.html',
  styleUrl: './job-worker.component.css'
})
export class JobWorkerComponent implements OnInit, OnDestroy {
  constructor(
    private route : ActivatedRoute,
    private hdfsService : HdfsServicesService
  ){} 

  showAlert: boolean = false;
  alertType: number = 0;
  alertMessage : string = "";

  showSpinner: boolean = false;
  spinnerMessage : string = "";

  jobId : string | null = null;
  jobName : string | null = null;
  inputFilePath: string = "";
  outputDirPath: string = "";

  allFiles : string[] = [];
  allDirs : string[] = [];

  routeParamsSubscription? : Subscription;
  getAllPathsSubscription? : Subscription;
  submitJobSubscription?: Subscription;

  onSubmitBtnClicked() : void{
    this.showSpinner = true;
    if(this.jobId){
      this.submitJobSubscription = this.hdfsService.submitJob(this.jobId,this.inputFilePath,this.outputDirPath).subscribe({
        next: (response) => {
          console.log(response);
          this.showSpinner = false;
        },
        error: (errorResponse) => {
          console.log(errorResponse.error);
          this.showSpinner = false;
        }
      });
    }
  }

  ngOnInit(): void {
    this.routeParamsSubscription = this.route.paramMap.subscribe({
      next : (params) => {
        this.jobId = params.get("id");
        this.jobName = params.get("job");
        console.log(this.jobId, this.jobName)
      }
    });

    if(this.jobId !=null){
      this.showSpinner = true;
      this.getAllPathsSubscription = this.hdfsService.getAllPaths().subscribe({
        next : (response) => {
          console.log(response);
          this.allDirs = response["dirs"];
          this.allFiles = response["files"];
          this.showSpinner = false;
        },
        error : (errorResponse) => {
          this.showSpinner = false;
          console.log("error getting all paths.", `message : ${errorResponse.error?.error}`);
        }
      });
    }
  }

  get jobNameGetter() : string{
    return `Submit ${this.jobName} Job`;
  }
  
  ngOnDestroy(): void {
    this.routeParamsSubscription?.unsubscribe();
    this.getAllPathsSubscription?.unsubscribe();
  }


}
