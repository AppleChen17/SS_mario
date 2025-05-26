const { ccclass, property } = cc._decorator;
import PlayerControl from "./PlayerControl";
import GameManager from "./GameManager";

@ccclass
export default class Enemy extends cc.Component {
    @property
    speed: number = 5;

    // @property
    // moveDistance: number = 10; // 來回距離

    @property(cc.SpriteAtlas)
    turtleAtlas: cc.SpriteAtlas = null;

    @property(cc.Sprite)
    DieSprite: cc.Sprite = null;

    @property(cc.Node)
    ground: cc.Node = null;

    @property(cc.Node)
    scoreNode: cc.Node = null;

    @property({type:cc.AudioClip})
    turtle_be_kicked: cc.AudioClip = null;

    private startX: number = 0;
    private direction: number = 1;
    private isDie: boolean = false;
    private anim: cc.Animation = null;
    private physicManager: cc.PhysicsManager = null;
    private rigidBody: cc.RigidBody = null;
    private changedir: boolean = false;
    private canChangeDirection: boolean = true;
    private gm : any = GameManager.instance;

    onLoad() {
        this.startX = this.node.x;
        this.direction = 1;
        this.physicManager = cc.director.getPhysicsManager();
        this.physicManager.enabled = true;
        this.physicManager.gravity = cc.v2(0, -200);
        this.rigidBody = this.getComponent(cc.RigidBody);
        console.log("start = ",this.node.x,this.startX);
    }

    start() {
        this.anim = this.getComponent(cc.Animation);
        this.node.setPosition(cc.v2(600, -200));        
        if (this.scoreNode)
        {
            this.scoreNode.active = false;
        }
    }

    update(dt: number) 
    {
        // this.node.x += this.speed * this.direction * dt;
        // this.node.scaleX = (this.direction < 0) ? 1 : -1;
        
        // is rigid body => have speed and use linear Velocity !
        this.rigidBody.linearVelocity = cc.v2(this.speed * this.direction, this.rigidBody.linearVelocity.y);
        this.node.scaleX = (this.direction < 0) ? 1 : -1;
        // if (this.scoreNode) 
        // {
        //     this.scoreNode.scaleX = 1;
        // }
        this.turtleAnimation();
    }

    onBeginContact(contact, selfCollider, otherCollider)
    {
        if (!this.canChangeDirection) return;
        const normal = contact.getWorldManifold().normal;
        const isUpside = normal.y > 0.9;
        // if (!isUpside)
        // {
        //     contact.disabled = true;
        //     return;
        // }
        cc.log("Turtle Collision with:", otherCollider.node.name);
        if(otherCollider.node.name != "圖塊層 5")
        {
            // cc.log("Turtle Collision with:", otherCollider.node.name);

            if(otherCollider.node.name == "mario")
            {
                if(isUpside && (!this.isDie))
                {
                    console.log("from up!");
                    this.speed = 0;
                    this.gm.score += 200;
                    if(this.scoreNode)
                    {
                        this.scoreNode.scaleX = 1;
                        this.scoreNode.active = true;
                    }
                    const playerControl = otherCollider.node.getComponent(PlayerControl);
                    playerControl.isInvincible = true;

                    this.scheduleOnce(() => {
                        playerControl.isInvincible = false;
                        console.log("End Invincible");
                        if(this.scoreNode)
                        {
                            this.scoreNode.destroy();
                            this.scoreNode = null;
                        }
                    }, 1.5); // 無敵 1.5 秒

                    // 依據來的角度決定誰死
                    this.die();
                    cc.audioEngine.playEffect(this.turtle_be_kicked, false);
                    this.scheduleOnce(() => {
                        const sprite = this.node.getComponent(cc.Sprite);
                        sprite.spriteFrame = this.turtleAtlas.getSpriteFrame("turtle_4");
                        console.log('finish turtle_be_kicked => turtie.isDie');
                    }, 1.0);

                    this.scheduleOnce(() => {
                        contact.disabled = false;
                        if (!this.anim.getAnimationState("turtle_spin").isPlaying)
                        {
                            this.anim.play("turtle_spin");
                            console.log('start spinning !!!');
                            this.speed = 100;
                        }
                    }, 5);
                }
                else
                {
                    console.log("player die");
                    const playerControl = otherCollider.node.getComponent(PlayerControl);
                    if (playerControl && (!playerControl.isInvincible)) 
                    {
                        playerControl.playerDie();
                    }
                }
            }
            
            // change direction
            else
            {
                if(otherCollider.node.name == "圖塊層 4" || otherCollider.node.name == "圖塊層 6")
                this.direction *= -1;
                console.log("change Turtle direction");
                this.canChangeDirection = false;

                // 設定一段冷卻，避免太快反覆切換
                this.scheduleOnce(() => {
                    this.canChangeDirection = true;
                }, 0.3); // 0.3秒可調整
            }
        }
    }

    turtleAnimation()
    {
        // console.log("play animation");
        // if(this.isDie) return;
        const animState = this.anim.getAnimationState;

        const rigidBody = this.getComponent(cc.RigidBody);
        const velocity = rigidBody.linearVelocity;

        // walk
        if (!this.isDie) 
        {
            if (!this.anim.getAnimationState("turtle_walk").isPlaying) 
            {
                this.anim.play("turtle_walk");
            }
        }

        // else
        // {
        //     this.die();

        //     this.scheduleOnce(() => {
        //         const sprite = this.node.getComponent(cc.Sprite);
        //         sprite.spriteFrame = this.turtleAtlas.getSpriteFrame("turtle_4"); 
        //         console.log('音效播放完，正式進入死亡狀態');
        //     }, 0.5);

        // }
    }

    public die() 
    {
        if (this.isDie) return;

        this.isDie = true;
        if (!this.anim.getAnimationState("turtle_die").isPlaying)
        {
            this.anim.play("turtle_die");
        }
    }
}
