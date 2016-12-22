var animationEnd = (function(){
	var explorer = navigator.userAgent;
	if(~explorer.indexOf('WebKit')){
		return 'webkitAnimationEnd';
	}else{
		return 'animationEnd';
	}
})();
	var container = $("#content");
	var swipe = Swipe(container);
	// 云朵太阳
	
    var visualWidth = container.width();
    var visualHeight = container.height();
    
	function scrollTo(time,proportionX){
		var defer = $.Deferred();
		var distX = container.width()*proportionX;
		swipe.scrollTo(distX,time);
		defer.resolve();
		return defer;
	}
	var boy = boyWalk();
	//用来临时调整页面
    // swipe.scrollTo(container.width()*2, 0);
	
	var bird = {
		ele:$('.bird'),
		fly:function(){
			this.ele.addClass('birdfly');
			this.ele.transition({
				right:container.width()
			},15000,'linear');
		}
	};
	var getValue = function(className){
		var $elem = $('' + className + '');
		//走路的路线坐标
		return {
			height:$elem.height(),
			top:$elem.position().top
		};
	};
	// 桥的Y轴
	var bridgeY = function(){
		var data = getValue('.c_background_middle');
		return data.top;
	}();
	var girl = {
		ele:$('.girl'),
		getHeight:function(){
			return this.ele.height();
		},
		rotate:function(){
			this.ele.addClass('girl-rotate');
		},
		setOffset:function(){
			this.ele.css({
				left:visualWidth/2,
				top:bridgeY - this.getHeight()
			});			
		},
		getOffset:function(){
			return this.ele.offset();
		},
		getWidth:function(){
			return this.ele.width();
		}
	};
	girl.setOffset();
	// console.log(girl.ele.position().top);
	var logo = {
		ele:$('.logo'),
		run:function(){
			this.ele.addClass('logolightSpeedIn').on('animationEnd',function(){
				$(this).addClass('logoshake').off();
			});
		}
	};
function doorAction(left,right,time){
	var $door = $('.door');
	var doorLeft = $('.door_left');
	var doorRight = $('.door_right');
	var defer = $.Deferred();
	var count = 2;
	var complete = function(){
		if(count == 1){
			defer.resolve();
			return;
		}
		count--;
	};
	doorLeft.animate({'left':left},time,complete);
	doorRight.animate({'left':right},time,complete);
	return defer;
}
	//开门
var openDoor = function(){
	return doorAction('-50%','100%',2000);
};
//关门
 var shutDoor = function(){
	return doorAction('0','50%',2000);
 };
 // 灯
 var lamp = {
 	elem:$('.b_background'),
 	bright:function(){
 		this.elem.addClass('lamp_bright');
 	},
 	dark:function(){
 		this.elem.removeClass('lamp_bright');
 	}
 };
