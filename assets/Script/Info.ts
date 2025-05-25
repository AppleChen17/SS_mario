import GameManager from "./GameManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class LevelScene extends cc.Component 
{
    @property({type: cc.AudioClip})
    bgm: cc.AudioClip = null;

    @property({type: cc.AudioClip})
    win: cc.AudioClip = null;
    
    @property({type: cc.Node})
    cameraNode: cc.Node = null;

    @property(cc.Node)
    LevelClearNode: cc.Node = null;

    private moneyLabel: cc.Label = null;
    private lifeLabel: cc.Label = null;
    private scoreLabel: cc.Label = null;

    private timerLabel: cc.Label = null;    // 新增倒數時間 Label
    private timeLeft: number = 100;
    private timeCounter: number = 0;
    private isGameOver: boolean = false;
    private gm : any = GameManager.instance;

    start () {
        // const gmNode = cc.find('Canvas'); 
        // this.gm = gmNode.getComponent('GameManager'); 

        const moneyNode = cc.find("Canvas/Info/money/money");
        const lifeNode = cc.find("Canvas/Info/life/Label_life");
        const scoreNode = cc.find("Canvas/Info/score/score");
        const timerNode = cc.find("Canvas/Info/timer/left_time");
        // const gm = GameManager.instance;
        cc.audioEngine.playMusic(this.bgm, true);
        if(moneyNode) {
            this.moneyLabel = moneyNode.getComponent(cc.Label);
        }

        if(lifeNode) {
            this.lifeLabel = lifeNode.getComponent(cc.Label);
        }

        if(scoreNode) {
            this.scoreLabel = scoreNode.getComponent(cc.Label);
        }

        if (timerNode) {
            this.timerLabel = timerNode.getComponent(cc.Label);
            this.updateTimerLabel();
        }

        // hide
        if (this.LevelClearNode)
        {
            this.LevelClearNode.active = false;
        }
    }

    update(dt: number) 
    {
        let cameraPos = this.cameraNode.getPosition();
        this.node.setPosition(cameraPos);
        if (cc.director.getScene().name !== "Level0") return;
        if (this.isGameOver) return;

        if (this.moneyLabel) {
            this.moneyLabel.string = `${this.gm.coin}`;
        }

        if (this.lifeLabel) {
            this.lifeLabel.string = `${this.gm.life}`;
        }

        if (this.scoreLabel) {
            this.scoreLabel.string = `${this.gm.score}`;
        }

        this.timeCounter += dt;
        if (this.timeCounter >= 1 && this.timeLeft > 0) {
            this.timeLeft--;
            this.timeCounter = 0;
            this.updateTimerLabel();
        }

        // TODO: here deal with end game
        if (this.timeLeft === 0 || this.gm.isDie) 
        {
            cc.audioEngine.stopMusic();
            this.isGameOver = true;
            this.gm.life -= 1;
            console.log(`Time's UP ! now life = ${this.gm.life}`);
            if(this.gm.life > 0)
            {
                console.log("want to jump to GameStart");
                this.scheduleOnce(() => {
                    
                }, 1); 
                cc.director.loadScene("GameStart");
            }
            else
            {
                this.scheduleOnce(() => {
                    
                }, 1); 
                cc.director.loadScene("GameOver");
            }
        }
    }

    updateTimerLabel() {
        if (this.timerLabel) {
            this.timerLabel.string = `${this.timeLeft}`; // 直接顯示剩餘秒數
        }
    }

    public LevelClear()
    {
        cc.audioEngine.stopAll();
        cc.audioEngine.playMusic(this.win, false);

        this.LevelClearNode.active = true;

        const time = this.timeLeft;
        this.gm.score += time * 50;

        const scoreNode = cc.find("Canvas/LevelClear/Result");
        const timerNode = cc.find("Canvas/LevelClear/timer/left_time");

        if (scoreNode) {
            const clearScoreLabel = scoreNode.getComponent(cc.Label);
            clearScoreLabel.string = (time * 50).toString();
        }

        if (timerNode) {
            const clearTimeLabel = timerNode.getComponent(cc.Label);
            clearTimeLabel.string = time.toString();
        }

        this.scheduleOnce(() => {
            cc.director.loadScene("Start");
        }, 10);
    }
}
