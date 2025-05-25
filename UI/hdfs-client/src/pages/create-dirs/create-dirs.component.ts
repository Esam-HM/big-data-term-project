import { Component, OnDestroy, OnInit } from '@angular/core';
import { SpinnerComponent } from '../../components/spinner/spinner.component';
import { AlertMessageComponent } from '../../components/alert-message/alert-message.component';
import { AutoCompleteInputComponent } from '../../components/auto-complete-input/auto-complete-input.component';
import { HdfsServicesService } from '../../services/hdfs-services.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-create-dirs',
  standalone: true,
  imports: [ SpinnerComponent, AlertMessageComponent, AutoCompleteInputComponent],
  templateUrl: './create-dirs.component.html',
  styleUrl: './create-dirs.component.css'
})
export class CreateDirsComponent implements OnInit, OnDestroy {

  constructor(private hdfsService: HdfsServicesService ){}
  
  allFiles : string[] = []
  hdfsFilePath : string = "";
  
  showAlert :  boolean = false;
  alertMessage: string = "";
  alertType : number = 0;

  showSpinner : boolean = false;

  getAllFilesSubscription? : Subscription;
  deleteFileSubscription? : Subscription;

  ngOnInit(): void {
    this.showSpinner = true;
    
    this.getAllFilesSubscription = this.hdfsService.getAllFiles().subscribe({
      next: (response) => {
        this.allFiles = response["files"];
        console.log(response);
      },
      error: (error) => {
        console.log("Error retrieving files");
      }
    });

  }

  onHdfsPathChanged(path : string): void{
    this.hdfsFilePath = path;
  }

  onDeleteFileClicked(): void {
    this.showSpinner = true;
    this.deleteFileSubscription = this.hdfsService.deletePath(this.hdfsFilePath).subscribe({
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
        console.log(error.message);
        this.showAlertBox(`Error Happened while Deleting file`,0);
      }
    })
    console.log(this.hdfsFilePath);
  }

  showAlertBox(message: string, type: number): void{
    this.showAlert = true;
    this.alertMessage = message;
    this.alertType = type;
  }

  ngOnDestroy(): void {
    this.getAllFilesSubscription?.unsubscribe();
    this.deleteFileSubscription?.unsubscribe();
  }
}
