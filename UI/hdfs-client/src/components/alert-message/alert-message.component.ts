import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core';
import { Subscription, timer } from 'rxjs';

@Component({
  selector: 'app-alert-message',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alert-message.component.html',
  styleUrl: './alert-message.component.css'
})
export class AlertMessageComponent implements OnDestroy, OnChanges {
  @Input() alertType : number = 1;
  @Input() message : string = "";
  @Input() isVisible : boolean = false;
  @Output() toggleVisibility = new EventEmitter();


  timerSubscription? : Subscription;

  alerts : string[] = [
    "alert-danger",
    "alert-success",
    "alert-info",
    "alert-warning"
  ];

  // ngOnInit(): void {
  //   console.log('Component initialized');
  // }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['isVisible']){
      if(this.isVisible===true){
        this.timerSubscription?.unsubscribe();
        this.timerSubscription = timer(3000).subscribe({
          next: () => {
            this.toggleVisibility.emit();
          }
        });
      }
    }
  }

  ngOnDestroy(): void {
    this.timerSubscription?.unsubscribe();
  }
}
