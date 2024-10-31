import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Banner, BannerBody } from '../models/banner';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class BannerService {

  constructor( private http: HttpClient) { }

  list(): Observable<Banner[]> {
    return this.http.get<Banner[]>(
      `${environment.backendBaseUrl}/api/store/banner`);
  }

  update(banner: Banner): Observable<Banner> {
    const url = `${environment.backendBaseUrl}/api/store/banner/${banner.idBanner}`;
    return this.http.put<Banner>(url, banner);
  }

  remove(idBanner: number): Observable<any> {
    return this.http.delete<any>(
      `${environment.backendBaseUrl}/api/store/banner/${idBanner}`);
  }

  create(body: BannerBody): Observable<Banner> {
    const url = `${environment.backendBaseUrl}/api/store/banner`;
    return this.http.post<Banner>(url, body);
  }

  getById(idBanner: number): Observable<Banner> {
    return this.http.get<Banner>(`${environment.backendBaseUrl}/api/store/banner/${idBanner}`);
  }

}
