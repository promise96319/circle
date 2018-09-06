class Game extends egret.DisplayObjectContainer {
    public score

    constructor (width, height) {
        super()
        this.score = 0
        this.width = width
        this.height = height
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.init, this)
    }

    private init () {
        this.drawBg()
        this.addProgress()
        this.addCircle()
        this.stage.addEventListener(egret.TouchEvent.TOUCH_TAP, this.judgeBtn, this)
    }

    private drawBg () {
        let shape:egret.Shape = new egret.Shape()
        shape.graphics.beginFill(0xffffff, 0.9)
        shape.graphics.drawRect(0, 0, this.width, this.height)
        shape.graphics.endFill()
        this.addChild(shape)
    }

    // 进度条
    private progressShp:egret.Shape
    private progressBg:egret.Shape
    private timer:egret.Timer
    private addProgress () {
        this.progressBg = new egret.Shape()
        this.progressBg.graphics.beginFill(0x00ff00, 0.8)
        this.progressBg.graphics.drawRect(0, 0, this.width, 6)
        this.progressBg.graphics.endFill()
        this.addChild(this.progressBg)

        this.progressShp = new egret.Shape()
        this.progressShp.graphics.beginFill(0xff0000, 0.8)
        this.progressShp.graphics.drawRect(0, 0, 1, 6)
        this.progressShp.graphics.endFill()
        this.addChild(this.progressShp)

        // 开始计时
        this.timer = new egret.Timer(16.7, 0)
        this.timer.addEventListener(egret.TimerEvent.TIMER,this.timerFunc,this)
        this.timer.addEventListener(egret.TimerEvent.TIMER_COMPLETE,this.timerComFunc,this)
        this.timer.start()
    }

    private scaleSize = 1
    private timerFunc () {
        this.scaleSize += this.width / 600
        this.progressShp.scaleX = this.scaleSize
        if (this.scaleSize >= this.width) {
            this.timer.stop()
            this.handleFail()
            return
        }
    }

    private timerComFunc () {
    }


    private circleArr = []
    // 添加新的圆
    private addCircle () {
        let data = this.randomCircle()
        let instance = new Circle(data.x, data.y, data.r)
        this.addChild(instance)
        this.circleArr.push(instance)
    }

    // 随机生成圆的初始数据
    private randomCircle () {
        let maxCircleRadius = Math.floor(Math.min(this.width / 8, this.height / 8))
        let minCircleRadius = Math.ceil(Math.max(this.width / 16, this.height / 40))
        let flag, x, y, r
        do {
            r = Math.floor(Math.random() * (maxCircleRadius - minCircleRadius) + minCircleRadius)
            x = Math.floor(Math.random() * (this.width - 2.4 * r) + 1.2 * r)
            y = Math.floor(Math.random() * (this.height - 2.4 * r) + 1.2 * r)

            // 1.判断自身是否超出屏幕边界 === 不会超出

            // 2. 判断是否与其他圆相碰撞
            flag = this.circleArr.every((item) => {
                return Math.pow(item.x - x, 2) + Math.pow(item.y - y, 2) > Math.pow(item.r + r, 2)
            })
        } while (!flag)

        return {
            x: x,
            y: y,
            r: r
        }
    }

    // 判断点击的位置是否正确
    private judgeBtn (e) {
        let item = this.circleArr[this.circleArr.length - 1]
        let x = e.stageX - item._x
        let y = e.stageY - item._y

        // 点击后成功状态
        if (x * x + y * y <= item._r * item._r) {
            this.handleSuccess(item._x, item._y, item._r, item._color)
        } else {
            let flag = true
            for (let i = 0; i < this.circleArr.length - 1; i ++) {
                let item = this.circleArr[i]
                let tempX = item._x - e.stageX
                let tempY = item._y - e.stageY
                if (tempX * tempX + tempY * tempY <= item._r * item._r) {
                    this.handleFail()
                    return
                }
            }
        }
    }

    // 处理成功
    private tempCircleContainer:egret.DisplayObjectContainer
    private tempCircle:egret.Shape
    private timeId:egret.Timer
    private handleSuccess(x, y, r, color) {
        this.score = this.score + 1

        this.timer.stop()
        this.progressShp.scaleX = 1
        this.scaleSize = 1

        let canvas = document.createElement('canvas')
        let ctx = canvas.getContext('2d')
        canvas.width = 2 * r
        canvas.height = 2 * r
        ctx.beginPath()
        ctx.arc(r, r, r, 0, Math.PI * 2)
        ctx.closePath()
        ctx.fillStyle = color
        ctx.fill()

        let bitmapdata = new egret.BitmapData(canvas)
        bitmapdata.$deleteSource = false
        const texture = new egret.Texture()
        texture._setBitmapData(bitmapdata)
        const bitmap = new egret.Bitmap(texture)
        bitmap.width = 2 * r
        bitmap.height = 2 * r

        this.addChild(bitmap)
        bitmap.x = x
        bitmap.y = y
        bitmap.anchorOffsetX = bitmap.width / 2
        bitmap.anchorOffsetY = bitmap.height / 2

        let tempScale = 1
        this.timeId = new egret.Timer(16.7, 40)

        
        this.timeId.addEventListener(egret.TimerEvent.TIMER, () => {
            tempScale += this.height * 2 / 40 / r
            bitmap.scaleX = bitmap.scaleY = tempScale
        },this)
        this.timeId.addEventListener(egret.TimerEvent.TIMER_COMPLETE, () => {
            // 清除bitmap
            this.removeChild(bitmap)
            // 清除分数
            this.removeChild(round)
            this.removeChild(score)
            // 增加圆
            this.addCircle()
            // 开始计时器
            this.timer.start()
         } ,this)
        this.timeId.start()

        // 在该圆的中心位置画一个圆扩散充满屏幕 + 回合数
        let round = new egret.TextField()
        round.text = "Round"
        round.size = 70
        round.textColor = 0xffffff
        round.bold = true
        round.x = this.width / 2 - round.width / 2
        round.y = this.height / 2 - round.height * 2

        let score = new egret.TextField()
        score.text = this.score
        score.textColor = 0xffffff
        score.size = 120
        score.bold = true
        score.x = this.width / 2 - score.width / 2
        score.y = this.height / 2 - score.height / 2

        setTimeout(() => {
           this.addChild(round)
           this.addChild(score)
        }, 200)

        // 开始下一回合
        // 在回调函数中执行

    }

    // 处理失败
    private handleFail () {
        // 闪一下然后显示结束界面
    }
}