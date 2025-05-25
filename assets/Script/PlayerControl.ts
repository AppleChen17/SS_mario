import GameManager from "./GameManager";
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

    @property(cc.Sprite)
    dieSpriteFrame: cc.Sprite = null;

    @property()
    playerSpeed: number = 200;

    @property()
    playerStandSpeed: number = 0;

    @property({type:cc.AudioClip})
    jumpSound: cc.AudioClip = null;

    @property({type:cc.AudioClip})
    dieSound: cc.AudioClip = null;
    
//     private idleFrame: cc.SpriteFrame = null;

    private anim: cc.Animation = null;
    private physicManager: cc.PhysicsManager = null;
    private moveDir = 0;
    private isJump = false;
    private fallDown = false;
    public isDie = false;
    private gm : any = GameManager.instance;

    start () {
        // this.idleFrame = this.getComponent(cc.Sprite).spriteFrame;
        this.anim = this.getComponent(cc.Animation);
        this.reborn(cc.v2(-350, -150));
    }

    onLoad() {
        this.physicManager = cc.director.getPhysicsManager();
        this.physicManager.enabled = true;
        this.physicManager.gravity = cc.v2(0, -200);
        // this.physicManager.debugDrawFlags = cc.PhysicsManager.DrawBits.e_shapeBit;
    }

    update(dt)
    {
        this.node.x += this.playerSpeed * this.moveDir * dt;
        // limit area
        if(this.node.x < -450) this.node.x = -450;
        if(this.node.x > 1700) this.node.x = 1700; 
        this.node.scaleX = (this.moveDir >= 0) ? 1 : -1;
        // console.log(this.node.x,this.node.y);

        // 200
        // if(this.getComponent(cc.RigidBody).linearVelocity.y != this.playerStandSpeed) this.fallDown = true;
        // else this.fallDown = false;
        if(this.node.y < -315) this.fallDown = true;
        else this.fallDown = false;
        // console.log("fall down", this.fallDown);

        if(this.fallDown) 
        {
            this.playerDie();
            console.log("turn global player isDie = true");
            // this.gm.isDie = true;
        }
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
        if(this.isJump) return;
        const rigidBody = this.getComponent(cc.RigidBody);

        rigidBody.linearVelocity = cc.v2(rigidBody.linearVelocity.x, 400);
        cc.audioEngine.playEffect(this.jumpSound, false);
    }

    playerDie()
    {
        if(this.isDie) return;
        this.isDie = true;
        const pos = this.node.getPosition(); // get v2
        this.anim.stop();
        cc.audioEngine.stopMusic();
        cc.audioEngine.playEffect(this.dieSound,false);
        const sprite = this.node.getComponent(cc.Sprite);
        cc.tween(this.node)
            .to(0.2, { position: cc.v3(pos.x, 50) }, { easing: 'quadOut' })
            .call(()=>{
                if (sprite) 
                {
                    sprite.spriteFrame = this.smallMarioAtlas.getSpriteFrame("mario_small_14");
                }
            })
            .to(0.5, { position: cc.v3(pos.x, -200) }, { easing: 'quadIn' })
            .to(1.0, { position: cc.v3(pos.x, -320) }, { easing: 'quadIn' })
            .call(() => {
                console.log('死亡動畫播放完畢');
            })
            .start();

        this.scheduleOnce(() => {
            this.gm.isDie = true;
            console.log('音效播放完，正式進入死亡狀態');
        }, 2);
    }

    playerAnimation()
    {
        // console.log("play animation");
        if(this.isDie) return;
        const animState = this.anim.getAnimationState;

        const rigidBody = this.getComponent(cc.RigidBody);
        const velocity = rigidBody.linearVelocity;

        if (this.isJump) 
        {
            if (!this.anim.getAnimationState("jump").isPlaying) {
                this.anim.play("jump");
            }
            return;
        }

        // walk
        if (this.moveDir !== 0) 
        {
            if (!this.anim.getAnimationState("walk").isPlaying) {
                this.anim.play("walk");
            }
        }
        
        else 
        {
            this.anim.stop(); // 停止所有動畫
            const sprite = this.node.getComponent(cc.Sprite);
           sprite.spriteFrame = this.smallMarioAtlas.getSpriteFrame("mario_small_17"); 
        }
    }

    onBeginContact(contact, selfCollider, otherCollider)
    {
        this.isJump = false;
        // cc.log("Collision with:", otherCollider.node.name);
    }

    onEndContact(contact,selfCollider,otherCollider)
    {
        // aviod continue jumping problem !
        this.isJump = true;
    }
}
