import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TextAnalyzerService } from '../../services/text-analyzer.service';

interface TextRecord {
  id: number;
  originalText: string;
  summarizedText: string;
  createdBy: string;
  createdAt: string;
  updatedAt?: string;
  updatedBy?: string;
}

@Component({
  selector: 'app-text-analyzer',
  templateUrl: './text-analyzer.component.html',
  styleUrls: ['./text-analyzer.component.css']
})
export class TextAnalyzerComponent implements OnInit {
  textInput: string = '';
  records: TextRecord[] = [];
  currentUser: any;
  isEditor: boolean = false;
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  editingId: number | null = null;
  editingText: string = '';

  constructor(
    private authService: AuthService,
    private textAnalyzerService: TextAnalyzerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.isEditor = this.authService.isEditor();
    this.loadRecords();
  }

  loadRecords(): void {
    this.textAnalyzerService.getAllRecords().subscribe({
      next: (response) => {
        this.records = response.records;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load records';
        console.error('Error loading records:', error);
      }
    });
  }

  onAnalyze(): void {
    if (!this.textInput.trim()) {
      this.errorMessage = 'Please enter some text to analyze';
      return;
    }

    if (!this.isEditor) {
      this.errorMessage = 'Only editors can create new analyses';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.textAnalyzerService.analyzeText(this.textInput).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.successMessage = 'Text analyzed successfully!';
        this.textInput = '';
        this.loadRecords();
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Failed to analyze text';
        console.error('Analysis error:', error);
      }
    });
  }

  startEdit(record: TextRecord): void {
    this.editingId = record.id;
    this.editingText = record.originalText;
  }

  cancelEdit(): void {
    this.editingId = null;
    this.editingText = '';
  }

  saveEdit(id: number): void {
    if (!this.editingText.trim()) {
      this.errorMessage = 'Text cannot be empty';
      return;
    }

    this.textAnalyzerService.updateRecord(id, this.editingText).subscribe({
      next: (response) => {
        this.successMessage = 'Record updated successfully!';
        this.editingId = null;
        this.editingText = '';
        this.loadRecords();
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Failed to update record';
        console.error('Update error:', error);
      }
    });
  }

  deleteRecord(id: number): void {
    if (!confirm('Are you sure you want to delete this record?')) {
      return;
    }

    this.textAnalyzerService.deleteRecord(id).subscribe({
      next: (response) => {
        this.successMessage = 'Record deleted successfully!';
        this.loadRecords();
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Failed to delete record';
        console.error('Delete error:', error);
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}