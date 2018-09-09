class Main extends egret.DisplayObjectContainer {

    public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
        platform.openDataContext.postMessage({
            command: 'loadRes'
        })
    }

    private onAddToStage(event: egret.Event) {

        egret.lifecycle.addLifecycleListener((context) => {
            // custom lifecycle plugin

            context.onUpdate = () => {

            }
        })

        egret.lifecycle.onPause = () => {
            egret.ticker.pause();
        }

        egret.lifecycle.onResume = () => {
            egret.ticker.resume();
        }

        this.runGame().catch(e => {
            console.log(e);
        })



    }

    private async runGame() {
        await this.loadResource()
        this.createGameScene();
        await platform.login().then((res) => {
            egret.localStorage.setItem('openId', res)
        });

        // await platform.getUserInfo();
            // console.log(userinfo)
        // const result = await RES.getResAsync("description_json")
        await platform.showShareMenu()
    }

    private async loadResource() {
        try {
            const loadingView = new LoadingUI();
            this.stage.addChild(loadingView);
            await RES.loadConfig("resource/default.res.json", "resource/");
            await RES.loadGroup("preload", 0, loadingView);
            this.stage.removeChild(loadingView);
        }
        catch (e) {
            console.error(e);
        }
    }

    /**
     * 创建游戏场景
     * Create a game scene
     * 
     * 1. 记录屏幕中所有的圆
     */
  

    private createGameScene() {
        this.addChild(new Begin(this.stage.stageWidth, this.stage.stageHeight, false))
        
        // this.addChild(new Game(this.stage.stageWidth, this.stage.stageHeight))
    }
}