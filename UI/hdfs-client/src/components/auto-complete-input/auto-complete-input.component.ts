import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-auto-complete-input',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './auto-complete-input.component.html',
  styleUrl: './auto-complete-input.component.css'
})
export class AutoCompleteInputComponent {
  @Input() inputValue: string = "";
  @Input() placeholder : string = "";
  @Input() suggestions : string[] = [];

  @Output() inputValueChanged = new EventEmitter<string>();

  showSuggestions : boolean = false;
  filteredSuggestions: string[] = [];

  onInputChange() {
    const input : string = this.inputValue.toLowerCase();
    this.filteredSuggestions = this.suggestions.filter(suggestion =>
      suggestion.toLowerCase().startsWith(input)
    );
    this.inputValueChanged.emit(input)
  }

  selectSuggestion(suggestion: string) {
    this.inputValueChanged.emit(suggestion)
    this.showSuggestions = false;
  }

  hideSuggestions() {
    setTimeout(() => (this.showSuggestions = false), 200); // Delay to allow click
  }

  onFocus(): void{
    this.showSuggestions = true;
  }
}
