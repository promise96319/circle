/**
 * 微信开放数据域
 * 使用 Canvas2DAPI 在 SharedCanvas 渲染一个排行榜，
 * 并在主域中渲染此 SharedCanvas
 */

/**
 * 资源加载组，将所需资源地址以及引用名进行注册
 * 之后可通过assets.引用名方式进行获取
 */
const assetsUrl = {
  icon: "openDataContext/assets/icon.png",
  box: "openDataContext/assets/box.png",
  panel: "openDataContext/assets/panel.png",
  button: "openDataContext/assets/button.png",
  title: "openDataContext/assets/rankingtitle.png",
  jin: 'openDataContext/assets/jin.png',
  yin: 'openDataContext/assets/yin.png',
  tong: 'openDataContext/assets/tong.png'
};

/**
 * 资源加载组，将所需资源地址以及引用名进行注册
 * 之后可通过assets.引用名方式进行获取
 */
let assets = {};
/**
 * canvas 大小
 * 这里暂时写死
 * 需要从主域传入
 */
let canvasWidth;
let canvasHeight;



//获取canvas渲染上下文
const context = sharedCanvas.getContext("2d");
context.globalCompositeOperation = "source-over";

let totalGroup = []
let bestThree = []

// 获取用户的数据及排名
function getUsers() {
  return new Promise((resolve, reject) => {
    wx.getFriendCloudStorage({
    keyList: ['maxScore'],
    success: (res) => {
       totalGroup = res.data.sort(compareScore)
       resolve()
      },
      fail: (err) => {
        console.log(err) 
        reject()
      }
    })
  })
}

// 画分最高的三个用户
function drawBestUser () {
  let stageWidth = sharedCanvas.width
  let stageHeight = sharedCanvas.height
  let width = sharedCanvas.width / 24
  let height = sharedCanvas.height / 24

  // 游戏结束

  // 分数

  // 排行榜
  if (bestThree[1]) {
      context_drawImage(assets.yin, 0.5 * width, height, 3 * width, 6 * height)
    drawNetAvatar(bestThree[1]).then((res) => {
      context_drawImage(res, 0, 10 * height, 4 * width,  8 * height) 
      // context.fillStyle = "#E6E8FA";
      context.fillStyle = "#999999";
      context.font = 3 * height + "px '微软雅黑'";
      context.fillText(bestThree[1].KVDataList[0].value, 0, 23 * height,  4 * width) 
    })
  }

   if (bestThree[0]) {
    // context.fillStyle = "red";
    // context.font = 5 * height + "px '微软雅黑'";
    // context.textAlign = "left";
    // context.fillText('第1名', 9 * width, 5 * height, 6 * width) 
      context_drawImage(assets.jin, 10 * width, 0, 4 * width, 6 * height)
      drawNetAvatar(bestThree[0]).then((res) => {
      context_drawImage(res, 9.5 * width, 9 * height, 5 * width,  10 * height) 
      // context.fillStyle = "#D9D919";
      context.fillStyle = "#00ff00";
      context.font = 4 * height + "px '微软雅黑'";
      context.fillText(bestThree[0].KVDataList[0].value, 10 * width, 24 * height,  4 * width) 
    })
  }

  if (bestThree[2]) {
      context_drawImage(assets.tong, 20.5 * width, height, 3 * width, 5 * height)
    drawNetAvatar(bestThree[2]).then((res) => {
      context_drawImage(res, 20 * width, 10 * height, 4 * width,  8 * height) 
      context.fillStyle = "#B5A642";
      context.font = 3 * height + "px '微软雅黑'";
      context.fillText(bestThree[2].KVDataList[0].value, 20 * width, 23 * height,  4 * width) 
    })
  }

  // 查看所有排名

  // 点击继续开始

  // 点击分享游戏
}

// 对用户的排名进行排序
function compareScore (obj1, obj2) {
  return Number(obj2.KVDataList[0].value) -  Number(obj1.KVDataList[0].value)
}

/**
 * 所有头像数据
 * 包括姓名，头像图片，得分
 * 排位序号i会根据parge*perPageNum+i+1进行计算
 */
