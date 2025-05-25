import Mushroom from "./Mushroom";
import GameManager from "./GameManager";
const { ccclass, property } = cc._decorator;

@ccclass
export default class QuestionBlock extends cc.Component {

    @property(cc.SpriteFrame)
    emptySprite: cc.SpriteFrame = null; 

    @property(cc.Node)
    mushroomNode: cc.Node = null;

    @property(cc.Node)
    scoreNode: cc.Node = null;

    @property({type:cc.AudioClip})
    block_be_hit: cc.AudioClip = null;

    private isHit: boolean = false;
    private anim: cc.Animation = null;
    private gm : any = GameManager.instance;

    start ()
    {
        this.anim = this.getComponent(cc.Animation);
        if (this.mushroomNode)
        {
            this.mushroomNode.active = false;
        }
        if (this.scoreNode)
        {
            this.scoreNode.active = false;
        }
        if(!this.anim.getAnimationState("block_spin").isPlaying)
        {
            console.log("play block spin");
            this.anim.play("block_spin");
        }
    }

    onBeginContact(contact, selfCollider, otherCollider)
    {
        if(this.isHit) return;

        const normal = contact.getWorldManifold().normal;
        const isBelow = normal.y < -0.9;

        if(!isBelow) return;

        // 從下面撞 => mushroom appear!
        this.isHit = true;
        cc.audioEngine.playEffect(this.block_be_hit, false);
        // stop all animation
        this.anim.stop();

        // change picture
        const sprite = this.node.getComponent(cc.Sprite);
        sprite.spriteFrame = this.emptySprite;

        // mushroom && score appear
        this.mushroomNode.active = true;
        this.scoreNode.active = true;

        // add score
        this.gm.score += 100;
        console.log("now score = ",this.gm.score);

        this.scheduleOnce(() => {
            if (this.scoreNode) 
            {
                this.scoreNode.destroy();
                this.scoreNode = null;
            }
        }, 1);

        const mushroomScript = this.mushroomNode.getComponent(Mushroom);
        if (mushroomScript)
        {
            mushroomScript.startMoving();
        }
    }

}
