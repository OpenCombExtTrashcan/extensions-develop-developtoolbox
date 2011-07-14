$(function () {
	//配置
	GLOBAL = [];
	var messagebox = $("#message");
	var nUniqueId = 1 ; 
	
	/**
	* 工具函数
	* */
	
	//产生
	function getUniqueId(){
		return nUniqueId++;
	}
	
	/**
	* ORM 工厂
	* */
	
	function OrmFactory(){
		this.createOrm = function(sExtend,aData){
			var sId = sExtend+':'+aData['title']+'_'+getUniqueId();
			var sTemplate = '<li id="'+sId+'"><span>'+aData['title']+'</span></li>';
			//建立orm的jquery对象
			var aOrm = $(sTemplate);
			//绑定数据
			aOrm.data('property',aData);
			//扩展数据
			aOrm.ocExtend = sExtend;
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
		this.arrOrms = [];
		this.ormFactory = new OrmFactory();
		//创建一个orm,同时登记到这个控制器的orm名单中
		this.addOrm = function(sExtend,aData){
			var aOrm = this.ormFactory.createOrm(sExtend,aData);
			this.arrOrms.push(aOrm);
		};
		this.registerOrm = function(){
			for(var sExtend in defineOrm){
				for(var ormName in defineOrm[sExtend]){
					this.addOrm(sExtend,defineOrm[sExtend][ormName]);
				}
			}
		}
		this.renderOrmForm = function(){
			for(var key in this.arrOrms){
				this.arrOrms[key].appendTo(this.c);
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
		
		//初始化
		this.registerOrm();
		this.renderOrmForm();
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
	
	//test
	// $("#test_submit").click(function(){
		// var myForm = new FormHandler($(".wanted:visible"));
		// //输出?
		// messagebox.append(myForm.getValues().join("\n"));
	// });
	
	
	
	/**
	*    初始化页面 
	* */
	
	var aOrmController = new OrmsController("ormlistUl");
	
});