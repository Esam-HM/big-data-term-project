import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { HdfsServicesService } from '../../services/hdfs-services.service';
import { RouterLink } from '@angular/router';
import { AutoCompleteInputComponent } from '../../components/auto-complete-input/auto-complete-input.component';
import { SpinnerComponent } from '../../components/spinner/spinner.component';
import { AlertMessageComponent } from '../../components/alert-message/alert-message.component';

@Component({
  selector: 'app-files-ops',
  standalone: true,
  imports: [RouterLink, SpinnerComponent, AlertMessageComponent, AutoCompleteInputComponent],
  templateUrl: './files-ops.component.html',
  styleUrl: './files-ops.component.css'
})
export class FilesOpsComponent implements OnInit, OnDestroy {
  
  constructor(private hdfsService : HdfsServicesService){}

  addHDFSPath : string = "";
  selectedFile : File | null = null;

  deleteFilePath : string = "";
  
  allFiles : string[] = [];
  allDirs : string[] = [];

  // alert component controls
  alertMessage: string = "";
  alertType: number = 0;
  showAlert: boolean = false;

  showSpinner: boolean = false;

  isFormValid : boolean = false;

  addFileSubscription? : Subscription;
  deleteFileSubscription? : Subscription;
  getAllPathsSubscription? : Subscription;

  ngOnInit(): void {
    this.showSpinner = true;
    this.getAllPathsSubscription = this.hdfsService.getAllPaths().subscribe({
      next : (response) => {
        console.log(response);
        this.allDirs = response["dirs"];
        this.allFiles = response["files"];
        this.showSpinner = false;
      },
      error : (error) => {
        this.showSpinner = false;
        console.log("error getting all");
      }
    });
  }

  onAddBtnClicked(): void{
    this.showSpinner = true;
    if (this.selectedFile != null){
      this.addFileSubscription = this.hdfsService.addFileToHDFS(this.selectedFile,this.addHDFSPath).subscribe({
        next : (response) =>{
          console.log(response);
          this.showSpinner = false;
          this.showAlertBox(`File ${this.selectedFile?.name} saved successfully in ${response["uploadedPath"]}`,1);
          this.allFiles.push(this.addHDFSPath);
        },
        error : (error) => {
          this.showSpinner = false;
          console.log(error.error["error"]);
          this.showAlertBox(`Failed to add File ${this.selectedFile?.name} to HDFS.`,0);
        }
      });
    }
  }

  onFileSelected(files : FileList | null): void{
    if(files && files.length==1){
      this.selectedFile = files[0];
    }
  }

  onAddHdfsPathChanged(path: string): void{
    this.addHDFSPath = path;
  }

  onDeleteBtnClicked(): void {
    this.showSpinner = true;
    this.deleteFileSubscription = this.hdfsService.deletePath(this.deleteFilePath).subscribe({
      next: (response) => {
        if(response["deleted"]){
          this.showAlertBox(`File : ${response["path"]} Deleted Successfully`,1);
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

  onDeleteHdfsPathChanged(path : string): void{
    this.deleteFilePath = path;
  }

  showAlertBox(alertMessage: string, alertType: number): void {
    this.showAlert = true;
    this.alertMessage = alertMessage;
    this.alertType = alertType;
  }

  ngOnDestroy(): void {
    this.addFileSubscription?.unsubscribe();
    this.deleteFileSubscription?.unsubscribe();
    this.getAllPathsSubscription?.unsubscribe();
  }
}
