import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

interface Language {
  id: number;
  languageName: string;
  shortTitle: string;
  numberOfBooks: number;
}

@Component({
  selector: 'app-languages',
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule
  ],
  templateUrl: './languages.component.html',
  styleUrl: './languages.component.css'
})
export class LanguagesComponent {
  displayedColumns: string[] = ['languageName', 'shortTitle', 'numberOfBooks', 'actions'];
  languages: Language[] = [
    { id: 1, languageName: 'English', shortTitle: 'EN', numberOfBooks: 45 },
    { id: 2, languageName: 'Spanish', shortTitle: 'ES', numberOfBooks: 32 },
    { id: 3, languageName: 'French', shortTitle: 'FR', numberOfBooks: 28 },
    { id: 4, languageName: 'German', shortTitle: 'DE', numberOfBooks: 21 },
    { id: 5, languageName: 'Italian', shortTitle: 'IT', numberOfBooks: 18 }
  ];

  constructor(private dialog: MatDialog, private fb: FormBuilder) {}

  openAddLanguageModal() {
    const dialogRef = this.dialog.open(LanguageModalComponent, {
      width: '500px',
      data: { language: null }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const newLanguage: Language = {
          id: this.languages.length + 1,
          languageName: result.languageName,
          shortTitle: result.shortTitle,
          numberOfBooks: 0
        };
        this.languages.push(newLanguage);
      }
    });
  }

  updateLanguage(language: Language) {
    console.log('Update language:', language);
  }

  deleteLanguage(language: Language) {
    this.languages = this.languages.filter(l => l.id !== language.id);
  }

  viewLanguage(language: Language) {
    console.log('View language:', language);
  }
}

@Component({
  selector: 'app-language-modal',
  template: `
    <h2 mat-dialog-title>Add New Language</h2>
    <mat-dialog-content>
      <form [formGroup]="languageForm">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Language Name</mat-label>
          <input matInput formControlName="languageName" placeholder="Enter language name">
        </mat-form-field>
        
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Short Title</mat-label>
          <input matInput formControlName="shortTitle" placeholder="Enter short title (e.g., EN, ES)" maxlength="3">
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-raised-button color="primary" (click)="onSave()" [disabled]="languageForm.invalid">Save</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .full-width { width: 100%; margin-bottom: 16px; }
  `],
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule
  ]
})
export class LanguageModalComponent {
  languageForm: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<LanguageModalComponent>,
    private fb: FormBuilder
  ) {
    this.languageForm = this.fb.group({
      languageName: ['', Validators.required],
      shortTitle: ['', [Validators.required, Validators.maxLength(3)]]
    });
  }

  onCancel() {
    this.dialogRef.close();
  }

  onSave() {
    if (this.languageForm.valid) {
      this.dialogRef.close(this.languageForm.value);
    }
  }
}
