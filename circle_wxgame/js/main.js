var egret = window.egret;var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var Begin = (function (_super) {
    __extends(Begin, _super);
    function Begin(width, height, score) {
        var _this = _super.call(this) || this;
        _this.score = score;
        _this.width = width;
        _this.height = height;
        _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.init, _this);
        return _this;
    }
    // 初始化界面
    Begin.prototype.init = function () {
        var _this = this;
        // 背景图
        var shape = new egret.Shape();
        shape.graphics.beginFill(0xffffff, 0.98);
        shape.graphics.drawRect(0, 0, this.width, this.height);
        shape.graphics.endFill();
        this.addChild(shape);
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        canvas.width = 2 * this.height;
        canvas.height = 2 * this.height;
        ctx.beginPath();
        ctx.arc(this.height, this.height, this.height, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fillStyle = '#00caa8';
        ctx.fill();
        var bitmapdata = new egret.BitmapData(canvas);
        bitmapdata.$deleteSource = false;
        var texture = new egret.Texture();
        texture._setBitmapData(bitmapdata);
        var bitmap = new egret.Bitmap(texture);
        this.r = this.width < this.height ? this.width / 3 : this.height / 3;
        bitmap.width = 2 * this.r;
        bitmap.height = 2 * this.r;
        bitmap.touchEnabled = false;
        bitmap.anchorOffsetX = bitmap.width / 2;
        bitmap.anchorOffsetY = bitmap.height / 2;
        bitmap.x = this.width / 2;
        bitmap.y = this.height / 2;
        this.bitmap = bitmap;
        this.addChild(this.bitmap);
        this.bitmap.touchEnabled = true;
        this.bitmap.addEventListener(egret.TouchEvent.TOUCH_TAP, function (e) {
            _this.handleBeginGame();
        }, this);
        // 点击开始按钮
        this.startBtn = new egret.TextField();
        this.addChild(this.startBtn);
        this.startBtn.width = 200;
        this.startBtn.size = 32;
        this.startBtn.text = '开始游戏';
        this.startBtn.textColor = 0xffffff;
        this.startBtn.bold = true;
        this.startBtn.x = this.width / 2 - this.startBtn.width / 2;
        this.startBtn.y = this.height / 2 - this.startBtn.height / 2;
        this.startBtn.textAlign = egret.HorizontalAlign.CENTER;
        this.startBtn.touchEnabled = true;
        this.startBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, function (e) {
            _this.handleBeginGame();
        }, this);
        var tempScale = 1;
        this.timeId = new egret.Timer(16.7, 0);
        var beginTime = 0;
        this.timeId.addEventListener(egret.TimerEvent.TIMER, function () {
            beginTime += 0.07;
            tempScale = 0.6 + 0.4 * Math.abs(Math.sin(beginTime));
            _this.bitmap.scaleX = _this.bitmap.scaleY = tempScale;
        }, this);
        this.timeId.addEventListener(egret.TimerEvent.TIMER_COMPLETE, function () {
        }, this);
        this.timeId.start();
        if (this.score === 0 || this.score) {
            this.addOverPage();
        }
    };
    Begin.prototype.handleBeginGame = function () {
        var _this = this;
        this.bitmap.touchEnabled = false;
        this.startBtn.touchEnabled = false;
        this.timeId.stop();
        this.removeChild(this.startBtn);
        var tempScale = 1;
        var timer = new egret.Timer(16.7, 32);
        timer.addEventListener(egret.TimerEvent.TIMER, function () {
            tempScale += _this.height * 2 / 32 / _this.r;
            _this.bitmap.scaleX = _this.bitmap.scaleY = tempScale;
        }, this);
        timer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, function () {
            timer.stop();
            _this.$parent.addChild(new Game(_this.width, _this.height));
            _this.$parent.removeChild(_this);
        }, this);
        timer.start();
        // 在该圆的中心位置画一个圆扩散充满屏幕 + 回合数
        var round = new egret.TextField();
        round.text = "Round";
        round.size = 70;
        round.textColor = 0xffffff;
        round.bold = true;
        round.x = this.width / 2 - round.width / 2;
        round.y = this.height / 2 - round.height * 2;
        var score = new egret.TextField();
        score.text = '1';
        score.textColor = 0xffffff;
        score.size = 120;
        score.bold = true;
        score.x = this.width / 2 - score.width / 2;
        score.y = this.height / 2 - score.height / 2;
        setTimeout(function () {
            _this.addChild(round);
            _this.addChild(score);
        }, 200);
    };
    Begin.prototype.addOverPage = function () {
        // 最高分
        var scoreTitle = new egret.TextField();
        scoreTitle.text = '—— 分数 ——';
        scoreTitle.width = this.width;
        scoreTitle.size = 40;
        scoreTitle.textColor = 0x333333;
        scoreTitle.x = 0;
        scoreTitle.y = this.height / 12;
        scoreTitle.textAlign = egret.HorizontalAlign.CENTER;
        this.addChild(scoreTitle);
        var scoreValue = new egret.TextField();
        scoreValue.text = ((this.score - 1) * 100).toString();
        scoreValue.width = this.width / 2;
        scoreValue.size = 50;
        scoreValue.textAlign = egret.HorizontalAlign.CENTER;
        scoreValue.textColor = 0x333333;
        scoreValue.x = this.width / 4;
        scoreValue.y = this.height / 5;
        scoreValue.italic = true;
        scoreValue.bold = true;
        this.addChild(scoreValue);
        // 排行榜
        var rank = new egret.DisplayObjectContainer();
        rank.width = this.width * 0.6;
        rank.height = this.width * 0.3;
        rank.x = this.width * 0.2;
        rank.y = this.height * 0.7;
        rank.addChild(platform.openDataContext.createDisplayObject(null, rank.width, rank.height));
        this.addChild(rank);
        // 分享游戏
        var shareGame = new egret.TextField();
        shareGame.text = '分享给你的好朋友吧~';
        shareGame.width = this.width;
        shareGame.textAlign = egret.HorizontalAlign.CENTER;
        shareGame.size = 24;
        shareGame.textColor = 0x00caa8;
        shareGame.x = 0;
        shareGame.y = this.height * 0.92;
        shareGame.touchEnabled = true;
        shareGame.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            platform.shareAppMessage().then(function () { }).catch(function () { });
        }, this);
        this.addChild(shareGame);
    };
    return Begin;
}(egret.DisplayObjectContainer));
__reflect(Begin.prototype, "Begin");
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
var Circle = (function (_super) {
    __extends(Circle, _super);
    function Circle(x, y, r) {
        var _this = _super.call(this) || this;
        _this._r = r;
        _this._x = x;
        _this._y = y;
        _this._color = _this.randomColor();
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        canvas.width = 32 * r;
        canvas.height = 32 * r;
        ctx.beginPath();
        ctx.arc(16 * r, 16 * r, 16 * r, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fillStyle = _this._color;
        ctx.fill();
        var bitmapdata = new egret.BitmapData(canvas);
        bitmapdata.$deleteSource = false;
        var texture = new egret.Texture();
        texture._setBitmapData(bitmapdata);
        var bitmap = new egret.Bitmap(texture);
        bitmap.width = 2 * r;
        bitmap.height = 2 * r;
        bitmap.x = x;
        bitmap.y = y;
        bitmap.anchorOffsetX = bitmap.width / 2;
        bitmap.anchorOffsetY = bitmap.height / 2;
        // bitmap.scaleX = 0.2
        // bitmap.scaleY = 0.2
        _this.bitmap = bitmap;
        _this.addChild(_this.bitmap);
        return _this;
    }
    Circle.prototype.randomColor = function () {
        var str = '#';
        var colorArr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'a', 'b', 'c', 'd', 'e'];
        for (var i = 0; i < 6; i++) {
            var temp = parseInt((Math.random() * 15).toString());
            str += colorArr[temp];
        }
        return str;
    };
    Circle.prototype.startScale = function () {
        var _this = this;
        // 运动的时间不相同
        // 那么需要根据r来使得时间不同
        // 即初速度v是固定的
        // 那么得到的加速度不相同
        var distance = this._r;
        var startV = 480;
        // x = v * v / a / 2
        var a = startV * startV / 2 / distance;
        var scale = 0.2;
        var time = 0;
        var timeId = new egret.Timer(16.7, 0);
        var flag = false;
        timeId.addEventListener(egret.TimerEvent.TIMER, function () {
            time += 16.7 / 1000;
            scale = 0.2 + (startV * time - a * time * time / 2) / distance;
            if (scale > 1) {
                flag = true;
            }
            if (flag && scale <= 1) {
                timeId.stop();
            }
            _this.bitmap.scaleX = _this.bitmap.scaleY = scale;
        }, this);
        timeId.addEventListener(egret.TimerEvent.TIMER_COMPLETE, function () {
            // timeId.stop()
        }, this);
        timeId.start();
    };
    Circle.prototype.failScale = function () {
        var _this = this;
        var timeId = new egret.Timer(16.7, 0);
        var time = 0;
        var scale = 0;
        timeId.addEventListener(egret.TimerEvent.TIMER, function () {
            time += 0.25;
            scale = 1 + 0.2 * Math.abs(Math.sin(time));
            if (time >= Math.PI * 3) {
                timeId.stop();
            }
            _this.bitmap.scaleX = _this.bitmap.scaleY = scale;
        }, this);
        timeId.addEventListener(egret.TimerEvent.TIMER_COMPLETE, function () {
        }, this);
        timeId.start();
    };
    return Circle;
}(egret.DisplayObjectContainer));
__reflect(Circle.prototype, "Circle");
var Game = (function (_super) {
    __extends(Game, _super);
    function Game(width, height) {
        var _this = _super.call(this) || this;
        _this.scaleSize = 1;
        _this.circleArr = [];
        _this.score = 1;
        _this.width = width;
        _this.height = height;
        _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.init, _this);
        return _this;
    }
    Game.prototype.init = function () {
        this.drawBg();
        this.addProgress();
        this.addCircle();
        this.stage.addEventListener(egret.TouchEvent.TOUCH_TAP, this.judgeBtn, this);
    };
    Game.prototype.drawBg = function () {
        var shape = new egret.Shape();
        shape.graphics.beginFill(0xffffff, 0.98);
        shape.graphics.drawRect(0, 0, this.width, this.height);
        shape.graphics.endFill();
        this.addChild(shape);
    };
    Game.prototype.addProgress = function () {
        this.progressBg = new egret.Shape();
        this.progressBg.graphics.beginFill(0x00ff00, 0.8);
        this.progressBg.graphics.drawRect(0, 0, this.width, 6);
        this.progressBg.graphics.endFill();
        this.addChild(this.progressBg);
        this.progressShp = new egret.Shape();
        this.progressShp.graphics.beginFill(0xff0000, 0.8);
        this.progressShp.graphics.drawRect(0, 0, 1, 6);
        this.progressShp.graphics.endFill();
        this.addChild(this.progressShp);
        // 开始计时
        this.timer = new egret.Timer(16.7, 0);
        this.timer.addEventListener(egret.TimerEvent.TIMER, this.timerFunc, this);
        this.timer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, this.timerComFunc, this);
        this.timer.start();
    };
    Game.prototype.timerFunc = function () {
        this.scaleSize += this.width / 600;
        this.progressShp.scaleX = this.scaleSize;
        if (this.scaleSize >= this.width) {
            this.timer.stop();
            this.handleFail();
            return;
        }
    };
    Game.prototype.timerComFunc = function () {
    };
    // 添加新的圆
    Game.prototype.addCircle = function () {
        var data = this.randomCircle();
        var instance = new Circle(data.x, data.y, data.r);
        this.addChild(instance);
        this.circleArr.push(instance);
        for (var i = 0; i < this.circleArr.length; i++) {
            this.circleArr[i].startScale();
        }
    };
    // 随机生成圆的初始数据
    Game.prototype.randomCircle = function () {
        var maxCircleRadius = Math.floor(Math.min(this.width / 8, this.height / 8));
        var minCircleRadius = Math.ceil(Math.max(this.width / 16, this.height / 40));
        var flag, x, y, r, num;
        do {
            num++;
            if (num > 40) {
                minCircleRadius = Math.ceil(Math.max(this.width / 64, this.height / 40));
            }
            r = Math.floor(Math.random() * (maxCircleRadius - minCircleRadius) + minCircleRadius);
            x = Math.floor(Math.random() * (this.width - 2.4 * r) + 1.2 * r);
            y = Math.floor(Math.random() * (this.height - 2.4 * r) + 1.2 * r);
            // 1.判断自身是否超出屏幕边界 === 不会超出
            // 2. 判断是否与其他圆相碰撞
            flag = this.circleArr.every(function (item) {
                return Math.pow(item._x - x, 2) + Math.pow(item._y - y, 2) > Math.pow(1.2 * (item._r + r), 2);
            });
        } while (!flag);
        return {
            x: x,
            y: y,
            r: r
        };
    };
    // 判断点击的位置是否正确
    Game.prototype.judgeBtn = function (e) {
        var item = this.circleArr[this.circleArr.length - 1];
        var x = e.stageX - item._x;
        var y = e.stageY - item._y;
        // 点击后成功状态
        if (x * x + y * y <= item._r * item._r) {
            this.handleSuccess(item._x, item._y, item._r, item._color);
            return;
        }
        else {
            var flag = true;
            for (var i = 0; i < this.circleArr.length - 1; i++) {
                var item_1 = this.circleArr[i];
                var tempX = item_1._x - e.stageX;
                var tempY = item_1._y - e.stageY;
                if (tempX * tempX + tempY * tempY <= item_1._r * item_1._r) {
                    this.handleFail();
                    return;
                }
            }
        }
    };
    Game.prototype.handleSuccess = function (x, y, r, color) {
        var _this = this;
        this.stage.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.judgeBtn, this);
        this.score = this.score + 1;
        this.timer.stop();
        this.progressShp.scaleX = 1;
        this.scaleSize = 1;
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        canvas.width = 2 * this.height;
        canvas.height = 2 * this.height;
        ctx.beginPath();
        ctx.arc(this.height, this.height, this.height, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
        var bitmapdata = new egret.BitmapData(canvas);
        bitmapdata.$deleteSource = false;
        var texture = new egret.Texture();
        texture._setBitmapData(bitmapdata);
        var bitmap = new egret.Bitmap(texture);
        bitmap.width = 2 * r;
        bitmap.height = 2 * r;
        bitmap.touchEnabled = false;
        this.addChild(bitmap);
        bitmap.x = x;
        bitmap.y = y;
        bitmap.anchorOffsetX = bitmap.width / 2;
        bitmap.anchorOffsetY = bitmap.height / 2;
        var tempScale = 1;
        this.timeId = new egret.Timer(16.7, 32);
        this.timeId.addEventListener(egret.TimerEvent.TIMER, function () {
            tempScale += _this.height * 2 / 32 / r;
            bitmap.scaleX = bitmap.scaleY = tempScale;
        }, this);
        this.timeId.addEventListener(egret.TimerEvent.TIMER_COMPLETE, function () {
            _this.stage.addEventListener(egret.TouchEvent.TOUCH_TAP, _this.judgeBtn, _this);
            // 清除bitmap
            _this.removeChild(bitmap);
            // 清除分数
            _this.removeChild(round);
            _this.removeChild(score);
            // 增加圆
            _this.addCircle();
            // 开始计时器
            _this.timer.start();
        }, this);
        this.timeId.start();
        // 在该圆的中心位置画一个圆扩散充满屏幕 + 回合数
        var round = new egret.TextField();
        round.text = "Round";
        round.size = 70;
        round.textColor = 0xffffff;
        round.bold = true;
        round.x = this.width / 2 - round.width / 2;
        round.y = this.height / 2 - round.height * 2;
        var score = new egret.TextField();
        score.text = this.score;
        score.textColor = 0xffffff;
        score.size = 120;
        score.bold = true;
        score.x = this.width / 2 - score.width / 2;
        score.y = this.height / 2 - score.height / 2;
        setTimeout(function () {
            _this.addChild(round);
            _this.addChild(score);
        }, 200);
        // 开始下一回合
        // 在回调函数中执行
    };
    // 处理失败
    // 弹出分享复活对话框
    // 分享重新复活、或者直接结束游戏
    Game.prototype.handleFail = function () {
        var _this = this;
        // 停止计时器
        this.timer.stop();
        // 移除事件监听
        this.stage.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.judgeBtn, this);
        // 正确的圆闪一下然后显示结束界面
        this.circleArr[this.circleArr.length - 1].failScale();
        setTimeout(function () {
            // 切换到失败页面
            // 背景图
            var failBg = new egret.Shape();
            failBg.graphics.beginFill(0x000000, 0.7);
            failBg.graphics.drawRect(0, 0, _this.width, _this.height);
            failBg.graphics.endFill();
            failBg.touchEnabled = false;
            _this.addChildAt(failBg, _this.numChildren + 1);
            // 失败提示
            // let failBgTexture:egret.Texture = RES.getRes("fail_bgc_png")
            // let failContain:egret.Bitmap = new egret.Bitmap(failBgTexture)
            // failContain.width = this.width * 2 / 3
            // failContain.height = this.width * 2 / 3
            // failContain.x = this.width / 2 - failContain.width / 2
            // failContain.y = this.height / 2 - failContain.height
            // this.addChildAt(failContain, this.numChildren + 1)
            // 分享功能
            var over = new egret.TextField();
            over.text = "结束游戏";
            over.size = 40;
            over.textColor = 0xff0000;
            over.width = _this.width * 5 / 6;
            over.textAlign = egret.HorizontalAlign.LEFT;
            over.x = _this.width / 12;
            over.y = _this.height / 4 - 20;
            over.touchEnabled = true;
            over.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                // 发送成绩信息
                platform.openDataContext.postMessage({
                    score: (_this.score - 1) * 100,
                    openId: egret.localStorage.getItem('openId'),
                    command: 'updateMaxScore'
                });
                // 添加排行榜界面
                // 移除游戏
                _this.$parent.addChild(new Begin(_this.width, _this.height, _this.score));
                _this.$parent.removeChild(_this);
            }, _this);
            _this.addChild(over);
            var vs = new egret.TextField();
            vs.text = "VS";
            vs.italic = true;
            vs.size = 72;
            vs.textColor = 0xffffff;
            vs.width = _this.width;
            vs.x = 0;
            vs.y = _this.height / 2 - 36;
            vs.textAlign = egret.HorizontalAlign.CENTER;
            _this.addChild(vs);
            var share = new egret.TextField();
            share.text = "分享复活";
            share.size = 40;
            share.textColor = 0x00ff00;
            share.width = _this.width * 5 / 6;
            share.textAlign = egret.HorizontalAlign.RIGHT;
            share.x = _this.width / 12;
            share.y = _this.height * 3 / 4 - 20;
            share.touchEnabled = true;
            share.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                // 分享
                // 分享成功后回调
                // 监听舞台
                // 移除失败界面
                // 进度条归0，计时器开启计时器开启
                // 正确的元素闪两下
                platform.shareAppMessage()
                    .then(function () {
                    _this.stage.addEventListener(egret.TouchEvent.TOUCH_TAP, _this.judgeBtn, _this);
                    _this.removeChild(failBg);
                    _this.removeChild(share);
                    _this.removeChild(vs);
                    _this.removeChild(over);
                    _this.progressShp.scaleX = 1;
                    _this.scaleSize = 1;
                    _this.timer.start();
                    _this.circleArr[_this.circleArr.length - 1].failScale();
                }).catch(function () {
                    console.log('分享失败');
                });
            }, _this);
            _this.addChild(share);
        }, 1000);
    };
    return Game;
}(egret.DisplayObjectContainer));
__reflect(Game.prototype, "Game");
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var LoadingUI = (function (_super) {
    __extends(LoadingUI, _super);
    function LoadingUI() {
        var _this = _super.call(this) || this;
        _this.createView();
        return _this;
    }
    LoadingUI.prototype.createView = function () {
        this.textField = new egret.TextField();
        this.addChild(this.textField);
        this.textField.y = 300;
        this.textField.width = 480;
        this.textField.height = 100;
        this.textField.textAlign = "center";
    };
    LoadingUI.prototype.onProgress = function (current, total) {
        this.textField.text = "Loading..." + current + "/" + total;
    };
    return LoadingUI;
}(egret.Sprite));
__reflect(LoadingUI.prototype, "LoadingUI", ["RES.PromiseTaskReporter"]);
var Main = (function (_super) {
    __extends(Main, _super);
    function Main() {
        var _this = _super.call(this) || this;
        _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onAddToStage, _this);
        platform.openDataContext.postMessage({
            command: 'loadRes'
        });
        return _this;
    }
    Main.prototype.onAddToStage = function (event) {
        egret.lifecycle.addLifecycleListener(function (context) {
            // custom lifecycle plugin
            context.onUpdate = function () {
            };
        });
        egret.lifecycle.onPause = function () {
            egret.ticker.pause();
        };
        egret.lifecycle.onResume = function () {
            egret.ticker.resume();
        };
        this.runGame().catch(function (e) {
            console.log(e);
        });
    };
    Main.prototype.runGame = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.loadResource()];
                    case 1:
                        _a.sent();
                        this.createGameScene();
                        return [4 /*yield*/, platform.login().then(function (res) {
                                egret.localStorage.setItem('openId', res);
                            })];
                    case 2:
                        _a.sent();
                        // await platform.getUserInfo();
                        // console.log(userinfo)
                        // const result = await RES.getResAsync("description_json")
                        return [4 /*yield*/, platform.showShareMenu()];
                    case 3:
                        // await platform.getUserInfo();
                        // console.log(userinfo)
                        // const result = await RES.getResAsync("description_json")
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Main.prototype.loadResource = function () {
        return __awaiter(this, void 0, void 0, function () {
            var loadingView, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        loadingView = new LoadingUI();
                        this.stage.addChild(loadingView);
                        return [4 /*yield*/, RES.loadConfig("resource/default.res.json", "resource/")];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, RES.loadGroup("preload", 0, loadingView)];
                    case 2:
                        _a.sent();
                        this.stage.removeChild(loadingView);
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _a.sent();
                        console.error(e_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 创建游戏场景
     * Create a game scene
     *
     * 1. 记录屏幕中所有的圆
     */
    Main.prototype.createGameScene = function () {
        this.addChild(new Begin(this.stage.stageWidth, this.stage.stageHeight, false));
        // this.addChild(new Game(this.stage.stageWidth, this.stage.stageHeight))
    };
    return Main;
}(egret.DisplayObjectContainer));
__reflect(Main.prototype, "Main");
var DebugPlatform = (function () {
    function DebugPlatform() {
    }
    // async getUserInfo() {
    // return { nickName: "username" }
    // }
    DebugPlatform.prototype.login = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    };
    DebugPlatform.prototype.showShareMenu = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    };
    DebugPlatform.prototype.shareAppMessage = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    };
    DebugPlatform.prototype.setUserCloudStorage = function (score) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    };
    return DebugPlatform;
}());
__reflect(DebugPlatform.prototype, "DebugPlatform", ["Platform"]);
if (!window.platform) {
    window.platform = new DebugPlatform();
}
;window.Main = Main;