import { passBoolean } from 'protractor/built/util';
import { Injectable } from '@angular/core';
import { AngularFire, AuthProviders, AuthMethods } from 'angularfire2';
import { IAuthentication } from './IAuthentication';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';
import { CanActivate, Router, } from '@angular/router';


/**
 * 
 * Clase pendiente de refactorización 
 * Promesas en angular2 => WRONG!  
 * Cambiar para usar observables
 */
@Injectable()
export class FirebaseAuthentication implements IAuthentication, CanActivate {


    constructor(public af: AngularFire, public router: Router) { }



    public getUser() {
        this.af.auth.subscribe((auth) => {
            return auth;
        });
    }


    public signUp(email: string, password: string): Observable<any> {
        let creds: any = { email: email, password: password };
        console.log(creds);
        return new Observable((observer) => {
            this.af.auth.createUser(creds).catch((err) => {
                let error = { provider: 3, error: err.message };
                observer.error(error)
            }).then(result => {
                observer.next(result);
                observer.complete();
            });
        })
    }

    public login(email: string, password: string): Observable<any> {
        let creds: any = { email: email, password: password };


        return new Observable((observer) => {
            this.af.auth.login(creds).catch((err) => {
                let error = { provider: 3, error: err.message };
                observer.error(error)
            }).then(result => {
                observer.next(result);
                observer.complete();
            });


        })


    }

    public loginWithGit() {
        this.af.auth.login({
            provider: AuthProviders.Github,
            method: AuthMethods.Popup,
        });
    }

    public changePassword(password: string, oldPassword: string, email: string) {



        let creds: any = { email: email, password: oldPassword };
        this.af.auth.login(creds).then((res) => {
            this.af.auth.getAuth().auth.updatePassword(password);
        })

    }


    public logout() {
        this.af.auth.logout();
    }

    public canActivate(): Observable<boolean> {
        return this.af.auth.take(1).map(auth => {
            if (!auth) {
                this.router.navigateByUrl('/login');
                return true;
            }
            return !!auth;
        });

    }

}
