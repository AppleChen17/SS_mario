// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;
import GameManager from "./GameManager";

@ccclass
export default class GameStart extends cc.Component 
{
    private gm : any = GameManager.instance;
    
    start ()
    {
        this.gm.isDie = false;
        this.gm.score = 0;
        this.gm.coin = 0;
        if (cc.director.getScene().name !== "GameStart") return;
        console.log("in GameStart scene");
        this.scheduleOnce(() => {
            cc.director.loadScene("Level0");
        }, 3);
    }

    // update (dt) {}
}
