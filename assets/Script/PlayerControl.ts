import GameManager from "./GameManager";
// import Info from "./Info";
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

    @property(cc.Node)
    infoNode: cc.Node = null;

    @property()
    playerSpeed: number = 200;

    @property()
    playerStandSpeed: number = 0;

    @property({type:cc.AudioClip})
    jumpSound: cc.AudioClip = null;

    @property({type:cc.AudioClip})
    dieSound: cc.AudioClip = null;

    @property({type:cc.AudioClip})
    eatMushroomSound: cc.AudioClip = null;

    @property({type:cc.AudioClip})
    turnSmall: cc.AudioClip = null;
    
//     private idleFrame: cc.SpriteFrame = null;

    private anim: cc.Animation = null;
    private physicManager: cc.PhysicsManager = null;
    private moveDir = 0;
    private isJump = false;
    private isInvincible = false;
    private fallDown = false;
    public isDie = false;
    public isBig = false;
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

        // if(this.getComponent(cc.RigidBody).linearVelocity.y != this.playerStandSpeed) this.fallDown = true;
        // else this.fallDown = false;
        if(this.node.y < -315) this.fallDown = true;
        else this.fallDown = false;
        // console.log("fall down", this.fallDown);

        if(this.fallDown && !this.isInvincible) 
        {
            this.playerDie();
            console.log("turn global player isDie = true");
            // this.gm.isDie = true;
        }
        this.playerAnimation();
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

    public playerDie()
    {
        if(this.isDie) return;
        // if eat mushroom => turn back to small
        if(this.isBig)
        {
            this.isBig = false;
            this.node.setScale(1, 1);
            this.isInvincible = true;
            this.scheduleOnce(() => {
                this.isInvincible = false;
                console.log("End Invincible");
            }, 1.5); // 無敵 1.5 秒

            this.scheduleOnce(() => {
                let finalBlink = cc.tween()
                    .to(0.05, { opacity: 50 })
                    .to(0.05, { opacity: 255 });
                cc.tween(this.node)
                    .repeat(3, finalBlink) // 0.3 秒快速閃爍
                    .start();
            }, 1.0);
            cc.audioEngine.playEffect(this.turnSmall,false);
            return;
        }
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
            if(this.isBig)
            {
                if (!this.anim.getAnimationState("big_jump").isPlaying) {
                    this.anim.play("big_jump");
                }
            }
            else
            {
                if (!this.anim.getAnimationState("jump").isPlaying) {
                    this.anim.play("jump");
                }
            }
        }

        // walk
        else if (this.moveDir !== 0) 
        {
            if(this.isBig)
            {
                if (!this.anim.getAnimationState("big_walk").isPlaying) 
                {
                    this.anim.play("big_walk");
                }
            }
            else
            {
                if (!this.anim.getAnimationState("walk").isPlaying) 
                {
                    this.anim.play("walk");
                }
            }
        }

        else 
        {
            this.anim.stop(); // 停止所有動畫
            const sprite = this.node.getComponent(cc.Sprite);

            if(this.isBig) sprite.spriteFrame = this.bigMarioAtlas.getSpriteFrame("mario_big_26"); 
            else sprite.spriteFrame = this.smallMarioAtlas.getSpriteFrame("mario_small_17"); 
        }
    }

    onBeginContact(contact, selfCollider, otherCollider)
    {
        
        const normal = contact.getWorldManifold().normal;
        const isBelow = normal.y < -0.9;
        // the platform contact from "bottom" => NOT jumping
        if(isBelow)
        {
            this.isJump = false;
        }
        
        cc.log("Mario Collision with:", otherCollider.node.name);
        // if(otherCollider.node.name == "turtle") this.playerDie();
        if(otherCollider.node.name == "mushroom")
        {
            cc.audioEngine.playEffect(this.eatMushroomSound,false);
            this.isBig = true;
            this.node.setScale(1.5, 1.5);
            console.log("Mario turn big !");
        }
        else if(otherCollider.node.name == "flag")
        {
            if (this.infoNode)
            {
                const ClearScene = this.infoNode.getComponent("Info");
                if (ClearScene)
                {
                    this.gm.isClear = true;
                    this.moveDir = 0; // stop walking
                    ClearScene.LevelClear();
                }
                else
                {
                    cc.log("Cannot Find Script Info");
                }
            }
            else 
            {
                cc.log("infoNode 尚未綁定");
            }
        }
    }

    onEndContact(contact,selfCollider,otherCollider)
    {
        // aviod continue jumping problem !
        this.isJump = true;
    }
}