// const totalGroup = [{
//     key: 1,
//     name: "1111111111",
//     url: assets.icon,
//     scroes: 10000
//   }
// ];

/**
 * 创建排行榜
 */
function drawRankPanel() {
  // 
  //绘制背景
  context_drawImage(assets.panel, offsetX_rankToBorder, offsetY_rankToBorder, rankWidth, rankHeight);
  //绘制标题
  const title = assets.title;
  //根据title的宽高计算一下位置;
  const titleX = offsetX_rankToBorder + (rankWidth - title.width) / 2;
  const titleY = offsetY_rankToBorder + title.height + 40;
  context_drawImage(title, titleX, titleY);
  //获取当前要渲染的数据组

  //起始id
  const startID = perPageMaxNum * page;
  currentGroup = totalGroup.slice(startID, startID + perPageMaxNum);
  //创建头像Bar
  drawRankByGroup(currentGroup);
  //创建按钮
  drawButton()
}
/**
 * 根据屏幕大小初始化所有绘制数据
 */
function init() {
  //排行榜绘制数据初始化,可以在此处进行修改
  rankWidth = stageWidth * 4 / 5;
  rankHeight = stageHeight * 4 / 5;
  barWidth = rankWidth * 4 / 5;
  // rankWidth = stageWidth
  // rankHeight = stageHeight
  // barWidth = rankWidth
  barHeight = rankWidth / perPageMaxNum;
  offsetX_rankToBorder = (stageWidth - rankWidth) / 2;
  offsetY_rankToBorder = (stageHeight - rankHeight) / 2;
  preOffsetY = (rankHeight - barHeight) / (perPageMaxNum + 1);
  fontSize = Math.floor(stageWidth / 25);
  startX = offsetX_rankToBorder + (rankWidth - barWidth) / 2;
  startY = offsetY_rankToBorder + preOffsetY;
  avatarSize = barHeight - 10;
  intervalX = barWidth / 20;
  textOffsetY = (barHeight + fontSize) / 2;
  textMaxSize = barWidth / 3;
  
  //按钮绘制数据初始化
  buttonWidth = barWidth / 3;
  buttonHeight = barHeight / 2;
  buttonOffset = rankWidth / 3;
  lastButtonX = offsetX_rankToBorder + buttonOffset - buttonWidth;
  nextButtonX = offsetX_rankToBorder + 2 * buttonOffset;
  nextButtonY = lastButtonY = offsetY_rankToBorder + rankHeight - 50 - buttonHeight;
  let data = wx.getSystemInfoSync();
  canvasWidth = data.windowWidth;
  canvasHeight = data.windowHeight;
}

/**
 * 创建两个点击按钮
 */
function drawButton() {
  context_drawImage(assets.button, nextButtonX, nextButtonY, buttonWidth, buttonHeight);
  
  context_drawImage(assets.button, lastButtonX, lastButtonY, buttonWidth, buttonHeight);

      context.fillStyle = "#fff";
      context.font = buttonHeight * 2 / 3 + "px '微软雅黑'";
      context.fillText('上一页', lastButtonX + buttonWidth / 6, lastButtonY + buttonHeight * 3 / 4, buttonWidth * 2 / 3) 
      context.fillText('下一页', nextButtonX + buttonWidth / 6, nextButtonY + buttonHeight * 3 / 4, buttonWidth * 2 / 3) 
}


/**
 * 根据当前绘制组绘制排行榜
 */
function drawRankByGroup(currentGroup) {
  for (let i = 0; i < currentGroup.length; i++) {
    const data = currentGroup[i];
    drawByData(data, i);
  }
}

/**
 * 根据绘制信息以及当前i绘制元素
 */
let indexWidth = context.measureText("99").width;

