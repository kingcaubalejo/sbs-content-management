import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTreeModule } from '@angular/material/tree';
import { CdkTreeModule } from '@angular/cdk/tree';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { MatDialogModule, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';

interface BookNode {
  name: string;
  type: 'volume' | 'book';
  id?: number;
  children?: BookNode[];
  totalBooks?: number;
  currentBookPage?: number;
  totalBookPages?: number;
}

interface FlatNode {
  expandable: boolean;
  name: string;
  level: number;
  type: 'volume' | 'book';
  id?: number;
  totalBooks?: number;
  currentBookPage?: number;
  totalBookPages?: number;
}

@Component({
  selector: 'app-books',
  imports: [
    CommonModule,
    MatTreeModule,
    CdkTreeModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatPaginatorModule
  ],
  templateUrl: './books.component.html',
  styleUrl: './books.component.css'
})
export class BooksComponent {
  searchTerm = '';
  selectedVolume = '';
  pageSize = 2;
  currentPage = 0;
  totalPages = 0;
  bookPageSize = 3;
  bookPages: { [key: string]: number } = {};
  
  private _transformer = (node: BookNode, level: number): FlatNode => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
      type: node.type,
      id: node.id,
      totalBooks: node.totalBooks,
      currentBookPage: node.currentBookPage,
      totalBookPages: node.totalBookPages
    };
  };

  treeControl = new FlatTreeControl<FlatNode>(
    node => node.level,
    node => node.expandable
  );

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    node => node.level,
    node => node.expandable,
    node => node.children
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  allData: BookNode[] = [
    {
      name: 'Vol 001',
      type: 'volume',
      children: [
        { name: 'Book 001 - Introduction to Spirituality', type: 'book', id: 1 },
        { name: 'Book 002 - Basic Principles', type: 'book', id: 2 },
        { name: 'Book 003 - Foundation Stones', type: 'book', id: 3 }
      ]
    },
    {
      name: 'Vol 002',
      type: 'volume',
      children: [
        { name: 'Book 001 - Advanced Teachings', type: 'book', id: 4 },
        { name: 'Book 002 - Deeper Understanding', type: 'book', id: 5 },
        { name: 'Book 003 - Spiritual Growth', type: 'book', id: 8 },
        { name: 'Book 004 - Inner Wisdom', type: 'book', id: 9 },
        { name: 'Book 005 - Divine Connection', type: 'book', id: 10 },
        { name: 'Book 006 - Sacred Knowledge', type: 'book', id: 11 },
        { name: 'Book 007 - Enlightenment Path', type: 'book', id: 12 },
        { name: 'Book 008 - Cosmic Consciousness', type: 'book', id: 13 },
        { name: 'Book 009 - Universal Truth', type: 'book', id: 14 },
        { name: 'Book 010 - Eternal Wisdom', type: 'book', id: 15 },
        { name: 'Book 011 - Higher Dimensions', type: 'book', id: 16 },
        { name: 'Book 012 - Soul Evolution', type: 'book', id: 17 }
      ]
    },
    {
      name: 'Vol 003',
      type: 'volume',
      children: [
        { name: 'Book 001 - Practical Applications', type: 'book', id: 6 },
        { name: 'Book 002 - Daily Practice', type: 'book', id: 7 },
        { name: 'Book 003 - Meditation Techniques', type: 'book', id: 18 },
        { name: 'Book 004 - Breathing Exercises', type: 'book', id: 19 },
        { name: 'Book 005 - Energy Healing', type: 'book', id: 20 },
        { name: 'Book 006 - Chakra Balancing', type: 'book', id: 21 },
        { name: 'Book 007 - Mindfulness Practice', type: 'book', id: 22 },
        { name: 'Book 008 - Spiritual Discipline', type: 'book', id: 23 },
        { name: 'Book 009 - Prayer Methods', type: 'book', id: 24 },
        { name: 'Book 010 - Sacred Rituals', type: 'book', id: 25 },
        { name: 'Book 011 - Divine Service', type: 'book', id: 26 },
        { name: 'Book 012 - Community Building', type: 'book', id: 27 },
        { name: 'Book 013 - Leadership Training', type: 'book', id: 28 },
        { name: 'Book 014 - Teaching Methods', type: 'book', id: 29 },
        { name: 'Book 015 - Spiritual Counseling', type: 'book', id: 30 }
      ]
    }
  ];

  volumes = ['Vol 001', 'Vol 002', 'Vol 003'];

  constructor(private dialog: MatDialog, private fb: FormBuilder) {
    this.updateTreeData();
  }

  hasChild = (_: number, node: FlatNode) => node.expandable;

  updateTreeData() {
    let filteredData = [...this.allData];

    if (this.selectedVolume) {
      filteredData = filteredData.filter(volume => volume.name === this.selectedVolume);
    }

    if (this.searchTerm) {
      filteredData = filteredData.map(volume => ({
        ...volume,
        children: volume.children?.filter(book => 
          book.name.toLowerCase().includes(this.searchTerm.toLowerCase())
        )
      })).filter(volume => volume.children && volume.children.length > 0);
    }

    // Paginate books within each volume
    const dataWithPaginatedBooks = filteredData.map(volume => {
      if (volume.children && volume.children.length > 0) {
        const volumeKey = volume.name;
        const currentBookPage = this.bookPages[volumeKey] || 0;
        const startIndex = currentBookPage * this.bookPageSize;
        const paginatedBooks = volume.children.slice(startIndex, startIndex + this.bookPageSize);
        
        return {
          ...volume,
          children: paginatedBooks,
          totalBooks: volume.children.length,
          currentBookPage,
          totalBookPages: Math.ceil(volume.children.length / this.bookPageSize)
        };
      }
      return volume;
    });

    this.totalPages = Math.ceil(dataWithPaginatedBooks.length / this.pageSize);
    const startIndex = this.currentPage * this.pageSize;
    const paginatedData = dataWithPaginatedBooks.slice(startIndex, startIndex + this.pageSize);

    this.dataSource.data = paginatedData;
    this.treeControl.expandAll();
  }

  nextPage() {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.updateTreeData();
    }
  }

  previousPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.updateTreeData();
    }
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.updateTreeData();
  }

  onSearchChange() {
    this.updateTreeData();
  }

  onVolumeChange() {
    this.updateTreeData();
  }

  updateBook(book: FlatNode) {
    console.log('Update book:', book);
  }

  deleteBook(book: FlatNode) {
    this.allData.forEach(volume => {
      if (volume.children) {
        volume.children = volume.children.filter(b => b.id !== book.id);
      }
    });
    this.updateTreeData();
  }

  viewBook(book: FlatNode) {
    console.log('View book:', book);
  }

  nextBookPage(volumeName: string) {
    const volume = this.allData.find(v => v.name === volumeName);
    if (volume && volume.children) {
      const currentPage = this.bookPages[volumeName] || 0;
      const totalPages = Math.ceil(volume.children.length / this.bookPageSize);
      if (currentPage < totalPages - 1) {
        this.bookPages[volumeName] = currentPage + 1;
        this.updateTreeData();
      }
    }
  }

  previousBookPage(volumeName: string) {
    const currentPage = this.bookPages[volumeName] || 0;
    if (currentPage > 0) {
      this.bookPages[volumeName] = currentPage - 1;
      this.updateTreeData();
    }
  }

  clearFilters() {
    this.searchTerm = '';
    this.selectedVolume = '';
    this.currentPage = 0;
    this.bookPages = {};
    this.updateTreeData();
  }

  openAddBookModal() {
    const dialogRef = this.dialog.open(BookModalComponent, {
      width: '500px',
      data: { volumes: this.volumes }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const targetVolume = this.allData.find(v => v.name === result.volume);
        if (targetVolume && targetVolume.children) {
          const newBookId = Math.max(...this.allData.flatMap(v => v.children?.map(b => b.id || 0) || [0])) + 1;
          const bookNumber = String(targetVolume.children.length + 1).padStart(3, '0');
          targetVolume.children.push({
            name: `Book ${bookNumber} - ${result.title}`,
            type: 'book',
            id: newBookId
          });
          this.updateTreeData();
        }
      }
    });
  }
}

