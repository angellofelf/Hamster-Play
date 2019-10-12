    //游戏背景
	var ground;
	//鼠标出现的位置坐标
	var coordinate=[{x: 130, y:173}, {x: 320, y:171}, {x: 515, y:175}, {x: 105, y: 265}, {x: 320, y: 256}, {x: 522, y: 256}, {x: 96, y: 350}, {x: 320, y: 355}, {x: 540, y: 358}];//洞口坐标
	//地鼠出现的定时器
	var gametimer;
	var mask=[];//草坪遮罩
	var mouse=new Array(9);  //地鼠数组
	//最大的地鼠数
	var maxCount=2;
	//分数 点中一个加10
	var score=0;
	//生命 自由下落(逃跑)一个减一
	var life=10;

window.onload=function(){           //鼠标划入变锤子
	ground=document.getElementsByClassName('ground')[0];
	ground.onmousedown=function(){
		ground.style.cursor='url("images/hammer2.png"),auto';
	}
	ground.onmouseup=function(){
		ground.style.cursor='url("images/hammer.png"),auto';
	}
	init();
}

    function init(){
    	//创建地鼠出现的位置 洞穴的位置
    	createMask();
    	//每隔一段时间出现一个地鼠
    	gameTimer=setInterval(function(){
    		//创建每一个地鼠
    		controlMouse();
    		// 每次生成后判断是否结束
    		if(life<=0){
    			clearInterval(gameTimer);
    			alert('游戏结束：得分：'+score);
    		}
    		document.getElementsByClassName('scoreCon')[0].innerHTML=score;
    		document.getElementsByClassName('life')[0].innerHTML=life;
    		maxCount=score/100+1;
    	},50);

    }
    function createMask(){                                                 //***第一步
    	//根据坐标生成洞穴位置
    	for(var i=0;i<coordinate.length;i++){
    		//创建div 将来插入地鼠
    		var temp=document.createElement('div');
    		temp.classList.add('mask');
				//classList 属性返回元素的类名，作为 DOM对象。
				// 该属性用于在元素中添加，移除及切换 CSS 类。
				// classList 属性是只读的，但你可以使用 add() 和 remove() 方法修改它。

    	    //确定每一个地鼠巢穴的位置
    		temp.style.left=coordinate[i].x+'px';
    		temp.style.top=coordinate[i].y+'px';                                  //停

    		//创建草坪掩盖
    		var img=document.createElement('div');                               ///*****第五步
    		img.classList.add('mask');
    		//设置遮罩层背景 每一个洞穴背景不一样
    		img.style.background='url("images/mask'+i+'.png")';
    		//控制层级草坪在地鼠身上
    		img.style.zIndex=i*2+1;

    		//将元素放置在数组中
    		mask[i]=temp;
    		temp.appendChild(img);
    		//将创建div插入父级
    		ground.appendChild(temp);
    		//记录点击的位置
    		temp.index=i;
    		//点击每一个消失
    		temp.onclick=function(){
    			disappear(this.index,true);
    		}
    	}
    }

    //创建地鼠
    function  createMouse(i){                                     //***第三步
    	//四只老鼠随机出现
    	var num=Math.floor(Math.random()*4);
    	var temp=document.createElement('div');
    	temp.num=num;
    	temp.classList.add('mouse');
    	//设置地鼠出现的背景图片
    	temp.style.background='url("images/mouse'+num+'.png")'; 

    	//每一个地鼠需要出现在指定的位置 在对应的洞穴上出现一只老鼠
    	//用两个数组对应 一个存放着洞穴 一个存放老鼠
    	mouse[i]=temp;
    	temp.style.zIndex=i*2;    //先不管
    	temp.style.animation="moveTop 0.5s linear"; //linear 线性过渡     //停

    	mask[i].appendChild(temp);                                               //****第五步  
    	var timer=setInterval(function(){
    			disappear(i,false);
    		},2000);
    	temp.timer=timer;
    }
    //控制地鼠的生成条件
    function controlMouse(){                                                        //****第二步
    	// 随机出现位置  并且同时出现的地鼠个数不大于最大个数  同一个位置不能出现两只
    	var num=Math.floor(Math.random()*9);   
    	if(mouse.filter(function(item){    //filter 过滤数组元素，这里表示出现的
    		return item;
    	}).length<maxCount && mouse[num]==null){//限制出现的最大数和出现的位置
    		createMouse(num);
    	}
    }

    //消失函数
    function disappear(i,isHit){                                  //*****第四步
    	if(mouse[i]){
    		//无论是否被打均缩回洞里 通过改变top值
    		mouse[i].style.top='70px';
    		//被打 改变样式 添加打蒙圈的小星星 改变背景图片
    		if(isHit){
    			//被打中分数加10
    			score+=10;
    			//创建包含蒙圈小星星的元素
    			var bomp=document.createElement('img');
    			bomp.classList.add('mouse');
    			bomp.style.top='-40px';
    			  // 添加gif动图为背景显示
    			bomp.src="images/bomb.gif";//小星星
    			//替换当前老鼠的图片
    			mouse[i].style.background='url("images/hit'+mouse[i].num+'.png")';//老鼠哭
    			//插入当前点击位置
    			mouse[i].appendChild(bomp);
    			//清除自身的下落
    			clearTimeout(mouse[i].timer);
    		}else{
    			//没有被打   自己缩回生命减一
    			life-=1;
    		}
    	}
    	setTimeout(function(){
    		if(mouse[i]){
    			mask[i].removeChild(mouse[i]);
    		}
    		mouse[i]=null;
    	},500);
    }