function drawByData(data, i) {
  let x = startX;
  //绘制底框
  context_drawImage(assets.box, startX, startY + i * preOffsetY, barWidth, barHeight);
  x += 10;
  //设置字体
  context.fillStyle = '#ffffff'
  context.font = fontSize + "px Arial";
  //绘制序号
  context.fillText( 7 * page + i + 1 + "", x, startY + i * preOffsetY + textOffsetY, textMaxSize);
  x += indexWidth + intervalX;
  //绘制头像 === 确保新增头像加载完后再绘制
  drawNetAvatar(data).then((res) => {
       context_drawImage(res, x, startY + i * preOffsetY + (barHeight - avatarSize) / 2, avatarSize, avatarSize);
       x += avatarSize + intervalX;
        //绘制名称
       context.fillText(data.nickname + "", x, startY + i * preOffsetY + textOffsetY, textMaxSize);
       x += textMaxSize + intervalX;
        //绘制分数
       context.fillText(data.KVDataList[0].value + "", x, startY + i * preOffsetY + textOffsetY, textMaxSize);
  })

}


function drawNetAvatar (data) {
    return new Promise((resolve, reject) => {
          if (data.isLoaded) {
          resolve(data.loadAvatar)
         } else {
           let img = wx.createImage()
          img.onload = function () {
            data.loadAvatar = img
            data.isLoaded = true
            resolve(img)
          }
          img.src = data.avatarUrl
         }
    })
}

/**
 * 点击处理
 */
function onTouchEnd(event) {
  let x = event.clientX * sharedCanvas.width / canvasWidth;
  let y = event.clientY * sharedCanvas.height / canvasHeight;
  if (x > lastButtonX && x < lastButtonX + buttonWidth &&
    y > lastButtonY && y < lastButtonY + buttonHeight) {
    //在last按钮的范围内
    if (page > 0) {
      buttonClick(0);
    }
  }
  if (x > nextButtonX && x < nextButtonX + buttonWidth &&
    y > nextButtonY && y < nextButtonY + buttonHeight) {
    //在next按钮的范围内
    if ((page + 1) * perPageMaxNum < totalGroup.length) {
      buttonClick(1);
    }
  }
}
/**
 * 根据传入的buttonKey 执行点击处理
 * 0 为上一页按钮
 * 1 为下一页按钮
 */
function buttonClick(buttonKey) {
  let old_buttonY;
  if (buttonKey == 0) {
    //上一页按钮
    old_buttonY = lastButtonY;
    lastButtonY += 10;
    page--;
    renderDirty = true;
    console.log('上一页' + page);
    setTimeout(() => {
      lastButtonY = old_buttonY;
      //重新渲染必须标脏
      renderDirty = true;
    }, 100);
  } else if (buttonKey == 1) {
    //下一页按钮
    old_buttonY = nextButtonY;
    nextButtonY += 10;
    page++;
    renderDirty = true;
    console.log('下一页' + page);
    setTimeout(() => {
      nextButtonY = old_buttonY;
      //重新渲染必须标脏
      renderDirty = true;
    }, 100);
  }

}

/////////////////////////////////////////////////////////////////// 相关缓存数据

///////////////////////////////////数据相关/////////////////////////////////////

/**
 * 渲染标脏量
 * 会在被标脏（true）后重新渲染
 */
let renderDirty = true;

/**
 * 当前绘制组
 */
let currentGroup = [];
/**
 * 每页最多显示个数
 */
let perPageMaxNum = 5;
/**
 * 当前页数,默认0为第一页
 */
let page = 0;
///////////////////////////////////绘制相关///////////////////////////////
/**
 * 舞台大小
 */
let stageWidth;
let stageHeight;
/**
 * 排行榜大小
 */
let rankWidth;
let rankHeight;

/**
 * 每个头像条目的大小
 */
let barWidth;
let barHeight;
/**
 * 条目与排行榜边界的水平距离
 */
let offsetX_barToRank
/**
 * 绘制排行榜起始点X
 */
let startX;
/**
 * 绘制排行榜起始点Y
 */
let startY;
/**
 * 每行Y轴间隔offsetY
 */
let preOffsetY;
/**
 * 按钮大小
 */
let buttonWidth;
let buttonHeight;
/**
 * 上一页按钮X坐标
 */
