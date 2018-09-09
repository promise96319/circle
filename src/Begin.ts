class Begin extends egret.DisplayObjectContainer {
    private score
    constructor (width, height, score) {
        super()
        this.score = score
        this.width = width
        this.height = height
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.init, this)
    }

    private startBtn:egret.TextField 
    private bitmap:egret.Bitmap
    private timeId:egret.Timer
    private r
    // 初始化界面
    private init () {
        // 背景图
        let shape:egret.Shape = new egret.Shape()
        shape.graphics.beginFill(0xffffff, 0.98)
        shape.graphics.drawRect(0, 0, this.width, this.height)
        shape.graphics.endFill()
        this.addChild(shape)

        let canvas = document.createElement('canvas')
        let ctx = canvas.getContext('2d')
        canvas.width = 2 * this.height
        canvas.height = 2 * this.height
        ctx.beginPath()
        ctx.arc(this.height, this.height, this.height, 0, Math.PI * 2)
        ctx.closePath()
        ctx.fillStyle = '#00caa8'
        ctx.fill()

        let bitmapdata = new egret.BitmapData(canvas)
        bitmapdata.$deleteSource = false
        const texture = new egret.Texture()
        texture._setBitmapData(bitmapdata)
        const bitmap = new egret.Bitmap(texture)
        this.r = this.width < this.height ? this.width / 3 : this.height / 3
        bitmap.width = 2 * this.r
        bitmap.height = 2 * this.r
        bitmap.touchEnabled = false

        bitmap.anchorOffsetX = bitmap.width / 2
        bitmap.anchorOffsetY = bitmap.height / 2
        bitmap.x = this.width / 2
        bitmap.y = this.height / 2

        this.bitmap = bitmap
        this.addChild(this.bitmap)
        this.bitmap.touchEnabled = true
        this.bitmap.addEventListener(egret.TouchEvent.TOUCH_TAP, (e) => {           
            this.handleBeginGame()
        }, this)

                // 点击开始按钮
        this.startBtn = new egret.TextField()
        this.addChild(this.startBtn)
        this.startBtn.width = 200
        this.startBtn.size = 32
        this.startBtn.text = '开始游戏'
        this.startBtn.textColor = 0xffffff
        this.startBtn.bold = true
        this.startBtn.x = this.width / 2 - this.startBtn.width / 2
        this.startBtn.y = this.height / 2 - this.startBtn.height / 2
        this.startBtn.textAlign = egret.HorizontalAlign.CENTER
        this.startBtn.touchEnabled = true
        this.startBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, (e) => {           
            this.handleBeginGame()
        }, this)

        let tempScale = 1
        this.timeId = new egret.Timer(16.7, 0)
        let beginTime = 0
        
        this.timeId.addEventListener(egret.TimerEvent.TIMER, () => {
            beginTime += 0.07
            tempScale = 0.6 + 0.4 * Math.abs(Math.sin(beginTime))
            this.bitmap.scaleX = this.bitmap.scaleY = tempScale
        } ,this)
        this.timeId.addEventListener(egret.TimerEvent.TIMER_COMPLETE, () => {
         } ,this)
        this.timeId.start()

        if (this.score === 0 || this.score) {
            this.addOverPage()
        }
    }

    private handleBeginGame () {
        this.bitmap.touchEnabled = false
        this.startBtn.touchEnabled = false

        this.timeId.stop()
        this.removeChild(this.startBtn)

        let tempScale = 1
        let timer = new egret.Timer(16.7, 32)
        
        timer.addEventListener(egret.TimerEvent.TIMER, () => {
            tempScale += this.height * 2 / 32 / this.r
            this.bitmap.scaleX = this.bitmap.scaleY = tempScale
        } ,this)
        timer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, () => {
            timer.stop()
            this.$parent.addChild(new Game(this.width, this.height))
            this.$parent.removeChild(this)
         } ,this)
        timer.start()

        // 在该圆的中心位置画一个圆扩散充满屏幕 + 回合数
        let round = new egret.TextField()
        round.text = "Round"
        round.size = 70
        round.textColor = 0xffffff
        round.bold = true
        round.x = this.width / 2 - round.width / 2
        round.y = this.height / 2 - round.height * 2

        let score = new egret.TextField()
        score.text = '1'
        score.textColor = 0xffffff
        score.size = 120
        score.bold = true
        score.x = this.width / 2 - score.width / 2
        score.y = this.height / 2 - score.height / 2

        setTimeout(() => {
           this.addChild(round)
           this.addChild(score)
        }, 200)
    }

    private addOverPage () {
        // 最高分
            let scoreTitle = new egret.TextField()
            scoreTitle.text = '—— 分数 ——'
            scoreTitle.width = this.width
            scoreTitle.size = 40
            scoreTitle.textColor = 0x333333
            scoreTitle.x = 0
            scoreTitle.y = this.height / 12
            scoreTitle.textAlign = egret.HorizontalAlign.CENTER
            this.addChild(scoreTitle)

           let scoreValue = new egret.TextField()
            scoreValue.text = ((this.score - 1) * 100).toString()
            scoreValue.width = this.width / 2
            scoreValue.size = 50
            scoreValue.textAlign = egret.HorizontalAlign.CENTER
            scoreValue.textColor = 0x333333
            scoreValue.x = this.width / 4
            scoreValue.y = this.height / 5
            scoreValue.italic = true
            scoreValue.bold = true
            this.addChild(scoreValue)

        // 排行榜
            let rank = new egret.DisplayObjectContainer()
            rank.width = this.width * 0.6
            rank.height = this.width * 0.3
            rank.x = this.width * 0.2
            rank.y = this.height * 0.7
            rank.addChild(platform.openDataContext.createDisplayObject(null, rank.width, rank.height))
            this.addChild(rank)
            
        // 分享游戏
            let shareGame = new egret.TextField()
            shareGame.text = '分享给你的好朋友吧~'
            shareGame.width = this.width
            shareGame.textAlign = egret.HorizontalAlign.CENTER
            shareGame.size = 24
            shareGame.textColor = 0x00caa8
            shareGame.x = 0
            shareGame.y = this.height * 0.92
            shareGame.touchEnabled = true
            shareGame.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
                platform.shareAppMessage().then(()=> {}).catch(() => {})
            }, this)
            this.addChild(shareGame)
    }
}