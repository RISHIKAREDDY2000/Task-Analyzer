import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

interface TextRecord {
  id: number;
  originalText: string;
  summarizedText: string;
  createdBy: string;
  createdAt: string;
  updatedAt?: string;
  updatedBy?: string;
}

interface AnalyzeResponse {
  message: string;
  record: TextRecord;
}

interface RecordsResponse {
  records: TextRecord[];
}

@Injectable({
  providedIn: 'root'
})
export class TextAnalyzerService {
  private apiUrl = 'http://localhost:3000/api/analyze';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getAllRecords(): Observable<RecordsResponse> {
    return this.http.get<RecordsResponse>(this.apiUrl, { 
      headers: this.getHeaders() 
    });
  }

  analyzeText(text: string): Observable<AnalyzeResponse> {
    return this.http.post<AnalyzeResponse>(this.apiUrl, { text }, { 
      headers: this.getHeaders() 
    });
  }

  updateRecord(id: number, text: string): Observable<AnalyzeResponse> {
    return this.http.put<AnalyzeResponse>(`${this.apiUrl}/${id}`, { text }, { 
      headers: this.getHeaders() 
    });
  }

  deleteRecord(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { 
      headers: this.getHeaders() 
    });
  }
}