let lastButtonX;
/**
 * 下一页按钮x坐标
 */
let nextButtonX;
/**
 * 上一页按钮y坐标
 */
let lastButtonY;
/**
 * 下一页按钮y坐标
 */
let nextButtonY;
/**
 * 两个按钮的间距
 */
let buttonOffset;

/**
 * 字体大小
 */
let fontSize;
/**
 * 文本文字Y轴偏移量
 * 可以使文本相对于图片大小居中
 */
let textOffsetY;
/**
 * 头像大小
 */
let avatarSize;
/**
 * 名字文本最大宽度，名称会根据
 */
let textMaxSize;
/**
 * 绘制元素之间的间隔量
 */
let intervalX;
/**
 * 排行榜与舞台边界的水平距离
 */
let offsetX_rankToBorder;
/**
 * 排行榜与舞台边界的竖直距离
 */
let offsetY_rankToBorder;
/**
 * 绘制排名的最大宽度
 */
// let indexWidth;

//////////////////////////////////////////////////////////
/**
 * 监听点击
 */
wx.onTouchEnd((event) => {
  const l = event.changedTouches.length;
  for (let i = 0; i < l; i++) {
    onTouchEnd(event.changedTouches[i]);
  }
});


/**
 * 是否加载过资源的标记量
 */
let hasLoadRes;

/**
 * 资源加载
 */
// 加载必须的资源
function preloadedStatic() {
  let preloaded = 0;
  let count = 0;
  for (let asset in assetsUrl) {
    count++;
    const img = wx.createImage();
    img.onload = () => {
      preloaded++;
      if (preloaded == count) {
        // console.log("加载完成");
        hasLoadRes = true;
      }
    }
    img.src = assetsUrl[asset];
    assets[asset] = img;
  }
}

let loadAvatar = false

// 加载用户的头像，并将加载完的图片缓存，做加载完的标记
function preloadAssets() {
  let preloaded = 0;
  let count = 0;
  totalGroup.forEach((user) => {
     count++;
    if (!user.isLoaded) {
    const img = wx.createImage();
    img.onload = () => {
      preloaded++;
      if (preloaded == count) {
        console.log("加载完成");
        loadAvatar = true
      }
    }
    img.src = user.avatarUrl;
    user.loadAvatar = img;
    user.isLoaded = true
    }
  })
}


/**
 * 绘制屏幕
 * 这个函数会在加载完所有资源之后被调用
 */
function createScene() {
  if (sharedCanvas.width && sharedCanvas.height) {
    // console.log('初始化完成')
    stageWidth = sharedCanvas.width;
    stageHeight = sharedCanvas.height;
    init();
    return true;
  } else {
    console.log('创建开放数据域失败，请检查是否加载开放数据域资源');
    return false;
  }
}


//记录requestAnimationFrame的ID
let requestAnimationFrameID;
let hasCreateScene;
// 判断当前屏幕是三个头像的排名还是总排名
let currentScene
// 判断用户的数据是否更新了
// let isUpdate = false

/**
 * 增加来自主域的监听函数
 */
