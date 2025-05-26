import PlayerControl from "./PlayerControl";
import GameManager from "./GameManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class LevelManager extends cc.Component 
{
    @property(cc.Node)
    background: cc.Node = null;

    @property(cc.Node)
    wall: cc.Node = null;

    @property(cc.Node)
    upperBound: cc.Node = null;

    @property(cc.Node)
    lowerBound: cc.Node = null;

    @property(PlayerControl)
    player: PlayerControl = null;


    // @property(cc.Node)
    // startIcon: cc.Node = null;

    // @property(cc.Node)
    // pauseIcon: cc.Node = null;

    // @property(cc.Node)
    // private lifeBar: cc.Node = null;
    private gm : any = GameManager.instance;
    private backgroundInitPos = -72;

    private backgroundResetPos = 56;

    // private wallInitPos = -23;

    // private wallResetPos = 9;

    private physicManager: cc.PhysicsManager = null;

    private leftDown: boolean = false;

    private rightDown: boolean = false;

    private score: number = 0;

    private highestScore: number = 0;

    private scoreCount;

    private pause: boolean = false;

    private playerLife: number = 12;

    onLoad()
    {
        // this.physicManager = cc.director.getPhysicsManager();
        // this.physicManager.enabled = true;
        // this.physicManager.gravity = cc.v2 (0, -200);
        // this.physicManager.debugDrawFlags = cc.PhysicsManager.DrawBits.e_shapeBit;

        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }

    start () {
        console.log("player is", this.player);
        // this.schedule(() => {
        //     let idx = this.randomChoosePlatform();
        //     let platform = cc.instantiate(this.platformPrefabs[idx]);
        //     platform.parent = this.platforms;
        //     platform.position = cc.v2(-144+Math.random()*288, -190);
        // }, 1.2);

        // this.updateHighestScore(0);
        // this.scoreCount = ()=>{ this.updateScore(this.score+1); };
    }

    update(dt)
    {
        // console.log("map",this.node.x,this.node.y);

        // if(this.wall.y >= this.wallResetPos)
        //     this.wall.y = this.wallInitPos;
        
        // automic scroll
        // this.background.y += 0.2;
        // if(this.background.y >= this.backgroundResetPos)
        //     this.background.y = this.backgroundInitPos;
    }

    onKeyDown(event)
    {
        if(this.gm.isDie || this.gm.isClear) return;
        console.log("key down",event.keyCode);
        switch(event.keyCode)
        {
            case cc.macro.KEY.left:
                this.leftDown = true;
                this.player.playerMove(-1);
                break;
            case cc.macro.KEY.right:
                this.rightDown = true;
                this.player.playerMove(1);
                break;

            case cc.macro.KEY.up:
                // this.rightDown = true;
                this.player.playerJump();
                break;
        }
    }

    onKeyUp(event)
    {
        if(this.gm.isDie || this.gm.isClear) return;
        console.log("key up",event.keyCode);
        switch(event.keyCode)
        {
            case cc.macro.KEY.left:
                this.leftDown = false;
                if(this.rightDown)
                    this.player.playerMove(1);
                else
                    this.player.playerMove(0);
                break;
            case cc.macro.KEY.right:
                this.rightDown = false;
                if(this.leftDown)
                    this.player.playerMove(-1);
                else
                    this.player.playerMove(0);
                break;
        }
    }
}
