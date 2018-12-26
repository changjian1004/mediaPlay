# 播放进度条及音频可视化
+ 详细说明文档
    > http://note.youdao.com/noteshare?id=f95ed27aacfa9c15dc86a2387487b16a&sub=050B82F256DB4B02B129E1D43AEFDD38
+ 配置参数
    - 播放器参数
    
    | 参数    | 类型   | 默认值  | 说明                |
    | ------- | ------ | ------- | ------------------- |
    | myVideo | String | myVideo | video/audio标签Id名 |
    
    - 曲线可视图参数
    
    | 参数    | 类型   | 默认值                 | 说明                |
    | ------- | ------ | ---------------------- | ------------------- |
    | myVideo | String | myVideo                | video/audio标签Id名 |
    | canvas  | String | canvas                 | canvas标签Id名      |
    | color   | Array  | ['#f00','#ff0','#0f0'] | 颜色随机切换        |

    - 柱状可视图参数
    
    | 参数        | 类型   | 默认值                 | 说明                |
    | ----------- | ------ | ---------------------- | ------------------- |
    | myVideo     | String | myVideo                | video/audio标签Id名 |
    | canvas      | String | canvas                 | canvas标签Id名      |
    | color       | Array  | ['#f00','#ff0','#0f0'] | 渐变色显示          |
    | pillarWidth | Number | 10                     | 柱状宽度            |
    | pillarGap   | Number | 2                      | 柱状间隔            |
