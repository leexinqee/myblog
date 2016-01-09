/**
 * Created by lee on 2015/12/18.
 */
(function($){
    $(function(){

        // 清空
        setTimeout(function(){
            $("#left-content").removeClass("fadeInRight")
        }, 800);

        // 点击播放时的效果
        $("#player-audio").on("click", function(){
            var $icon = $(this).find(".iconfont");
            var $pcontent = $(this).parents(".left-content");
            // 播放状态
            if($icon.hasClass("icon-iconfontbofang1")){
                $icon.removeClass("icon-iconfontbofang1").addClass("icon-iconfontzanting1");
                $pcontent.addClass("playmovedown");
                setTimeout(function(){
                    $pcontent.removeClass("playmovedown").css("top", "50%");
                }, 1000)
            } else {
                $icon.removeClass("icon-iconfontzanting1").addClass("icon-iconfontbofang1");
                $pcontent.addClass("playmoveup");
                setTimeout(function(){
                    $pcontent.removeClass("playmoveup").css("top", "5%");
                }, 1000)
            }
        })









    })
}(jQuery));