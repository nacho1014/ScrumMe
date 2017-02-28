import { TaskService } from '../../../services/database/task.service';
import { ColumnService } from './../../../services/database/column.service';
import { DestroySubscribers } from '../../../util/unsuscribe.decorator';
import { PostIt } from './../../../model/post.it';
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { MenuModule, MenuItem } from 'primeng/primeng';

@Component({
    moduleId: 'column.component',
    selector: 'app-column',
    templateUrl: 'column.component.html',
    styleUrls: ['./column.component.scss'],
    providers: [ColumnService, TaskService]


})
@DestroySubscribers()
export class ColumnComponent implements OnInit {

    private notes: PostIt[];
    @Input() private colKey: string;
    @Input() private colName: string;
    @Input() private boardKey: string;
    public subscribers: any = {};
    public options: any[];
    private showModal: boolean;
    private showModalCol: boolean;
    notesToDispose = [];
    private size: number;


    constructor(private columnService: ColumnService, public taskService: TaskService) {

        this.notesToDispose.push({});
        this.options = [
            {
                label: 'Editar', icon: 'fa fa-pencil-square-o', command: () => {
                    this.showDialogCol();
                }
            },
            {
                label: 'Borrar', icon: 'fa-close', command: () => {
                    this.delete();
                }
            },
            {
                label: 'Añadir tarea', icon: 'fa fa-plus', command: () => {
                    this.showDialog();
                }
            }
        ];
    }

    /**
   * Metodo que nos gestiona el borrado de notas
   */
    public onNotify(collection: string, key: string) {
        this.taskService.deleteTask(this.boardKey, this.colKey, key);
    }

    private showDialog() {
        this.showModal = true;
    }

    private closeDialog() {
        this.showModal = false;
    }

    private showDialogCol() {
        this.showModalCol = true;
    }

    private closeDialogCol() {
        this.showModalCol = false;
    }


    public edit() {


    }

    public delete() {

        this.columnService.deleteColumn(this.boardKey, this.colKey);


    }

    ngOnInit() {

        this.subscribers.subscription = this.taskService.getTasks(this.colKey, this.boardKey).subscribe((items) => {
            this.notes = items;
            console.log(this.colName)
            console.log(` notes: ${this.notes.length}`);
            console.log(` notesToDispose: ${this.notesToDispose.length}`);


            if (this.notes) {
                this.size = this.notes.length;
            } else {
                this.size = 0;
            }
        });

    }


}
