const { ccclass, property } = cc._decorator;

@ccclass
export default class Enemy extends cc.Component {
    @property
    speed: number = 5;

    @property
    moveDistance: number = 10; // 來回距離

    @property(cc.SpriteAtlas)
    turtleAtlas: cc.SpriteAtlas = null;

    @property(cc.Sprite)
    DieSprite: cc.Sprite = null;

    @property(cc.Node)
    ground: cc.Node = null;

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
        // if (this.rigidBody) {
            // this.rigidBody.fixedRotation = true;
        // }

        // 監聽碰撞事件
        // const collider = this.getComponent(cc.Collider);
        // if (collider) {
        //     collider.on('onBeginContact', this.onBeginContact, this);
        // }
    }

    start() {
        this.anim = this.getComponent(cc.Animation);
        this.node.setPosition(cc.v2(600, -200));
    }

    update(dt: number) 
    {
        if (this.isDie) return;

        this.node.x += this.speed * this.direction * dt;
        this.node.scaleX = (this.direction < 0) ? 1 : -1;
        this.turtleAnimation();
    }

    onBeginContact(contact, selfCollider, otherCollider)
    {
        if(otherCollider.node.name != "圖塊層 5")
        {
            cc.log("Collision with:", otherCollider.node.name);
            this.direction *= -1;
        }
    }

    turtleAnimation()
    {
        // console.log("play animation");
        if(this.isDie) return;
        const animState = this.anim.getAnimationState;

        const rigidBody = this.getComponent(cc.RigidBody);
        const velocity = rigidBody.linearVelocity;

        // walk
        if (this.direction !== 0) 
        {
            if (!this.anim.getAnimationState("turtle_walk").isPlaying) {
                this.anim.play("turtle_walk");
            }
        }
        
        else 
        {
            this.anim.stop(); // 停止所有動畫
            const sprite = this.node.getComponent(cc.Sprite);
           sprite.spriteFrame = this.turtleAtlas.getSpriteFrame("turtle_4"); 
        }
    }

    // 被踩死時呼叫此方法
    // public die() {
    //     if (this.isDie) return;

    //     this.isDie = true;

    //     // 停止移動
    //     this.rigidBody.linearVelocity = cc.v2(0, 0);
    //     this.rigidBody.enabledContactListener = false;

    //     // 換成死亡貼圖
    //     if (this.DieSprite && this.turtleAtlas) {
    //         const frame = this.turtleAtlas.getSpriteFrame("turtle_die");
    //         if (frame) {
    //             this.DieSprite.spriteFrame = frame;
    //         }
    //     }

    //     // 幾秒後移除節點
    //     this.scheduleOnce(() => {
    //         this.node.destroy();
    //     }, 1);
    // }
}
