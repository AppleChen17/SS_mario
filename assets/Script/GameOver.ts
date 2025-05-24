import GameManager from "./GameManager";
const {ccclass, property} = cc._decorator;

@ccclass
export default class GameOver extends cc.Component 
{
    @property({type: cc.AudioClip})
    bgm: cc.AudioClip = null;

    start () {
        console.log("in GameOver Scene");
        cc.audioEngine.stopAll();
        cc.audioEngine.playMusic(this.bgm, false);

        // GameManager.instance.reset();
        let BackButton = new cc.Component.EventHandler();
        BackButton.target = this.node;
        BackButton.component ="GameOver";
        BackButton.handler = "loadStartScene";

        cc.find("Canvas/back_btn").getComponent(cc.Button).clickEvents.push(BackButton);
    }

    loadStartScene()
    {
        console.log("want ot jump to start");
        cc.audioEngine.stopMusic();
        cc.director.loadScene("Start");
    }
}