var instanceX;
function boyWalk(){
	var container = $("#content");
	var virtualWidth = container.width();
	var virtualHeight = container.height();
	// var swipe = Swipe(container);
	// 获取中间路的数据
	var getValue = function(className){
		var $elem = $('' + className + '');
		//走路的路线坐标
		return {
			height:$elem.height(),
			top:$elem.position().top
		};
	};
	// 路的y轴
	var pathY = function(){
		var data = getValue('.a_background_middle');
		return data.top+data.height/2;
	}();
	var $boy = $('#boy');
	var boyHeight = $boy.height();
	$boy.css({
		top:pathY-boyHeight+25
	});
	 

	 // $("button:first").click(function(){
	 // 	// swipe.scrollTo($(".content-wrap li:first").width()*2+'px',5000);
	 // 	$boy.removeClass('pauseWalk').addClass('slowWalk').animate({left:$("#content").width() + 'px'},10000,'linear');
	 // });
	 // $("button:last").click(function(){
	 // 	// var left = $boy.css('left');
	 // 	// $boy.css('left',left);
	 // 	//debugger
	 // 	$boy.addClass('pauseWalk').stop(true);
	 // });
	////////////////////////////////////////////////////////
	//===================动画处理============================ //
	////////////////////////////////////////////////////////
	// 恢复走路
	function restoreWalk(){
		$boy.removeClass('pauseWalk');
	}
	//暂停走路
	function pauseWalk(){
		$boy.addClass('pauseWalk');
	}
	// 动作变化.
	function slowWalk(){
		$boy.addClass('slowWalk');
	}
	// 计算移动距离
	function calculateDist(direction,proportion){
		return (direction == "x" ? virtualWidth:virtualHeight)*proportion;
	}
	// 做运动
	function startRun(options,runTime){
		var dfPlay = $.Deferred();
		restoreWalk();
		$boy.transition(
			options,
			runTime, 'linear',function() {
			/* stuff to do after animation is complete */
			dfPlay.resolve();
		});
		return dfPlay;
	}
	// 开始走路
	function walkRun(time,dist,disY){
		time =time ||3000;
		slowWalk();
		var dl = startRun({
			'left':dist +'px',
			'top':disY?disY:undefined
		},time);
		return dl;
	}
	function walkToShop(runTime){
		var defer = $.Deferred();
		var doorObj = $('.door');
		var offsetDoor = doorObj.offset();
		var offsetDoorLeft = offsetDoor.left;
		var boyoffset = $boy.offset();
		var boyoffsetleft = boyoffset.left;
		//小男孩当前需要移动的坐标
		instanceX = (offsetDoorLeft+doorObj.width()/2)-(boyoffsetleft + $boy.width()/2);
		var walkPlay = startRun({
			transform:'translateX('+ instanceX +'px),scale(0.3,0.3)',
			opacity:0.1
		},2000);
		walkPlay.done(function(){
			$boy.css({
				opacity:0
			});
			defer.resolve();
		});
		return defer;
	}
	function walkOutShop(runTime){
		var defer = $.Deferred();
		restoreWalk();
		var walkPlay = startRun({
			transform:'translateX('+instanceX+'px),scale(1,1)',
			opacity:1
		},runTime);
		walkPlay.done(function(){
			defer.resolve();
		});
		return defer;
	}
	function takeFlower(){
		var defer = $.Deferred();
		setTimeout(function(){
			$boy.addClass('showFlowerWalk');
			defer.resolve();
		},1000);
		return defer;
	}
	return {
		walkTo:function(time,proportionX,proportionY){
			var disX=calculateDist('x',proportionX);
     		var disY=calculateDist('y',proportionY);
     		return walkRun(time,disX,disY);
		},
		// 走进商店
		toShop:function(){
			return walkToShop.apply(null,arguments);
		},
		takeflower:function(){
			return takeFlower();
		},
		resetOriginal:function(){
			this.stopWalk();
			$boy.removeClass('slowWalk showFlowerWalk').addClass('boyOriginal');
		},
		getWidth: function() {
                return $boy.width();
        },
		// 走出商店
		outShop:function(){
			return walkOutShop.apply(null,arguments);
		},
		stopWalk:function(){
			pauseWalk();
		},
		setFlowerWalk:function(){
			$boy.addClass('showFlowerWalk');
		},
		rotate:function(callback){
			restoreWalk();
			$boy.addClass('boy-rotate');
			if(callback){
				$boy.on(animationEnd,function(){//动画结束事件animationEnd
					callback();
					$(this).off();//off()函数主要用于解除由on()函数绑定的事件处理函数
				});
			}
		}
		// setColor:function(value){
		// 	$boy.css('background-color',value);
		// }
	};
}
var snowflakeURl = [
        'http://img.mukewang.com/55adde120001d34e00410041.png',
        'http://img.mukewang.com/55adde2a0001a91d00410041.png',
        'http://img.mukewang.com/55adde5500013b2500400041.png',
        'http://img.mukewang.com/55adde62000161c100410041.png',
        'http://img.mukewang.com/55adde7f0001433000410041.png',
        'http://img.mukewang.com/55addee7000117b500400041.png'
    ];
