import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Register } from "./models/Register";

import { environment } from "../environments/environment.development";
import { Login } from "./models/Login";
import { User } from "./models/User";
import { Observable, ReplaySubject, map, of } from "rxjs";
import { Router } from "@angular/router";
import { NotificationComponent } from "./components/notification/notification.component";
import { Doctor } from "./models/Doctor";
import { Category } from "./models/Category";


@Injectable({
  providedIn: 'root',
})

export class AppService {
  
    private userSource = new ReplaySubject<User | null>(1);
    user$ = this.userSource.asObservable();

    constructor(private http: HttpClient, private router: Router, ) { }

    refreshUser(jwt: string | null  ){
        if(jwt === null){
            this.userSource.next(null);
            return of(undefined)
        }

      let headers = new HttpHeaders();
      headers = headers.set('Authorization', 'Bearer ' + jwt);
      return this.http.get<User>(`${environment.apiUrl}/api/account/refresh-user-token`, {headers}).pipe(
        map((user: User) => {
            if(user){
                this.setUser(user);
            }
        })
      )
    }

    async login(model: any): Promise<any> {
      try {
        const user = await this.http.post<any>(`${environment.apiUrl}/api/account/login`, model).toPromise();
        if (user) {
          this.setUser(user);
          if (user.type === 'User') {
            this.router.navigateByUrl('/user');
          }
          if (user.type === 'Doctor') {
            this.router.navigateByUrl('/doctor');
          }
          if (user.type === 'Admin') {
            this.router.navigateByUrl('/admin');
          }
          return user; // Return user information after successful login
        }
      } catch (error) {
        console.error('Error logging in:', error);
        throw error;
      }
    }

    logout(){
        localStorage.removeItem(environment.userKey);
        this.userSource.next(null);
        this.router.navigateByUrl('/');
    }

  register(model: Register){
    return this.http.post(`${environment.apiUrl}/api/account/register`, model)
  }

  getJWT(){
    const key = localStorage.getItem(environment.userKey);
    if(key ){
        const user: User = JSON.parse(key);
        return user.jwt;
    }else{
        return null;
    }
  }

  private setUser(user: any){
    localStorage.setItem(environment.userKey, JSON.stringify(user));
    this.userSource.next(user);

    this.user$.subscribe({
        next: response => console.log(response)
    });
  }
  
  getVisits(){
    return this.http.get(`${environment.apiUrl}/api/visit/get-visits`);
   
  }
  showNotification(isSuccess: boolean, title: string, message: string) {
    const initalState: any = {
      initialState: {
        isSuccess,
        title,
        message
      }
    };

   
  }

 getDoctors(): Observable<Doctor[]> {
    return this.http.get<Doctor[]>(`${environment.apiUrl}/api/doctor`);
  }

  deleteDoctorById(id: number): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/api/doctor/${id}`);
  }
  addCategory(categoryName: string): Observable<any> {
    return this.http.post<Category>(`${environment.apiUrl}/api/categories`, { name: categoryName });
  }
  updateCategory(categoryId: number, updatedCategory: Category): Observable<any> {
    const url = `${environment.apiUrl}/api/categories/${categoryId}`;
    return this.http.put(url, updatedCategory);
  }
  deleteCategory(categoryId: number): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}/api/categories/${categoryId}`);
  }
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${environment.apiUrl}/api/categories`);
  }

  registerAdmin(admin: any) {
    return this.http.post<any>(`${environment.apiUrl}/Admin/register`, admin);
  }
  getAllAdmins() {
    return this.http.get<any>(`${environment.apiUrl}/Admin/getAllAdmins`);
  }
  createAppointment(appointment: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/api/Account/create-appointment`, appointment);
  }
  getDoctorById(id: string): Observable<Doctor> {
    return this.http.get<Doctor>(`${environment.apiUrl}/api/Doctor/${id}`);
  }
  deleteAdmin(id: number): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/admin/delete/${id}`);
  }
  editAdminEmail(adminId: number, newEmail: string): Observable<any> {
    return this.http.put(`${environment.apiUrl}/admin/editEmail/${adminId}`,  newEmail );
  }

  editAdminPassword(adminId: number, newPassword: string): Observable<any> {
    return this.http.put(`${environment.apiUrl}/admin/editPassword/${adminId}`,  newPassword );
  }

  deleteAppointmentById(appointmentId: number): Observable<void> {
    const apiUrl = `http://localhost:5005/api/Appointment/delete/${appointmentId}`;
    return this.http.delete<void>(apiUrl);
  }
}
