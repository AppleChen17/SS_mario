// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameStart extends cc.Component 
{
    start ()
    {
        if (cc.director.getScene().name !== "GameStart") return;
        console.log("in GameStart scene");
        this.scheduleOnce(() => {
            cc.director.loadScene("Level0");
        }, 3); 
    }

    // update (dt) {}
}
