const { ccclass, property } = cc._decorator;

@ccclass
export default class Mushroom extends cc.Component {

    private speed: number = 0;
    private physicManager: cc.PhysicsManager = null;

    onLoad()
    {
        this.physicManager = cc.director.getPhysicsManager();
        this.physicManager.enabled = true;
        // add gravity
        this.physicManager.gravity = cc.v2(0, -200);
    }

    public startMoving ()
    {
        console.log("Mushroom starts moving!");
        this.speed = 35;
    }

    update(dt: number) {
        const body = this.getComponent(cc.RigidBody);
        if (body && this.speed !== 0) {
            body.linearVelocity = cc.v2(this.speed, body.linearVelocity.y);
        }
    }

    // TODO: contact with Mario => destroy
    onBeginContact(contact, selfCollider, otherCollider)
    {
        if(otherCollider.node.name == "mario")
        {
            console.log("Mushroom destroy");
            this.node.destroy();
        }
    }
}
