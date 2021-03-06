import { Color } from './../../../model/color';
import { TravisService } from './../../../services/travis/travis.service';
import { Router } from '@angular/router';
import { BoardService } from './../../../services/database/board.service';
import { Board } from './../../../model/board';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { DestroySubscribers } from "../../../util/unsuscribe.decorator";

@Component({
  selector: 'board-card',
  templateUrl: './card.board.component.html',
  styleUrls: ['./card.board.component.scss'],
  providers: []

})
@DestroySubscribers()
export class CardBoardComponent implements OnInit {

  @Input() board: Board;

  @Input() boardKey: string;

  public travisPass: boolean;

  public color : Color;

  public showModal: boolean;

  public showModalColabs: boolean;

  public gitRepoUrl: string;

  public travisRepoUrl: string;

  public mailsToColab: string;

  public subscribers: any = {};

  @Output() sendMessage = new EventEmitter<any>();

  constructor(public boardService: BoardService, public router: Router,
    public travisService: TravisService) { }


  /**
   * Metodo que nos redirige al tablero que seleccionamos
   */
  public goToBoard() {

    this.router.navigate(['/board', this.boardKey]);

  }

  public getDate(){

    let  nDate : Date = new Date(this.board.date);
    return nDate.toLocaleDateString();
    
  }



  public goToBurndown() {

    this.router.navigate(['/burndown', this.boardKey]);
  }
  public goToMyCharts() {

    this.router.navigate(['/taskchart', this.boardKey]);
  }

  /**
   * Metodo que nos borra un tablero del cual se es dueño
   */
  public deleteBoard() {

    this.boardService.deleteBoard(this.boardKey, this.board.owner);

  }


  public showDialog() {
    this.showModal = true;
  }

  public closeDialog() {
    this.showModal = false;
  }

  public showDialogColabs() {
    this.showModalColabs = true;
  }

  public closeDialogColabs() {
    this.showModalColabs = false;
  }

  public addColabs() {
    let splitted: string[];

    if (this.mailsToColab.length > 0) {
      splitted = this.mailsToColab.split(",");
      splitted.forEach((mail: string) => {
        this.boardService.inviteToColab(mail, this.board, this.boardKey).subscribe(
          (response) => this.sendMessage.emit({ severity: 'info', summary: 'Completado!', detail: response }),
          (error) => {
            this.sendMessage.emit({ severity: 'info', summary: 'Error!', detail: error })
            return;
          });

      });
    }
    this.mailsToColab = '';
    this.closeDialogColabs();
  }


  public configureTravis() {

    if (this.board.travisRepo !== '') {
      this.subscribers.subscription = this.travisService.getState(this.board.travisRepo).subscribe((res) => {
        this.travisPass = res.json()[0].result === 0;
        if (!this.travisPass) {
            this.color = new Color("#E04A1B","#E04A1B");
        }
        else{
            this.color = new Color("#7FB800","#7FB800");
        }
      });
    }
  }

  ngOnInit() {

    this.gitRepoUrl = `https://github.com/${this.board.gitHubRepo}`;
    this.travisRepoUrl = `https://travis-ci.org/${this.board.travisRepo}`;
    this.color = new Color("#217CA3","#217CA3");
    this.configureTravis();

  }


}
