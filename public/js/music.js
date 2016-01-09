/**
 * Created by lee on 2015/12/21.
 */
(function(){

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
    var size = 128;
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

