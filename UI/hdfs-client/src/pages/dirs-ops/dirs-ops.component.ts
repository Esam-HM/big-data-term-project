import { Component, OnDestroy, OnInit } from '@angular/core';
import { SpinnerComponent } from '../../components/spinner/spinner.component';
import { AutoCompleteInputComponent } from '../../components/auto-complete-input/auto-complete-input.component';
import { AlertMessageComponent } from '../../components/alert-message/alert-message.component';
import { HdfsServicesService } from '../../services/hdfs-services.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dirs-ops',
  standalone: true,
  imports: [SpinnerComponent, AutoCompleteInputComponent, AlertMessageComponent],
  templateUrl: './dirs-ops.component.html',
  styleUrl: './dirs-ops.component.css'
})
export class DirsOpsComponent implements OnInit, OnDestroy {

  constructor(private hdfsService : HdfsServicesService){}

  dirPathToCreate : string = "";

  dirPathToDelete : string = "";

  allDirs : string[] = [];

  // alert component controls
  alertMessage: string = "";
  alertType: number = 0;
  showAlert: boolean = false;

  showSpinner: boolean = false;

  createDirSubscription? : Subscription;
  deleteDirSubscription? : Subscription;
  getDirsSubscription? : Subscription;

  ngOnInit(): void {
    this.showSpinner = true;
    this.getDirsSubscription = this.hdfsService.getAllDirs().subscribe({
      next : (response) => {
        console.log(response);
        this.allDirs = response["dirs"];
        this.showSpinner = false;
      },
      error : (error) => {
        this.showSpinner = false;
        console.log("error getting all");
      }
    });
  }

  onCreateBtnClicked(): void{
    this.showSpinner = true;
    this.createDirSubscription = this.hdfsService.createNewDir(this.dirPathToCreate).subscribe({
      next : (response) =>{
        console.log(response);
        this.showSpinner = false;
        this.showAlertBox(`${this.dirPathToCreate} created successfully.`,1);
        this.allDirs.push(response["createdPath"]);
      },
      error : (error) => {
        this.showSpinner = false;
        console.log(error.error["error"]);
        this.showAlertBox(`Error happend while creating ${this.dirPathToCreate} in HDFS.`,0);
      }
    });
  }

  onDirPathToCreateChanged(path: string): void{
    this.dirPathToCreate = path;
  }

  onDeleteBtnClicked(): void {
    this.showSpinner = true;
    this.deleteDirSubscription = this.hdfsService.deletePath(this.dirPathToDelete).subscribe({
      next: (response) => {
        console.log(response);
        if(response["deleted"]){
          this.showAlertBox(`File : ${response["path"]} Deleted Successfully`,1);
          const index : number = this.allDirs.indexOf(response["path"]);
          this.allDirs.splice(index,1);
        }else{
          this.showAlertBox(`Could Not Delete File ${response["path"]}`,0);
        }
        this.showSpinner = false;
      },
      error : (error) => {
        this.showSpinner = false;
        console.log(error.error["error"]);
        this.showAlertBox(`Error Happened while Deleting file`,0);
      }
    });
  }

  onDirPathToDeleteChanged(path : string): void{
    this.dirPathToDelete = path;
  }

  showAlertBox(alertMessage: string, alertType: number): void {
    this.showAlert = true;
    this.alertMessage = alertMessage;
    this.alertType = alertType;
  }

  ngOnDestroy(): void {
    this.createDirSubscription?.unsubscribe();
    this.deleteDirSubscription?.unsubscribe();
    this.getDirsSubscription?.unsubscribe();
  }

}
