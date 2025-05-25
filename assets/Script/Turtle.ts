const { ccclass, property } = cc._decorator;
import PlayerControl from "./PlayerControl";

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

    @property({type:cc.AudioClip})
    turtle_be_kicked: cc.AudioClip = null;

    private startX: number = 0;
    private direction: number = 1;
    private isDie: boolean = false;
    private anim: cc.Animation = null;
    private physicManager: cc.PhysicsManager = null;
    private rigidBody: cc.RigidBody = null;
    private changedir: boolean = false;

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
    }

    update(dt: number) 
    {
        this.node.x += this.speed * this.direction * dt;
        this.node.scaleX = (this.direction < 0) ? 1 : -1;
        this.turtleAnimation();
    }

    onBeginContact(contact, selfCollider, otherCollider)
    {
        const normal = contact.getWorldManifold().normal;
        const isUpside = normal.y > 0.9;
        // if (!isUpside)
        // {
        //     contact.disabled = true;
        //     return;
        // }

        if(otherCollider.node.name != "圖塊層 5")
        {
            cc.log("Turtle Collision with:", otherCollider.node.name);
            if(otherCollider.node.name == "mario")
            {
                if(isUpside && (!this.isDie))
                {
                    console.log("from up!");
                    this.speed = 0;
                    contact.disabled = true;
                    // 依據來的角度決定誰死
                    this.die();
                    cc.audioEngine.playEffect(this.turtle_be_kicked, false);
                    this.scheduleOnce(() => {
                        const sprite = this.node.getComponent(cc.Sprite);
                        sprite.spriteFrame = this.turtleAtlas.getSpriteFrame("turtle_4");
                        console.log('音效播放完，正式進入死亡狀態');
                    }, 1.0);


                    this.scheduleOnce(() => {
                        contact.disabled = false;
                        if (!this.anim.getAnimationState("turtle_spin").isPlaying)
                        {
                            this.anim.play("turtle_spin");
                            console.log('start spinning !!!');
                            this.speed = 5;
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
            else this.direction *= -1;
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