function snowflake(){
    var $flakeContainer = $('#snowflake');

    function getImagesName(){
    	return snowflakeURl[Math.floor(Math.random()*6)];		
    }
    function createSnowBox(){
    	var url = getImagesName();
    	return $('<div class="snowbox"/>').css({
    		'width':41,
    		'height':41,
    		'position':'absolute',
    		'backgroundSize':'cover',
    		'zIndex':10000,
    		'top':'-41px',
    		'backgroundImage':'url('+url+')'
    	}).addClass('snowRoll'); 
    }
    setInterval(function(){
    	var startPositionLeft = Math.random()*visualWidth-100,
    	startOpacity = 1,
    	endPositionTop = visualHeight-40,
    	endPositionLeft = startPositionLeft - 100 + Math.random() * 500,
        duration = visualHeight * 10 + Math.random() * 5000;

            // 随机透明度，不小于0.5
            var randomStart = Math.random();
            randomStart = randomStart < 0.5 ? startOpacity : randomStart;
            var $flake = createSnowBox();
            $flake.css({
            	left:startPositionLeft,
            	opacity:randomStart
            }) ;
            $flakeContainer.append($flake);
            $flake.transition({
            	top:endPositionTop,
            	left:endPositionLeft,
            	opacity:0.7
            },duration,'ease-out',function(){
            	$(this).remove();
            });
    },200);
}
	
/*	 $('button:first').click(function(){
	 	openDoor().then(function(){
	 		lamp.bright();
	 	});
	 });
	 $('button:last').click(function(){
	 	shutDoor().then(function(){
	 		lamp.dark();
	 	});
	 });
*/	
var audioConfig = {
	enable:true,
	playURl:'http://www.imooc.com/upload/media/happy.wav',
	cycleURl:'http://www.imooc.com/upload/media/circulation.wav'
};
function Html5Audio(url,isloop){
	var audio = new Audio(url);
	audio.autoplay = true;
	audio.loop = isloop ||false;
	audio.play();
	return{
		end:function(){
			audio.addEventListener('ended',function(){
				callback();
			},false);
		}
	}
}
function audioplay(){
	var audio1 = Html5Audio(audioConfig.playURl);
	audio1.end(function(){
		Html5Audio(audioConfig.cycleURl,true);
	});
}
/*	$('button:first').click(function(){
		
		boy.walkTo(2000,0.15).then(function(){
			return boy.walkTo(1500,0.25,(bridgeY-girl.getHeight())/visualHeight);
		}).then(function(){
			var proportionX = (girl.getOffset().left-boy.getWidth()+girl.getWidth()/5)/visualWidth;
			return boy.walkTo(1500,proportionX);
		}).then(function(){
			boy.resetOriginal();
		}).then(function(){
			setTimeout(function(){
				girl.rotate();
				boy.rotate(function(){
					logo.run();
					snowflake();
				});
			},1000);
		});
	});*/
	function startRun(){
		$('.sun').addClass('rotate');
		$(".cloud:first").addClass('cloud1Anim');
	    $(".cloud:last").addClass('cloud2Anim');
	    // audioplay();
	    // 小还走路
		
		// boy.setFlowerWalk();
		boy.walkTo(2000,0.2).then(function(){
			return scrollTo(5000,1);
		}).then(function(){
			return boy.walkTo(5000,0.5);
		}).
		then(function(){
			boy.stopWalk();
		})
		.then(function(){
			return openDoor();
		})
		.then(function(){
			lamp.bright();
		})
		.then(function(){
			return boy.toShop(2000);
		})
		.then(function(){
			return boy.takeflower();
		})
		.then(function(){
			bird.fly();
		})
		.then(function(){
			return boy.outShop(2000);
		})
		.then(function(){
			return shutDoor();
		})
		.then(function(){
			lamp.dark();
		}).then(function(){
			scrollTo(3000,2);
		}).then(function(){
			boy.walkTo(3000,0.15);
		}).then(function(){
			return boy.walkTo(1500,0.25,(bridgeY-girl.getHeight())/visualHeight);
		}).then(function(){
			var proportionX = (girl.getOffset().left-boy.getWidth()+girl.getWidth()/5)/visualWidth;
			return boy.walkTo(1500,proportionX);
		}).then(function(){
			boy.resetOriginal();
		}).then(function(){
			setTimeout(function(){
				girl.rotate();
				boy.rotate(function(){
					logo.run();
					snowflake();
				});
			},1000);
		});
	}
	startRun();