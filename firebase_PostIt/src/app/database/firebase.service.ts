import { Injectable } from '@angular/core';
import { Database } from './IDatabase';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import { PostIt } from '../post.it';


@Injectable()
export class FirebaseService implements Database {



    constructor(private af: AngularFire) {


    }

    getCollection(name: string): FirebaseListObservable<any> {

        return this.af.database.list(name);

    }

    save(item: PostIt, collection: string) {

        console.log(collection);
        this.af.database.list(collection).push(item);

    }


    delete(key: string, collection: string) {

        this.af.database.list(collection).remove(key);

    }

    findById(key: string, collection: string) {

        
        var element: any[];
        var item:string = `${collection}/${key}`;
        console.log(item); 
        this.af.database.list(collection +"/"+ key).subscribe((item) => {
            console.log(item);
            element = item;
        });

        console.log(element);
        var postit = new PostIt(element[0].$value, element[3].$value, element[1].$value, key);
        return postit;

    }



}
