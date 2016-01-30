/**
 * Created by lee on 2015/12/21.
 */
(function(window){

// ��ȡaudioContext����
    var ac = null;
    window.AudioContext = window.AudioContext ||
        window.webkitAudioContext ||
        window.mozAudioContext ||
        window.msAudioContext;
    try{
        ac = new window.AudioContext();
    } catch (e) {
        throw new Error("����������֧��audiocontext����")
    }
// ����������С������һ��gainNode����
    var gainNode = ac[ac.createGain ? "createGain" : "createGainNode"]();
    gainNode.connect(ac.destination);

    var analyser = ac.createAnalyser();
    var size = 84;
    analyser.fftsize = size * 2;
    analyser.connect(gainNode);

// ������
    var count = 0;
    var source = null;

// ��������
    function loadsound(url){
        // ��ֹ�ظ�����
        var n = ++count;
        var request = new XMLHttpRequest();
        // ��ֹ�Ѿ����ڵĸ���
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
            // �Լ��غ�����ݽ��н��룬���� �������룺decodeAudioData(xhr.response, success funciton, fail function);
            ac.decodeAudioData(request.response, function (buffer){
                if(n != count){
                    return;
                }
                var bs = ac.createBufferSource();
                bs.buffer = buffer;
                bs.connect(analyser);
                bs[bs.start ? "start" : "noteOn"](0);

                // ����bufferԴ
                source = bs;

            } , function (err){
                console.log(err);
            })
        }
        request.send(null);
    }

// �˴�ִ�з��ʵ��Ķ�����������
    virsualizar();
// ���⻯����
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
        // ѭ������
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

// canvas��ͼ
    var capArr = [];
    initCap();
    function initCap(){
        for(var i = 0; i < size; i++){
            capArr[i] = 0;
        }
    }

    function clearDraw(){
        ctx.clearRect(0,0,width,height);
    }

    function draw(arr){
        clearDraw();
        var w = width / size;
        var cw =  w * 0.7;
        var capH = cw * 0.5;
        var kong = 10;
        for(var i=0; i < size; i++){
            var h = arr[i] / 256 * height;
            capArr[i] = (h >= capArr[i]) ? h : (--capArr[i]);
            if(capArr[i] + kong > height){
                capArr[i] = height - kong;
                h = h - kong;
            }
            ctx.fillRect(w * i, height - h, cw , h);
            ctx.fillRect(w * i, height - capArr[i] - kong, cw , capH);
        }
    }

    function stop(){
        if(source){
            source[source.stop ? "stop" : "nodeOff"]();
        }
    }

    window.Audio = {
        loadSound : loadsound,
        stop : stop
    }

}(window));

