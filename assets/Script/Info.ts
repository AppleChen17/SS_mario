import GameManager from "./GameManager"; // ← 請根據實際路徑調整
const {ccclass, property} = cc._decorator;

@ccclass
export default class LevelScene extends cc.Component {

    private gm: any = null;
    private moneyLabel: cc.Label = null;
    private lifeLabel: cc.Label = null;
    private scoreLabel: cc.Label = null;

    private timerLabel: cc.Label = null;    // 新增倒數時間 Label
    private timeLeft: number = 5;
    private timeCounter: number = 0;
    private isGameOver: boolean = false;

    start () {
        const gmNode = cc.find('Canvas'); 
        this.gm = gmNode.getComponent('GameManager'); 

        const moneyNode = cc.find("Canvas/Info/money/money");
        const lifeNode = cc.find("Canvas/Info/life/Label_life");
        const scoreNode = cc.find("Canvas/Info/score/score");
        const timerNode = cc.find("Canvas/Info/timer/left_time");

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
    }

    update(dt: number) {
        if (!this.gm || this.isGameOver) return;

        if (this.moneyLabel) {
            this.moneyLabel.string = `${this.gm.coins}`;
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
        if (this.timeLeft === 0) {

            this.isGameOver = true;
            this.gm.loseLife(1);
            console.log(`Time's UP ! now life = ${this.gm.life}`);
            if(this.gm.life > 0)
            {
                console.log("want to jump to GameStart");
                this.scheduleOnce(() => {
                    cc.director.loadScene("GameStart");
                }, 1); 
            }
            else
            {
                this.scheduleOnce(() => {
                    cc.director.loadScene("GameOver");
                }, 1); 
            }

           
        }
    }

    updateTimerLabel() {
        if (this.timerLabel) {
            this.timerLabel.string = `${this.timeLeft}`; // 直接顯示剩餘秒數
        }
    }
}