@Component({
  selector: 'app-book-modal',
  template: `
    <h2 mat-dialog-title>Add New Book</h2>
    <mat-dialog-content>
      <form [formGroup]="bookForm">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Volume</mat-label>
          <mat-select formControlName="volume">
            <mat-option *ngFor="let volume of volumes" [value]="volume">
              {{ volume }}
            </mat-option>
          </mat-select>
        </mat-form-field>
        
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Book Title</mat-label>
          <input matInput formControlName="title" placeholder="Enter book title">
        </mat-form-field>
        
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Description</mat-label>
          <textarea matInput formControlName="description" rows="3" placeholder="Enter book description"></textarea>
        </mat-form-field>
        
        <div class="content-editor">
          <label class="editor-label">Content</label>
          <div class="editor-toolbar">
            <button type="button" mat-icon-button (click)="formatText('bold')" title="Bold">
              <mat-icon>format_bold</mat-icon>
            </button>
            <button type="button" mat-icon-button (click)="formatText('italic')" title="Italic">
              <mat-icon>format_italic</mat-icon>
            </button>
            <button type="button" mat-icon-button (click)="formatText('underline')" title="Underline">
              <mat-icon>format_underlined</mat-icon>
            </button>
            <button type="button" mat-icon-button (click)="formatText('insertUnorderedList')" title="Bullet List">
              <mat-icon>format_list_bulleted</mat-icon>
            </button>
          </div>
          <div #contentEditor 
               class="content-input" 
               contenteditable="true" 
               (input)="onContentChange($event)"
               placeholder="Enter book content...">
          </div>
        </div>
        
        <div class="content-preview" *ngIf="bookForm.get('volume')?.value || bookForm.get('title')?.value || bookForm.get('description')?.value || content">
          <label class="editor-label">Mobile Preview</label>
          <div class="mobile-frame">
            <div class="mobile-header">
              <div class="mobile-notch"></div>
            </div>
            <div class="mobile-screen">
              <div class="preview-content">
                <div class="book-header" *ngIf="bookForm.get('volume')?.value">
                  <div class="volume-badge">{{ bookForm.get('volume')?.value }}</div>
                </div>
                <h2 class="book-title" *ngIf="bookForm.get('title')?.value">{{ bookForm.get('title')?.value }}</h2>
                <p class="book-description" *ngIf="bookForm.get('description')?.value">{{ bookForm.get('description')?.value }}</p>
                <div class="book-content" *ngIf="content" [innerHTML]="content"></div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-raised-button color="primary" (click)="onSave()" [disabled]="bookForm.invalid">Save</button>
    </mat-dialog-actions>
  `,
  styles: [`
    :host { color: #3c2415; }
    .full-width { width: 100%; margin-bottom: 16px; }
    .content-editor { margin-bottom: 16px; }
    .editor-label { 
      display: block; 
      font-size: 14px; 
      color: #3c2415; 
      margin-bottom: 8px; 
      font-weight: 500;
    }
    .editor-toolbar { 
      border: 1px solid #d2b48c; 
      border-bottom: none; 
      padding: 8px; 
      background: #f7f3e9;
      border-radius: 4px 4px 0 0;
    }
    .content-input { 
      min-height: 150px; 
      border: 1px solid #d2b48c; 
      padding: 12px; 
      outline: none;
      border-radius: 0 0 4px 4px;
      color: #3c2415;
    }
    .content-input:focus { 
      border-color: #8b4513; 
    }
    .content-input[placeholder]:empty:before {
      content: attr(placeholder);
      color: #999;
    }
    .content-preview { margin-bottom: 16px; }
    .mobile-frame {
      width: 300px;
      margin: 0 auto;
      background: #333;
      border-radius: 20px;
      padding: 8px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    }
    .mobile-header {
      height: 20px;
      background: #333;
      border-radius: 12px 12px 0 0;
      position: relative;
    }
    .mobile-notch {
      width: 60px;
      height: 6px;
      background: #666;
      border-radius: 3px;
      position: absolute;
      top: 7px;
      left: 50%;
      transform: translateX(-50%);
    }
    .mobile-screen {
      background: white;
      border-radius: 0 0 12px 12px;
      overflow: hidden;
    }
    .preview-content { 
      padding: 16px; 
      background: white;
      min-height: 200px;
      font-size: 14px;
      line-height: 1.5;
    }
    .book-header { margin-bottom: 12px; }
    .volume-badge {
      display: inline-block;
      background: #8b4513;
      color: white;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
    }
    .book-title {
      margin: 12px 0 8px 0;
      font-size: 18px;
      font-weight: 600;
      color: #3c2415;
      line-height: 1.3;
    }
    .book-description {
      margin: 0 0 16px 0;
      color: #666;
      font-style: italic;
      line-height: 1.4;
    }
    .book-content {
      border-top: 1px solid #eee;
      padding-top: 16px;
      color: #3c2415;
    }
  `],
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule
  ]
})
export class BookModalComponent {
  bookForm: FormGroup;
  volumes: string[];
  content = '';

  constructor(
    private dialogRef: MatDialogRef<BookModalComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: { volumes: string[] }
  ) {
    this.volumes = data?.volumes || ['Vol 001', 'Vol 002', 'Vol 003'];
    this.bookForm = this.fb.group({
      volume: ['', Validators.required],
      title: ['', Validators.required],
      description: [''],
      content: ['']
    });
  }

  formatText(command: string) {
    document.execCommand(command, false);
  }

  onContentChange(event: any) {
    this.content = event.target.innerHTML;
    this.bookForm.patchValue({ content: this.content });
  }

  onCancel() {
    this.dialogRef.close();
  }

  onSave() {
    if (this.bookForm.valid) {
      const formData = { ...this.bookForm.value, content: this.content };
      this.dialogRef.close(formData);
    }
  }
}
