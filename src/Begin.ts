class Begin extends egret.DisplayObjectContainer {
    constructor (width, height) {
        super()
        this.width = width
        this.height = height
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.init, this)
    }

    private startBtn:egret.TextField 
    // 初始化界面
    private init () {
        // 背景图
        let shape:egret.Shape = new egret.Shape()
        shape.graphics.beginFill(0x0000ff, 0.3)
        shape.graphics.drawRect(0, 0, this.width, this.height)
        shape.graphics.endFill()
        this.addChild(shape)

        // 点击开始按钮
        this.startBtn = new egret.TextField()
        this.addChild(this.startBtn)
        this.startBtn.width = 320
        this.startBtn.size = 64
        this.startBtn.text = '开始游戏'
        this.startBtn.textColor = 0x33ff33
        this.startBtn.bold = true
        this.startBtn.x = this.width / 2 - this.startBtn.width / 2
        this.startBtn.y = this.height / 2 - this.startBtn.height
        this.startBtn.textAlign = egret.HorizontalAlign.CENTER
        this.startBtn.touchEnabled = true
        this.startBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, (e) => {           
            e.stopImmediatePropagation()
            if (e.stageX > this.startBtn.x && e.stageX < this.startBtn.x + this.startBtn.width && e.stageY > this.startBtn.y && e.stageY < this.startBtn.y + this.startBtn.height) {
                this.handleBeginGame()
            }
        }, this)
    }

    private handleBeginGame () {
        this.$parent.addChild(new Game(this.width, this.height))
        this.$parent.removeChild(this)
    }
}