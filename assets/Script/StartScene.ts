// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
import GameManager from "./GameManager";
const {ccclass, property} = cc._decorator;

@ccclass
export default class StartScene extends cc.Component 
{

    @property({type: cc.AudioClip})
    theme_music: cc.AudioClip = null;

    private gm : any = GameManager.instance;
    start ()
    {
        let StartButton = new cc.Component.EventHandler();
        StartButton.target = this.node;
        StartButton.component ="StartScene";
        StartButton.handler = "loadLevelScene";
        this.gm.reset();
        cc.audioEngine.playMusic(this.theme_music, true);

        cc.find("Canvas/StartScene/Start_Button").getComponent(cc.Button).clickEvents.push(StartButton);
        
        // const gmNode = cc.find('Canvas'); 
        // this.gm = gmNode.getComponent('GameManager');
        // const lifeNode = cc.find("Canvas/Info/life/Label_life");
        // if(lifeNode)
        // {
        //     this.gm.life = 5;
        // }
    }

    loadLevelScene()
    {
        cc.audioEngine.stopMusic();
        cc.director.loadScene("LevelSelect");
    }
}
