import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

interface Volume {
  id: number;
  volumeNumber: string;
  availableBooks: number;
  imageUrl: string;
  description: string;
}

@Component({
  selector: 'app-volumes',
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
  templateUrl: './volumes.component.html',
  styleUrl: './volumes.component.css'
})
export class VolumesComponent {
  displayedColumns: string[] = ['volumeNumber', 'availableBooks', 'actions'];
  volumes: Volume[] = [
    { id: 1, volumeNumber: 'Vol 001', availableBooks: 25, imageUrl: '', description: 'First volume of spiritual teachings' },
    { id: 2, volumeNumber: 'Vol 002', availableBooks: 18, imageUrl: '', description: 'Second volume covering advanced topics' },
    { id: 3, volumeNumber: 'Vol 003', availableBooks: 32, imageUrl: '', description: 'Third volume with practical applications' }
  ];

  constructor(private dialog: MatDialog, private fb: FormBuilder) {}

  openAddVolumeModal() {
    const dialogRef = this.dialog.open(VolumeModalComponent, {
      width: '500px',
      data: { volume: null }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const newVolume: Volume = {
          id: this.volumes.length + 1,
          volumeNumber: `Vol ${String(this.volumes.length + 1).padStart(3, '0')}`,
          availableBooks: 0,
          imageUrl: result.imageUrl,
          description: result.description
        };
        this.volumes.push(newVolume);
      }
    });
  }

  updateVolume(volume: Volume) {
    console.log('Update volume:', volume);
  }

  deleteVolume(volume: Volume) {
    this.volumes = this.volumes.filter(v => v.id !== volume.id);
  }

  viewVolume(volume: Volume) {
    console.log('View volume:', volume);
  }
}

@Component({
  selector: 'app-volume-modal',
  template: `
    <h2 mat-dialog-title>Add New Volume</h2>
    <mat-dialog-content>
      <form [formGroup]="volumeForm">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Image URL</mat-label>
          <input matInput formControlName="imageUrl" placeholder="Enter image URL">
        </mat-form-field>
        
        <div class="image-preview" *ngIf="volumeForm.get('imageUrl')?.value">
          <img [src]="volumeForm.get('imageUrl')?.value" 
               alt="Volume preview" 
               (error)="onImageError($event)"
               (load)="onImageLoad($event)">
        </div>
        
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Description</mat-label>
          <textarea matInput formControlName="description" rows="4" placeholder="Enter description"></textarea>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-raised-button color="primary" (click)="onSave()" [disabled]="volumeForm.invalid">Save</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .full-width { width: 100%; margin-bottom: 16px; }
    .image-preview { 
      margin: 16px 0; 
      text-align: center; 
      border: 1px solid #d2b48c; 
      border-radius: 8px; 
      padding: 8px; 
      background: #f7f3e9;
    }
    .image-preview img { 
      max-width: 100%; 
      max-height: 200px; 
      border-radius: 4px; 
    }
    ::ng-deep .mat-mdc-dialog-title {
      color: #3c2415 !important;
    }
    ::ng-deep .mat-mdc-raised-button.mat-primary {
      background-color: #8b4513 !important;
    }
    ::ng-deep .mat-mdc-outlined-text-field:not(.mdc-text-field--disabled).mdc-text-field--focused .mdc-notched-outline__leading,
    ::ng-deep .mat-mdc-outlined-text-field:not(.mdc-text-field--disabled).mdc-text-field--focused .mdc-notched-outline__notch,
    ::ng-deep .mat-mdc-outlined-text-field:not(.mdc-text-field--disabled).mdc-text-field--focused .mdc-notched-outline__trailing {
      border-color: #8b4513 !important;
    }
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
export class VolumeModalComponent {
  volumeForm: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<VolumeModalComponent>,
    private fb: FormBuilder
  ) {
    this.volumeForm = this.fb.group({
      imageUrl: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  onCancel() {
    this.dialogRef.close();
  }

  onSave() {
    if (this.volumeForm.valid) {
      this.dialogRef.close(this.volumeForm.value);
    }
  }

  onImageError(event: any) {
    event.target.style.display = 'none';
  }

  onImageLoad(event: any) {
    event.target.style.display = 'block';
  }
}
