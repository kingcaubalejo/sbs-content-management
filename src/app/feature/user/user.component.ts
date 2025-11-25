import { Component, signal, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  lastLogin: Date;
}

@Component({
  selector: 'app-user',
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule
  ],
  template: `
    <div class="users-container">
      <div class="dashboard-header">
        <h1>User Management</h1>
        <p>Manage system users and permissions</p>
      </div>

      <div class="table-container">
        <table mat-table [dataSource]="users()" class="users-table">
          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef>Name</th>
            <td mat-cell *matCellDef="let user">{{ user.name }}</td>
          </ng-container>

          <ng-container matColumnDef="email">
            <th mat-header-cell *matHeaderCellDef>Email</th>
            <td mat-cell *matCellDef="let user">{{ user.email }}</td>
          </ng-container>

          <ng-container matColumnDef="role">
            <th mat-header-cell *matHeaderCellDef>Role</th>
            <td mat-cell *matCellDef="let user">
              <span class="role-badge" [class]="'role-' + user.role.toLowerCase()">
                {{ user.role }}
              </span>
            </td>
          </ng-container>

          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>Status</th>
            <td mat-cell *matCellDef="let user">
              <span class="status-badge" [class]="'status-' + user.status">
                {{ user.status }}
              </span>
            </td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let user">
              <button mat-icon-button color="primary" (click)="editUser(user)" title="Update">
                <mat-icon>edit</mat-icon>
              </button>
              <button mat-icon-button color="warn" (click)="deleteUser(user)" title="Delete">
                <mat-icon>delete</mat-icon>
              </button>
              <button mat-icon-button color="accent" (click)="viewUser(user)" title="View">
                <mat-icon>visibility</mat-icon>
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>
      </div>

      <!-- Floating Action Button -->
      <button mat-fab class="add-user-fab" (click)="openAddUserModal()">
        <mat-icon>person_add</mat-icon>
      </button>
    </div>
  `,
  styles: [`
    .users-container {
      padding: 32px;
      position: relative;
      background: #fafafa;
      min-height: 100vh;
    }

    .dashboard-header {
      margin-bottom: 32px;
    }

    .dashboard-header h1 {
      font-size: 32px;
      font-weight: 600;
      color: #3c2415;
      margin: 0 0 8px 0;
    }

    .dashboard-header p {
      font-size: 16px;
      color: #6b3410;
      margin: 0;
    }

    .table-container {
      background: white;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
      overflow: hidden;
    }

    .users-table {
      width: 100%;
    }

    ::ng-deep .mat-mdc-header-cell {
      background-color: #8b4513 !important;
      color: white !important;
      font-weight: 600 !important;
    }

    ::ng-deep .mat-mdc-header-row {
      background-color: #8b4513 !important;
    }

    .mat-mdc-row:hover {
      background-color: #f7f3e9;
    }

    .role-badge, .status-badge {
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
    }

    .role-admin {
      background: rgba(139, 69, 19, 0.1);
      color: #8b4513;
    }

    .role-editor {
      background: rgba(210, 180, 140, 0.2);
      color: #6b3410;
    }

    .role-viewer {
      background: rgba(200, 168, 130, 0.2);
      color: #3c2415;
    }

    .status-active {
      background: rgba(76, 175, 80, 0.1);
      color: #4caf50;
    }

    .status-inactive {
      background: rgba(244, 67, 54, 0.1);
      color: #f44336;
    }

    .add-user-fab {
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: #8b4513 !important;
      color: white !important;
      z-index: 1000;
    }

    .add-user-fab:hover {
      background: #6b3410 !important;
    }

    @media (max-width: 768px) {
      .users-container {
        padding: 16px;
      }
      
      .dashboard-header h1 {
        font-size: 24px;
      }
      
      .add-user-fab {
        bottom: 16px;
        right: 16px;
      }
    }
  `]
})
export class UserComponent {
  users = signal<User[]>([
    {
      id: 1,
      name: 'Admin User',
      email: 'admin@sbs.com',
      role: 'Admin',
      status: 'active',
      lastLogin: new Date('2024-11-25T10:30:00')
    },
    {
      id: 2,
      name: 'John Editor',
      email: 'john@sbs.com',
      role: 'Editor',
      status: 'active',
      lastLogin: new Date('2024-11-24T15:45:00')
    },
    {
      id: 3,
      name: 'Jane Viewer',
      email: 'jane@sbs.com',
      role: 'Viewer',
      status: 'inactive',
      lastLogin: new Date('2024-11-20T09:15:00')
    }
  ]);

  displayedColumns = ['name', 'email', 'role', 'status', 'actions'];

  constructor(private dialog: MatDialog, private fb: FormBuilder) {}

  openAddUserModal() {
    const dialogRef = this.dialog.open(UserModalComponent, {
      width: '500px',
      data: { user: null }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const newUser: User = {
          id: Math.max(...this.users().map(u => u.id)) + 1,
          ...result,
          lastLogin: new Date()
        };
        this.users.set([...this.users(), newUser]);
      }
    });
  }

  editUser(user: User) {
    const dialogRef = this.dialog.open(UserModalComponent, {
      width: '500px',
      data: { user }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const updatedUsers = this.users().map(u => 
          u.id === user.id ? { ...u, ...result } : u
        );
        this.users.set(updatedUsers);
      }
    });
  }

  deleteUser(user: User) {
    const updatedUsers = this.users().filter(u => u.id !== user.id);
    this.users.set(updatedUsers);
  }

  viewUser(user: User) {
    console.log('View user:', user);
  }
}

@Component({
  selector: 'app-user-modal',
  template: `
    <h2 mat-dialog-title>{{ data.user ? 'Edit User' : 'Add User' }}</h2>
    <mat-dialog-content>
      <form [formGroup]="userForm">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Name</mat-label>
          <input matInput formControlName="name" placeholder="Enter full name">
        </mat-form-field>
        
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Email</mat-label>
          <input matInput formControlName="email" type="email" placeholder="Enter email address">
        </mat-form-field>
        
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Role</mat-label>
          <mat-select formControlName="role">
            <mat-option value="Admin">Admin</mat-option>
            <mat-option value="Editor">Editor</mat-option>
            <mat-option value="Viewer">Viewer</mat-option>
          </mat-select>
        </mat-form-field>
        
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Status</mat-label>
          <mat-select formControlName="status">
            <mat-option value="active">Active</mat-option>
            <mat-option value="inactive">Inactive</mat-option>
          </mat-select>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-raised-button color="primary" (click)="onSave()" [disabled]="userForm.invalid">
        {{ data.user ? 'Update' : 'Create' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    :host { color: #3c2415; }
    .full-width { width: 100%; margin-bottom: 16px; }
  `],
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    ReactiveFormsModule
  ]
})
export class UserModalComponent {
  userForm: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<UserModalComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: { user: User | null }
  ) {
    this.userForm = this.fb.group({
      name: [data.user?.name || '', Validators.required],
      email: [data.user?.email || '', [Validators.required, Validators.email]],
      role: [data.user?.role || 'Viewer', Validators.required],
      status: [data.user?.status || 'active', Validators.required]
    });
  }

  onCancel() {
    this.dialogRef.close();
  }

  onSave() {
    if (this.userForm.valid) {
      this.dialogRef.close(this.userForm.value);
    }
  }
}