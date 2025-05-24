const {ccclass, property} = cc._decorator;

@ccclass
export default class PlayerControl extends cc.Component 
{
    @property(cc.SpriteAtlas)
    smallMarioAtlas: cc.SpriteAtlas = null;

    @property(cc.SpriteAtlas)
    bigMarioAtlas: cc.SpriteAtlas = null;
    
    @property(cc.Sprite)
    marioSprite: cc.Sprite = null;

    @property()
    playerSpeed: number = 200;

    @property()
    playerStandSpeed: number = 50;

    @property({type:cc.AudioClip})
    jumpSound: cc.AudioClip = null;

    @property({type:cc.AudioClip})
    dieSound: cc.AudioClip = null;

//     // @property(cc.Node)
//     // gameMgr: cc.Node = null;
    
//     private idleFrame: cc.SpriteFrame = null;

    private anim: cc.Animation = null;
    private physicManager: cc.PhysicsManager = null
    private moveDir = 0;

//     private ceilingPos: number = 155;

//     private fallDown: boolean = false;

//     private damageTime: number = 0;

    start () {
        // this.idleFrame = this.getComponent(cc.Sprite).spriteFrame;
        // this.anim = this.getComponent(cc.Animation);
        this.reborn(cc.v2(-350, -150));
    }

    onLoad() {
        this.physicManager = cc.director.getPhysicsManager();
        this.physicManager.enabled = true;
        this.physicManager.gravity = cc.v2(0, -200);  // 推薦設一個合理值
        // this.physicManager.debugDrawFlags = cc.PhysicsManager.DrawBits.e_shapeBit;
    }

    update(dt)
    {
        this.node.x += this.playerSpeed * this.moveDir * dt;
        this.node.scaleX = (this.moveDir >= 0) ? 1 : -1;
        console.log(this.node.x,this.node.y);
//         this.node.y = (this.node.y >= this.ceilingPos) ? this.ceilingPos : this.node.y;
//         if(this.getComponent(cc.RigidBody).linearVelocity.y != this.playerStandSpeed)
//             this.fallDown = true;
//         else
//             this.fallDown = false;

//         if(this.damageTime > 0)
//             this.damageTime -= dt;
//         else
//             this.damageTime = 0;

        this.playerAnimation();
    }

    eatMushroom() {
        const bigFrame = this.bigMarioAtlas.getSpriteFrame("big_mario_idle"); // 根據你的圖名
        this.marioSprite.spriteFrame = bigFrame;
    }

    reborn(rebornPos: cc.Vec2)
    {
        this.node.setPosition(rebornPos);
        this.getComponent(cc.RigidBody).linearVelocity = cc.v2();
    }

    playerMove(moveDir: number)
    {
        console.log("in playerMove ", moveDir);
        this.moveDir = moveDir;
    }

    playerJump() 
    {
        const rigidBody = this.getComponent(cc.RigidBody);

        rigidBody.linearVelocity = cc.v2(rigidBody.linearVelocity.x, 400);
        cc.audioEngine.playEffect(this.jumpSound, false);
    }

    playerDie()
    {
        cc.audioEngine.playEffect(this.dieSound,false);
        // this.gameMgr.getComponent("GameMgr").updateLife(-12);
    }

    playerAnimation()
    {
        // console.log("play animation");
        // if(!this.anim.getAnimationState("walk").isPlaying)
            // this.anim.play("walk");
    }

    onBeginContact(contact, selfCollider, otherCollider)
    {
        cc.log("Collision with:", otherCollider.node.name);
    }
}
