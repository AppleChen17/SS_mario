// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class StartScene extends cc.Component 
{
    private gm: any = null;
    start ()
    {
        let StartButton = new cc.Component.EventHandler();
        StartButton.target = this.node;
        StartButton.component ="StartScene";
        StartButton.handler = "loadLevelScene";

        cc.find("Canvas/StartScene/Start_Button").getComponent(cc.Button).clickEvents.push(StartButton);
        
        const gmNode = cc.find('Canvas'); 
        this.gm = gmNode.getComponent('GameManager');
        const lifeNode = cc.find("Canvas/Info/life/Label_life");
        if(lifeNode)
        {
            this.gm.life = 5;
        }
    }

    loadLevelScene()
    {
        cc.director.loadScene("LevelSelect");
    }
}
