const { ccclass, property } = cc._decorator;

@ccclass
export default class AutoScroll extends cc.Component {

    @property
    scrollSpeed: number = 100; // 每秒捲動速度（像素）

    private _startX: number = 0;
    private _endX: number = 0;

    start() {
        this._startX = this.node.x;

        const parent = this.node.parent;
        if (!parent) {
            cc.warn("AutoScroll: 圖片沒有父節點！");
            return;
        }

        const viewWidth = parent.width;        // 顯示區域寬度（通常是 Canvas）
        const imageWidth = this.node.width;    // 圖片寬度

        // 圖片可以捲動的最大距離（負值，因為向右捲圖片要往左移）
        this._endX = this._startX - (imageWidth - viewWidth);
    }

    update(dt: number) {
        // 讓圖片往左移，畫面效果就像往右捲
        if (this.node.x > this._endX) {
            this.node.x -= this.scrollSpeed * dt;

            // 不要超過邊界
            if (this.node.x < this._endX) {
                this.node.x = this._endX;
            }
        }
    }
}
