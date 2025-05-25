import { Component, OnDestroy, OnInit } from '@angular/core';
import { AutoCompleteInputComponent } from "../../components/auto-complete-input/auto-complete-input.component";
import { FormsModule } from '@angular/forms';
import { AlertMessageComponent } from "../../components/alert-message/alert-message.component";
import { CommonModule } from '@angular/common';
import { HdfsServicesService } from '../../services/hdfs-services.service';
import { SpinnerComponent } from "../../components/spinner/spinner.component";
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-file',
  standalone: true,
  imports: [AutoCompleteInputComponent, CommonModule, FormsModule, AlertMessageComponent, SpinnerComponent],
  templateUrl: './add-file.component.html',
  styleUrl: './add-file.component.css'
})
export class AddFileComponent implements OnInit, OnDestroy{

  constructor(
    private hdfsService : HdfsServicesService,
    private router : Router
  ){}

  hdfsPath :string = "";
  selectedFile : File | null = null;
  allPaths : string[] = [];

  // alert component controls
  alertMessage: string = "";
  alertType: number = 0;
  showAlert: boolean = false;

  showSpinner: boolean = false;

  isFormValid : boolean = false;

  addFileSubscription? : Subscription;

  onFileSelected(files : FileList | null): void{
    if(files && files.length==1){
      this.selectedFile = files[0];
      this.validateForm()
    }
  }

  onFormSubmit(): void{
    this.showSpinner = true;
    if (this.selectedFile != null){
      this.addFileSubscription = this.hdfsService.addFileToHDFS(this.selectedFile,this.hdfsPath).subscribe({
        next : (response) =>{
          console.log(response);
          this.showSpinner = false;
          this.showAlertBox(`File ${this.selectedFile?.name} saved successfully in ${response["uploadedPath"]}`,1);
        },
        error : (error) => {
          this.showSpinner = false;
          this.showAlertBox(`Failed to add File ${this.selectedFile?.name} to HDFS`,0);
        }
      });
    }
  }

  onCancelClicked(): void{
    this.router.navigateByUrl("/ops");
  }

  showAlertBox(alertMessage: string, alertType: number): void {
    this.showAlert = true;
    this.alertMessage = alertMessage;
    this.alertType = alertType;
  }

  onHdfsPathChanged(path: string): void{
    this.hdfsPath = path;
    this.validateForm();
  }

  validateForm() : void{
    if(this.selectedFile != null && this.hdfsPath.trim()!=""){
      this.isFormValid=true;
    }else{
      this.isFormValid = false;
    }
  }

  ngOnInit(): void {
    this.showSpinner = true;
    this.hdfsService.getAllDirs().subscribe({
      next : (response) => {
        this.allPaths = response["dirs"];
        this.showSpinner = false;
      },
      error : (error) => {
        this.showSpinner = false;
        console.log("error getting all dirs");
      }
    })
  }

  ngOnDestroy(): void {
    this.addFileSubscription?.unsubscribe();
  }

}
