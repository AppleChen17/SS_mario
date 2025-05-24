const { ccclass, property } = cc._decorator;

@ccclass
export default class CameraFollow extends cc.Component {
    @property(cc.Node)
    target: cc.Node = null;

    @property
    maxX: number = 2000; // 你場景的最大X邊界（可調整）

    update(dt: number) {
        if (!this.target) return;

        // Camera 跟隨 target.x，但限制在 [0, maxX] 範圍
        let targetX = this.target.x;

        // 限制邊界：不低於0、不高於 maxX
        targetX = Math.max(0, targetX);
        targetX = Math.min(this.maxX, targetX);

        this.node.x = targetX;
    }
}