function addOpenDataContextListener() {
  wx.onMessage((data) => {
    // console.log(data);

    // 当首页用户查看排行榜的时候
    // 首先需要确保用户的数据存在
    // 然后开始绘制屏幕
    // if (data.command == 'open') {
    //     //  如果当前屏幕不为排行榜才重新绘制
    //     // if (currentScene != 'rank') {
    //         context.clearRect(0, 0, sharedCanvas.width, sharedCanvas.height);
    //         createScene()
    //         // currentScene = 'rank'
    //       //  requestAnimationFrameID = requestAnimationFrame(loop)
    //     // } else {
    //        requestAnimationFrameID = requestAnimationFrame(loop)
    //     // }
    // } 
    
    // 当发送关闭命令的时候，清除cavans内的内容
    // else if (data.command == 'close' && requestAnimationFrameID) {
      // cancelAnimationFrame(requestAnimationFrameID);
      // requestAnimationFrameID = null
         // context.clearRect(0, 0, sharedCanvas.width, sharedCanvas.height);
      // renderDirty = true
    // } 
    
    // 当命令为更新最大分数的时候
    // 获取当前所有用户的值
    // 找到改用户对应的数据
    // 比较该用户最新分数与最大分数的大小
    // 如果比最高分小，则不保存
    // 如果比最高分大，则将数据保存到云端

    if (data.command == 'updateMaxScore') {
      // console.log('更新最大的数据')
      wx.getFriendCloudStorage({
        keyList: ['maxScore'],
        success: res => {
          // console.log('得到的朋友数据', res)
          // 找到对应的用户
          let currentUser = res.data.find((item) => {
            return item.openid == data.openId
          })
          // console.log('当前用户', currentUser)
      
          // 比较用户的score和maxScore
          // 保存比较大的score
          // console.log(currentUser.KVDataList)
          if (!currentUser || Number(currentUser.KVDataList[0].value) < Number(data.score) ) {
            // console.log('分数被超越了')
            // console.log(data)
            wx.setUserCloudStorage({
              KVDataList: [{key: 'maxScore', value: data.score.toString()}],
              success: () => {
                // console.log('保存成功')
                // 保存成功后立马更新数据,并且加载用户的图片
                  getUsers().then(() => {
                      // isUpdate = true
                     // 判断当前canvas是否为三的界面，如果不是，立马清除界面，重新绘制
                     //  if (currentScene != 'three') {
                           cancelAnimationFrame(requestAnimationFrameID);
                           requestAnimationFrameID = null
                           context.clearRect(0, 0, sharedCanvas.width, sharedCanvas.height);
                           bestThree = totalGroup.slice(0, 3)
                          // 画前三名排行榜
                           drawBestUser()
                          //  currentScene = 'three'
                           currentScene = true
                      // }
                      // 画前三名排行榜
                      // drawBestThree()
                  })
              },
              fail: () => {
                console.log('保存失败')
              }
            })
          }
          // 如果用户存在且当前屏幕不为three
           else {
      // console.log('没更新的时候，是否已经存在了排行榜')
               if (!currentScene) {
                           cancelAnimationFrame(requestAnimationFrameID);
                           requestAnimationFrameID = null
                           context.clearRect(0, 0, sharedCanvas.width, sharedCanvas.height);
                           bestThree = totalGroup.slice(0, 3)
                           drawBestUser()
                           currentScene = 'three'
                }
          }
        }
      })
    } 
    
       /**
       * 加载资源函数
       * 只需要加载一次
       * 1. 当页面刚进入的时候，先加载必要的资源，
       * 2. 获取这个时候的用户的排名, 根据用户的数据来预加载用户的图像资源，
       * 3. 将加载的用户头像资源做标记
       */
    else if (data.command == 'loadRes' && !hasLoadRes) {
      preloadedStatic()
      getUsers().then(() => {
        preloadAssets()
      })
    }

    // 画 前三名 排行榜
    // else if (data.command == 'drawAvatar') {
    //   // 如果当前屏幕不是three的时候才重新绘制
    //    if (currentScene != 'three') {
    //       context.clearRect(0, 0, sharedCanvas.width, sharedCanvas.height);
    //       // console.log(totalGroup)
    //       bestThree = totalGroup.slice(0, 3)
    //       drawBestUser()
    //    }
    // }
  });
}

addOpenDataContextListener();

/**
 * 循环函数
 * 每帧判断一下是否需要渲染
 * 如果被标脏，则重新渲染
 */
function loop() {
  if (renderDirty) {
    // console.log(`stageWidth :${stageWidth}   stageHeight:${stageHeight}`)
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, sharedCanvas.width, sharedCanvas.height);
    drawRankPanel();
    renderDirty = false;
  }
  requestAnimationFrameID = requestAnimationFrame(loop);
}

/**
 * 图片绘制函数
 */
function context_drawImage(image, x, y, width, height) {
  if (image.width != 0 && image.height != 0 && context) {
    if (width && height) {
      context.drawImage(image, x, y, width, height);
    } else {
      context.drawImage(image, x, y);
    }
  }
}