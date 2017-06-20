import { Utils } from './utils';
import { browser, element, by } from 'protractor';

export class DashboardPage {

  navigateTo() {
    return browser.get('/dashboard');
  }

  createCard() {

    Utils.clickButton("createboard");
    browser.driver.sleep(500);
    Utils.fillInput("name", "sprint1");
    Utils.fillInput("date", "12/12/2017");
    Utils.fillInput("columns", "To do,Done");
    Utils.clickButton("enviar");
  }

  getElement(name : string) {

    return element(by.name(name)).isPresent();

  }


  getElementById(name : string) {


    return element(by.id(name)).isPresent();

  }

  deleteCard() {

    Utils.clickButton("botonborrar");
  }

  goToBoard() {

    Utils.clickButton("gotoboardsprint1");

  }

  sendNotification(toWho : string){

      Utils.clickButton("collabssprint1");
      browser.driver.sleep(1000);
      Utils.fillInput("mails", toWho);
      Utils.clickButton("addColabsprint1");
    
  }

  removeMessages(){

    element(by.xpath("/html/body/app-root/div/dashboard/div/div[2]/p-messages/div/a")).click();

  }



}
