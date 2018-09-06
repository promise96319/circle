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
    constructor (x, y, r) {
        super()
        this._r = r
        this._x = x
        this._y = y
        this._color = this.randomColor()

        let canvas = document.createElement('canvas')
        let ctx = canvas.getContext('2d')
        canvas.width = 2 * r
        canvas.height = 2 * r
        ctx.beginPath()
        ctx.arc(r, r, r, 0, Math.PI * 2)
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

        this.addChild(bitmap)
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

    public beginScale () {
        this.scaleX = 5
        this.scaleY = 3
    }

    public successScale () {
        
    }

    public failScale () {

    }
}