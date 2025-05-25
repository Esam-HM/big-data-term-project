import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment.development';
import { HadoopStatus } from '../models/hadoop-status-request';

@Injectable({
  providedIn: 'root'
})
export class HdfsServicesService {

  constructor(private http: HttpClient) { }

  getHadoopStatus(): Observable<HadoopStatus>{
    return this.http.get<HadoopStatus>(`${environment.apiBaseUrl}/api/jps`);
  }

  toggleHDFS( toggle : boolean): Observable<any>{
    return this.http.post<any>(`${environment.apiBaseUrl}/api/hdfs/toggleHDFS`,{"status" : toggle});
  }

  toggleYarn( toggle : boolean): Observable<any>{
    return this.http.post<any>(`${environment.apiBaseUrl}/api/hdfs/toggleYarn`,{"status" : toggle});
  }

  getAllDirs(): Observable<any>{
    return this.http.get<any>(`${environment.apiBaseUrl}/api/hdfs/getDirs`);
  }

  getAllFiles(): Observable<any>{
    return this.http.get<any>(`${environment.apiBaseUrl}/api/hdfs/getallfiles`);
  }

  getAllPaths(): Observable<any>{
    return this.http.get<any>(`${environment.apiBaseUrl}/api/hdfs/getallpaths`);
  }

  deletePath(path: string): Observable<any>{
    return this.http.post<any>(`${environment.apiBaseUrl}/api/hdfs/deletepath`,{"path":path});
  }

  addFileToHDFS(file: File, hdfsPath: string): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('targetPath', hdfsPath);

    return this.http.post<any>(`${environment.apiBaseUrl}/api/hdfs/uploadfile`, formData);
  }

  createNewDir(path: string): Observable<any>{
    return this.http.post(`${environment.apiBaseUrl}/api/hdfs/createdir`,{"path":path});
  }
  
}
