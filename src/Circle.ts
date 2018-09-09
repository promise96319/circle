/**
 * 圆类：
 *  属性：{
 *     坐标：x, y
 *     半径： r 
 *     颜色: color
 *  }
 * 
 *  方法： 
 *      1. 进入时，弹性阻尼式 放大
 *      2. 回答正确时，快速放大充满全屏，并添加文字说明
 *      3. 回答错误的时候，正确答案快速闪一下
 *      4. 回答错误时，跳转到分数和排行榜页面
 */
class Circle extends egret.DisplayObjectContainer{
    private _r
    private _x
    private _y
    private _color
    private bitmap
    constructor (x, y, r) {
        super()
        this._r = r
        this._x = x
        this._y = y
        this._color = this.randomColor()

        let canvas = document.createElement('canvas')
        let ctx = canvas.getContext('2d')
        canvas.width = 32 * r
        canvas.height = 32 * r
        ctx.beginPath()
        ctx.arc(16 * r, 16 * r, 16 * r, 0, Math.PI * 2)
        ctx.closePath()
        ctx.fillStyle = this._color
        ctx.fill()

        const bitmapdata = new egret.BitmapData(canvas)
        bitmapdata.$deleteSource = false
        const texture = new egret.Texture()
        texture._setBitmapData(bitmapdata)
        const bitmap = new egret.Bitmap(texture)
        
        bitmap.width = 2 * r
        bitmap.height = 2 * r

        bitmap.x = x
        bitmap.y = y
        bitmap.anchorOffsetX = bitmap.width / 2
        bitmap.anchorOffsetY = bitmap.height / 2

        // bitmap.scaleX = 0.2
        // bitmap.scaleY = 0.2

        this.bitmap = bitmap

        this.addChild(this.bitmap)
    }

    public randomColor () {
        let str = '#'
        let colorArr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'a', 'b', 'c', 'd', 'e']
        for (let i = 0; i < 6; i++) {
            let temp = parseInt((Math.random() * 15).toString())
            str += colorArr[temp]
        }
        return str
    }

    public startScale () {
        // 运动的时间不相同
        // 那么需要根据r来使得时间不同
        // 即初速度v是固定的
        // 那么得到的加速度不相同
        let distance = this._r
        let startV = 480
        // x = v * v / a / 2
        let a = startV * startV / 2 / distance
        let scale = 0.2
        let time = 0

        let timeId:egret.Timer = new egret.Timer(16.7, 0)
        
        let flag = false
        timeId.addEventListener(egret.TimerEvent.TIMER, () => {
            time += 16.7 / 1000
            scale = 0.2 + (startV * time - a * time * time / 2) / distance
            if (scale > 1) {
                flag = true
            }
            if (flag && scale <= 1) {
                timeId.stop()
            }
            this.bitmap.scaleX = this.bitmap.scaleY = scale
        } ,this)
        timeId.addEventListener(egret.TimerEvent.TIMER_COMPLETE, () => {
            // timeId.stop()
         } ,this)
        timeId.start()
    }

    public failScale () {
        let timeId:egret.Timer = new egret.Timer(16.7, 0)
        let time = 0
        let scale = 0
        timeId.addEventListener(egret.TimerEvent.TIMER, () => {
            time += 0.25
            scale = 1 + 0.2 * Math.abs(Math.sin(time))
            if (time >= Math.PI * 3) {
                timeId.stop()
            }
            this.bitmap.scaleX = this.bitmap.scaleY = scale
        } ,this)
        timeId.addEventListener(egret.TimerEvent.TIMER_COMPLETE, () => {
         } ,this)
        timeId.start()
    }
}