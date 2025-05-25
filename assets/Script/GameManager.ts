export default class GameManager {
    private static _instance: GameManager;

    public coin: number = 0;
    public life: number = 5;
    public score: number = 0;
    public playerName: string = "PLAYER";
    public isDie: boolean = false;

    private constructor() {}

    public static get instance(): GameManager {
        if (!this._instance) {
            this._instance = new GameManager();
        }
        return this._instance;
    }

    public reset() {
        console.log("reset info !");
        this.coin = 0;
        this.life = 2;
        this.score = 0;
        this.playerName = "PLAYER";
        this.isDie = false;
    }
}