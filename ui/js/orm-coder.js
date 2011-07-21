$(function () {
	//配置
	var nUniqueId = 1 ; //唯一ID计数
	
	/**
	* 工具函数
	* */
	
	//产生唯一ID
	function getUniqueId(){
		return nUniqueId++;
	}
	
	/**
	* ORM 工厂
	* */
	
	function OrmFactory(){
		this.createOrm = function(sExtend,sDefines,aData){
			var sId = sExtend+'_'+sDefines+':'+aData['title']+'_'+getUniqueId();
			var sTemplate = '<li id="'+sId+'"><span>'+aData['title']+'</span></li>';
			//建立orm的jquery对象
			var aOrm = $(sTemplate);
			//绑定数据
			aOrm.data('property',aData);
			//扩展数据
			aOrm.ocExtend = sExtend;
			//所属定义
			aOrm.ocDefines = sDefines;
			//加工完毕,拿去玩吧
			return aOrm;
		}
	}
	
	/**
	* ORM 管理器
	* */

	 function OrmsController(sOrmFormId){
		 this.c = $('#'+sOrmFormId);
		 this.id = sOrmFormId;
		 this.arrOrms = {};
		 this.ormFactory = new OrmFactory();
		 //创建一个orm,同时登记到这个控制器的orm名单中
		 this.addOrm = function(sExtend,sDefines,aData){
			 var aOrm = this.ormFactory.createOrm(sExtend,sDefines,aData);
			 if(!this.arrOrms[sExtend]){
				 this.arrOrms[sExtend] = [];
			 }
			 if(!this.arrOrms[sExtend][sDefines]){
				 this.arrOrms[sExtend][sDefines] = [];
			 }
			 this.arrOrms[sExtend][sDefines].push(aOrm);
		 };
		 this.registerOrm = function(){
			 for(var sExtend in defineOrmDefines){
			 	for(var sDefines in defineOrmDefines[sExtend]){
			 		for(var ormName in defineOrmDefines[sExtend][sDefines]){
						this.addOrm(sExtend,sDefines ,defineOrmDefines[sExtend][sDefines][ormName]);
					}
			 	}
			 }
		 }
		 this.renderOrmForm = function(){
			 for(var sExtend in this.arrOrms){
				var aLiForExtend = $('<li>'+sExtend+'</li>');
				var aUlForsDefines = $('<ul></ul>');
				aLiForExtend.append(aUlForsDefines).appendTo(this.c);
				for(var sDefine in this.arrOrms[sExtend]){
					for(var key in this.arrOrms[sExtend][sDefine]){
						var aOrm = this.arrOrms[sExtend][sDefine][key];
						//如果定义的名字和扩展的一样,就只显示title,如果不一样(此扩展在覆盖上级扩展的orm定义),就以sDefine:title的样式显示
						//把下面的!=改成== 来查看后者描述的效果
						if(sExtend != sDefine){
							aOrm.find('span').text( sDefine + ':' + aOrm.find('span').text() );
						}
						aOrm.appendTo(aUlForsDefines);
					}
				}
			 }
		 }
		 this.searchOrm = function(sKeyword){};
		 this.hideOrms = function(){};
		 this.showOrms = function(){};
		 this.hideAllOrms = function(){
			 for(var key in this.arrOrms ){
				 this.arrOrms[key].hide(0);
			 }
		 };
		 this.showAllOrms = function(){
			 for(var key in this.arrOrms ){
				 this.arrOrms[key].show(0);
			 }
		 };
		 this.setSelected = function(e,aOrmBeClicked){
			 if(aOrmBeClicked.hasClass('selected')){
				 aOrmBeClicked.removeClass('selected');
				 //TODO 清除属性
 				
			 }else{
				 this.c.find('.selected').removeClass('selected');
				 aOrmBeClicked.addClass('selected');
				 //TODO 显示属性页面
				 // new PropertyController();
			 }
			 //停止冒泡
			 e.stopPropagation();
		 };
 		
		 //初始化
		 this.registerOrm();
		 this.renderOrmForm();
		 var thisObj = this;
		 $(this.c).find('ul').find('li').click(function(e){
			 thisObj.setSelected(e,$(this));
		 });
	 }
	
	/**
	* property 工厂
	* */
	
	//property 工厂基类
	function PropertyFactory(aJQueryObject){
		this.c = aJQueryObject;
		this.id = aJQueryObject.attr('id');
		this.template = '' ;
		this.getValue = function(){
			return this.c.val();
		};
		this.setValue = function(Value){
			this.c.val(Value);
		};
	}
	
	/**
	* property 控制器
	* */
	
	function PropertyController(arrFormWidgets){
		this.arrWidgets = [];
		this.arrSpecialWidgetIdList = ['test_display_inside','fsd'];
		
		this.addWidget = function(aWidget){
			this.arrWidgets[aWidget.id] = aWidget;
			// this.arrWidgets.push(aWidget);
			if( $.inArray( aWidget.id, this.arrSpecialWidgetIdList ) != -1){
				eval("aWidget.setValue = setValueFor_"+aWidget.id);
				eval("aWidget.getValue = getValueFor_"+aWidget.id);
			}
		};
		this.addWidgetsByArr = function(arrFormWidgets){
			var aFormHandler = this;
			arrFormWidgets.each(function(key,aWidget){
				aFormHandler.addWidget(new WidgetHandler($(aWidget)));
			});
		};
		this.getWidgets = function(){
			return this.arrWidgets;
		};
		this.getWidgetValueById = function(Id){
			return this.arrWidgets[Id].getValue();
		};
		this.setWidgetValueById = function(Id,val){
			this.arrWidgets[Id].setValue(val);
		};
		this.setValues = function(Values){
			$.each(Values,function(id,value){
				if( this.arrWidgets[id] != undefined ){
					this.arrWidgets[id].setValue(value);
				}
			});
		};
		this.getValues = function(){
			var arrValues = [];
			for( var id in this.arrWidgets)  {
				arrValues[id] = this.arrWidgets[id].getValue();
			}
			return arrValues;
		};
		
		this.addWidgetsByArr(arrFormWidgets);
	}
	
	var setValueFor_test_display_inside = function(Value){
		var arrInputs = $("#test_display_inside").find("input");
		arrInputs.each(function(i,w){
			$(w).val(Value[i]);
		});
	}
	
	var getValueFor_test_display_inside = function(){
		var arrInputs = $("#test_display_inside").find("input");
		var arrValues = [];
		arrInputs.each(function(i,w){
			arrValues.push($(w).val());
		});
		return arrValues;
	}
	
	
	/**
	*    初始化页面 
	* */
	
	 var aOrmController = new OrmsController("ormlistUl");
	
});