// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class StartScene extends cc.Component {

    // @property(cc.Label)
    // label: cc.Label = null;

    // @property
    // text: string = 'hello';

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () 
    {
        let StartButton = new cc.Component.EventHandler();
        StartButton.target = this.node;
        StartButton.component ="StartScene";
        StartButton.handler = "loadLevelScene";

        cc.find("Canvas/StartScene/Start_Button").getComponent(cc.Button).clickEvents.push(StartButton);
    }

    loadLevelScene()
    {
        cc.director.loadScene("Level");
    }

    // update (dt) {}
}
