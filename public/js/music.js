/**
 * Created by lee on 2015/12/21.
 */
(function(){

// 获取audioContext对象
    var ac = null;
    window.AudioContext = window.AudioContext ||
        window.webkitAudioContext ||
        window.mozAudioContext ||
        window.msAudioContext;
    try{
        ac = new window.AudioContext();
    } catch (e) {
        throw new Error("你的浏览器不支持audiocontext对象！")
    }
// 控制音量大小，创建一个gainNode对象
    var gainNode = ac[ac.createGain ? "createGain" : "createGainNode"]();
    gainNode.connect(ac.destination);

    var analyser = ac.createAnalyser();
    var size = 128;
    analyser.fftsize = size * 2;
    analyser.connect(gainNode);

// 计数器
    var count = 0;
    var source = null;

// 加载声音
    function loadsound(url){
        // 阻止重复加载
        var n = ++count;
        var request = new XMLHttpRequest();
        // 阻止已经存在的歌曲
        if(source){
            source[source.stop ? "stop" : "nodeOff"]();
        }

        request.abort();
        request.open("get", url);
        request.responseType = "arraybuffer";
        request.onload = function(){
            if(n != count){
                return;
            }
            // 对加载后的数据进行解码，播放 方法解码：decodeAudioData(xhr.response, success funciton, fail function);
            ac.decodeAudioData(request.response, function (buffer){
                if(n != count){
                    return;
                }
                var bs = ac.createBufferSource();
                bs.buffer = buffer;
                bs.connect(analyser);
                bs[bs.start ? "start" : "noteOn"](0);

                // 储存buffer源
                source = bs;

            } , function (err){
                console.log(err);
            })
        }
        request.send(null);
    }

// 此处执行访问到的动画分析函数
    virsualizar();
// 虚拟化函数
    function virsualizar(){
        var arr = new Uint8Array(analyser.frequencyBinCount);

        requestAnimationFrame = window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame;

        function virsual(){
            analyser.getByteFrequencyData(arr);
            draw(arr);
            requestAnimationFrame(virsual);
        }
        // 循环调用
        requestAnimationFrame(virsual);
    }

    var canvas = document.getElementById("canvas");
    var width = 1000,
        height = 370;
    canvas.width = width;
    canvas.height = height;
    var ctx = canvas.getContext("2d");
    var line = ctx.createLinearGradient(0, 0, 0 , height);
    line.addColorStop(0, "red");
    line.addColorStop(0.5, "yellow");
    line.addColorStop(1, "green");
    ctx.fillStyle = line;

// canvas画图
    function draw(arr){
        ctx.clearRect(0,0,width,height);
        var w = width / size;
        for(var i=0; i < size; i++){
            var h = arr[i] / 256 * height;
            ctx.fillRect(w * i, height - h, w * 0.6 , h);
        }
    }

    window.onload = function(){
        loadsound("music/if.mp3");
    };

})()

