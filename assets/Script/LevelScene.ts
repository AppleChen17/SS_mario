// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class LevelScene extends cc.Component {

    // @property(cc.Label)
    // label: cc.Label = null;

    // @property
    // text: string = 'hello';

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () 
    {
        let Level0Button = new cc.Component.EventHandler();
        Level0Button.target = this.node;
        Level0Button.component ="LevelScene";
        Level0Button.handler = "loadGameScene";

        let BackButton = new cc.Component.EventHandler();
        BackButton.target = this.node;
        BackButton.component ="LevelScene";
        BackButton.handler = "loadStartScene";

        cc.find("LevelScene/Level0").getComponent(cc.Button).clickEvents.push(Level0Button);
        cc.find("LevelScene/Back").getComponent(cc.Button).clickEvents.push(BackButton);
    }

    // update (dt) {}

    loadStartScene()
    {
        cc.director.loadScene("Start");
    }

    loadGameScene()
    {
        // cc.director.loadScene("Level");
    }
}
