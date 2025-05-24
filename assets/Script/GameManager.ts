// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameManager extends cc.Component {

    @property({ type: cc.AudioSource })
    bgmAudio: cc.AudioSource = null;

    @property({type:cc.AudioClip})
    bgm_1: cc.AudioClip = null; // 
    
    @property({ type: cc.AudioClip })
    bgm_2: cc.AudioClip = null; // 

    @property({ type: cc.AudioClip })
    bgm_3: cc.AudioClip = null; // 

    @property
    public coins: number = 0; // 錢幣數量

    @property
    public life: number = 0; // 生命值

    @property
    public playerName: string = "USER"; // 名字

    @property
    public score: number = 0; // 錢幣數量

    // 你可以寫一些方法，方便操作這些變數
    public addCoins(amount: number) {
        this.coins += amount;
    }

    public loseLife(amount: number) {
        this.life = Math.max(this.life - amount, 0);
    }

    public changeName(newName: string) {
        this.playerName = newName;
    }

    public start() {
        console.log(`歡迎，${this.playerName}！你有 ${this.coins} 個錢幣和 ${this.life} 條生命。`);
    }

    // onLoad() {
    //     cc.game.addPersistRootNode(this.node);
    // }

    // onLoad() {
    //     // 只初始化一次
    //     if (!cc.director.getScene().name.includes("Game")) {
    //         this.life = 5;
    //         this.coins = 0;
    //         this.score = 0;
    //     }
    // }
}
