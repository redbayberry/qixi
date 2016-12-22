function Swipe(container){
		var element = container.find(":first");//":first"获取第一个子元素
		var swipe = {};
		var sliders = element.find(">");
		var width =container.width();
		var height = container.height();
		//设置li页面的总宽度
		element.css({
			width:sliders.length*width+"px",
			height:height+"px"
		});
		//设置每一个页面li的宽度
		$.each(sliders,function(index,slider){
			$(slider).css({
				width:width,
				height:height
			});
		});
		swipe.scrollTo = function(x,speed){
			element.animate({right:x},speed);
			return this;
		};
		return swipe;
	}
	