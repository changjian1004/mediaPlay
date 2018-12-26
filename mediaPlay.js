(function($){
    $.fn.extend({
        // 媒体播放
        mediaPlay: function(options){
            // 将调用时候传过来的参数和default参数合并
            options = $.extend({}, $.fn.defaults, options || {})
            var self = this,    // 当前调用元素
                method = {},    // 方法
                second, // 总秒数
                playTime,   // 循环播放方法
                tTime = 0,  // 初始化当前秒数
                plan = self.find('.planMap'),   // 进度条容器
                self_x = plan.offset().left,    // 进度条容器距离左侧坐标
                state = self.find('.state'),    // 进度条
                startTime = self.find('.startTime'),    // 播放时间
                mapW = plan.width(),    // 进度条容器宽度
                myVideo = document.getElementById(options.myVideo)  // 获取video Id

            // 预加载视频后执行
            $(myVideo).on('canplay', function(){
                second = this.duration
                self.find('.endTime').text(method.convertTime(second))
            })

            // 点击播放时执行
            self.on('click', '.play', function(){
                if(myVideo.paused){
                    if(tTime >= mapW){
                        tTime = 0
                        state.width(tTime)
                    }
					myVideo.play()
					method.monitorPlan()
				}
            })

            // 点击停止时执行
            self.on('click', '.pause', function(){
				myVideo.pause()
				clearInterval(playTime)
            })

            // 鼠标按下时执行
            plan.mousedown(function(e){
                method.mediaDown(e)
                // 鼠标拖动时执行
                $(document).mousemove(function(e){
                    $(document).unbind('mousedown')
                    method.mediaMove(e)
                })
                // 鼠标抬起时执行
                $(document).mouseup(function(){
                    $(document).unbind('mousemove')
                    $(document).unbind('mouseup')
                    method.mediaUp()
                })
            })

            // 监听媒体播放进度
            method.monitorPlan = function(){
                playTime = setInterval(function(){
                    startTime.text(method.convertTime(myVideo.currentTime))
                    tTime += mapW/(second * 1000 / 60)
                    state.width(tTime)
                    if(tTime >= mapW){
                        clearInterval(playTime)
                        state.width(mapW)
                    }
                },60)
            }

            // 鼠标按下事件
            method.mediaDown = function(event){
                myVideo.pause()
                clearInterval(playTime)
                var downX = parseInt(event.clientX)
                tTime = downX - self_x
                state.width(tTime)
                startTime.text(method.convertTime(second/mapW*tTime))
                myVideo.currentTime = second/mapW*tTime
            }

            // 鼠标拖动事件
            method.mediaMove = function(event){
                var downX = parseInt(event.clientX)
                tTime = downX - self_x
                if(tTime < 0){
                    state.width(0)
                    tTime = 0
                    startTime.text(method.convertTime(0))
                }else if(tTime >= mapW){
                    state.width(mapW)
                    tTime = mapW
                    startTime.text(method.convertTime(second))
                }else{
                    state.width(tTime)
                    startTime.text(method.convertTime(second/mapW*tTime))
                }
                myVideo.currentTime = second/mapW*tTime
            }

            // 鼠标抬起事件
            method.mediaUp = function(){
                if(tTime != mapW){
                    myVideo.play()
                    method.monitorPlan()
                }
            }

            // 秒数转换时间格式
            method.convertTime = function(second){
                var hh, mm, ss
                hh = parseInt(second / 3600)
                mm = parseInt(second / 60) % 60
                ss = parseInt(second % 60)
                if(hh < 10){hh = '0' + hh}
                if(mm < 10){mm = '0' + mm}
                if(ss < 10){ss = '0' + ss}
                return hh+':'+mm+':'+ss
            }
        },
        // 线形可视化图
        linearMap: function(options){
            options = $.extend({}, $.fn.defaults, options || {})
            window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext;
            var context = new AudioContext;
            //从元素创建媒体节点 , 这里传入的是video的标签ID
            var myvideo = document.getElementById(options.myVideo);
            var media = context.createMediaElementSource(myvideo);
            //创建脚本处理节点
            var processor = context.createScriptProcessor(4096, 1, 1);
            //Canvas初始化
            var mycanvas = document.getElementById(options.canvas);
            var width = mycanvas.width, height = mycanvas.height;
            var cxt = mycanvas.getContext("2d");
            
            cxt.translate(0.5, height / 2 + 0.5);
            //连接：媒体节点→控制节点→输出源
            media.connect(processor);
            processor.connect(context.destination);
            //控制节点的过程处理
            processor.onaudioprocess = function(e) {
                //获取输入和输出的数据缓冲区
                var input = e.inputBuffer.getChannelData(0);
                var output = e.outputBuffer.getChannelData(0);
                //将输入数缓冲复制到输出缓冲上
                for ( var i = 0; i < input.length; i++)
                    output[i] = input[i];
                //将缓冲区的数据绘制到Canvas上
                cxt.clearRect(-0.5, -height / 2 - 0.5, width, height);//清空
                cxt.beginPath();//开始
                let before  = width / 2;
                let after = before;
                let swing = 1.2;
                let step = 10 / before;
                let bx = width/2;
                let by = 0;
                let ax = width/2;
                let ay = height/2;
                let start = 1;
                for ( var i = 0; i < width; i++){
                    if (i % 2 == 0) {
                        continue;
                    }
                    let coor =  height / swing * output[output.length * i / width | 0];
                    cxt.lineWidth = 1;//线条的宽度
                    cxt.strokeStyle = getRandomColor();//线条的颜色
                    //前半部分
                    if (start == 1){
                        cxt.moveTo(before,0);
                        start=2;
                    }else{
                        cxt.moveTo(bx,by);
                    }
                    cxt.lineTo(before, coor);
                    bx = before;
                    by = coor;
                    
                    //后半部分
                    //前半部分
                    if (start == 2){
                        cxt.moveTo(after,0);
                        start=3;
                    }else{
                        cxt.moveTo(ax,ay);
                    }
                    cxt.lineTo(after, coor);
                    ax = after;
                    ay = coor;
                    
                    swing = swing + step;
                    before--;
                    after++;
                }
                cxt.stroke();
            };
            
            function getRandomColor(){
                return options.color[Math.floor(Math.random()*options.color.length)];
            }
        },
        // 柱形可视化图
        pillarMap: function(options){
            options = $.extend({}, $.fn.defaults, options || {})
            window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext;
            var audio = document.getElementById(options.myVideo);
            var ctx = new AudioContext();
            var analyser = ctx.createAnalyser();
            var audioSrc = ctx.createMediaElementSource(audio);
            // we have to connect the MediaElementSource with the analyser 
            audioSrc.connect(analyser);
            analyser.connect(ctx.destination);
            // we could configure the analyser: e.g. analyser.fftSize (for further infos read the spec)
            // analyser.fftSize = 64;
            // frequencyBinCount tells you how many values you'll receive from the analyser
            var frequencyData = new Uint8Array(analyser.frequencyBinCount);

            // we're ready to receive some data!
            var canvas = document.getElementById(options.canvas),
                cwidth = canvas.width,
                cheight = canvas.height + 2,
                meterWidth = options.pillarWidth, //width of the meters in the spectrum
                gap = options.pillarGap, //gap between meters
                capHeight = 2,
                capStyle = '#fff',
                meterNum = cwidth / (meterWidth + gap), //count of the meters
                capYPositionArray = []; ////store the vertical position of hte caps for the preivous frame
            ctx = canvas.getContext('2d'),
            gradient = ctx.createLinearGradient(0, 0, 0, cheight);
            $.each(options.color, function(index, item){
                var ratio = 1/(options.color.length-1)
                gradient.addColorStop(ratio*index, item);
            })
            // loop
            function renderFrame() {
                var array = new Uint8Array(analyser.frequencyBinCount);
                analyser.getByteFrequencyData(array);
                var step = Math.round(array.length / meterNum); //sample limited data from the total array
                ctx.clearRect(0, 0, cwidth, cheight);
                for (var i = 0; i < meterNum; i++) {
                    var value = array[i * step];
                    if (capYPositionArray.length < Math.round(meterNum)) {
                        capYPositionArray.push(value);
                    };
                    ctx.fillStyle = capStyle;
                    //draw the cap, with transition effect
                    if (value < capYPositionArray[i]) {
                        ctx.fillRect(i * (meterWidth + gap), cheight - (--capYPositionArray[i]), meterWidth, capHeight);
                    } else {
                        ctx.fillRect(i * (meterWidth + gap), cheight - value, meterWidth, capHeight);
                        capYPositionArray[i] = value;
                    };
                    ctx.fillStyle = gradient; //set the filllStyle to gradient for a better look
                    ctx.fillRect(i * (meterWidth + gap) /*meterWidth+gap*/ , cheight - value + capHeight, meterWidth, cheight); //the meter
                }
                requestAnimationFrame(renderFrame);
            }
            renderFrame();
        }
    })
    // 初始化参数
    $.fn.defaults = {
        'myVideo' : 'myVideo',
        'canvas' : 'canvas',
        'color' : ['#f00','#ff0','#0f0'],
        'pillarWidth' : 10,
        'pillarGap' : 2
    }
})(jQuery)