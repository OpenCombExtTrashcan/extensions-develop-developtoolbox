$(function () {
	//配置
	GLOBAL = [];
	var messagebox = $("#message");
	
	/**
	* ORM 渲染器
	* */
	
	function OrmFactory(sExtend,sName,sData){
		this.id = sExtend+':'+sName;
		this.template = '<li id="'+this.id+'"><span>'+this.id+'</span></li>';
		this.getData = function(){
			return this.c.data('property');
		};
		this.setData = function(Property){
			this.c.data('property',Property);
		};
		this.display = function(){
			return this.template;
		}
	}
	
	/**
	* ORM 工厂
	* */
	
	function OrmFactory(sExtend,sName,sData){
		this.id = sExtend+':'+sName;
		this.template = '<li id="'+this.id+'"><span>'+this.id+'</span></li>';
		this.getData = function(){
			return this.c.data('property');
		};
		this.setData = function(Property){
			this.c.data('property',Property);
		};
		this.display = function(){
			return this.template;
		}
	}
	
	
	/**
	* ORM 管理器
	* */

	function OrmsController(sOrmFormId){
		this.c = $('.'+sOrmFormId);
		this.id = sOrmFormId;
		this.arrOrms = [];
		this.addOrm = function(sExtend,sName,sData){
			
		};
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
	$("#test_submit").click(function(){
		var myForm = new FormHandler($(".wanted:visible"));
		//输出?
		messagebox.append(myForm.getValues().join("\n"));
	});
	
	
});