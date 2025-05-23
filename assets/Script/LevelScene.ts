// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class LevelScene extends cc.Component {
    start ()
    {
        const gmNode = cc.find('Canvas'); // the mode
        const gm = gmNode.getComponent('GameManager'); // the script

        const moneyNode = cc.find("LevelScene/info/money/coin");
        const userNode = cc.find("LevelScene/info/user/name");
        const lifeNode = cc.find("LevelScene/info/life/Label_life");
        const scoreNode = cc.find("LevelScene/info/score/Label_num");

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

        if(moneyNode)
        {
            const label = moneyNode.getComponent(cc.Label);
            if (label) {
                label.string = `${gm.coins}`;
            }
        }

        if(userNode)
        {
            const label = userNode.getComponent(cc.Label);
            if (label) {
                label.string = `${gm.playerName}`;
            }
        }

        if(lifeNode)
        {
            const label = lifeNode.getComponent(cc.Label);
            if (label) {
                label.string = `${gm.life}`;
            }
        }

        if(scoreNode)
        {
            const label = scoreNode.getComponent(cc.Label);
            if (label) {
                label.string = `${gm.score}`;
            }
        }
    }

    loadStartScene()
    {
        cc.director.loadScene("Start");
    }

    loadGameScene()
    {
        cc.director.loadScene("GameStart");
    }
}
