$( function () {
	//配置
	var nUniqueId = 1 ; //唯一ID计数

	/**
	 * 工具函数
	 * */

	//产生唯一ID
	function getUniqueId() {
		return nUniqueId++;
	}
	
	function getExtends(){
		var arrExtends = [];
		for(var key in defineOrmDefines){
			arrExtends.push(key);
			}
		return arrExtends;
	}
	
	function getTableByExtend(sExtend){
		var arrTable = [];
		for(var table in defineDbTable[sExtend]){
			arrTable.push(table);
		}
		return arrTable;
	}
	
	function getDefineByExtend(sExtend){
		var arrDefine = [];
		for(var define in defineOrmDefines[sExtend]){
			arrDefine.push(define);
		}
		return arrDefine;
	}

	/**
	 * ORM 工厂
	 * */

	function OrmFactory() {
		this.createOrm = function(sExtend,sDefines,aData) {
			var sId = sExtend+'_'+sDefines+':'+aData['title']+'_'+getUniqueId();
			var sTemplate = '<li id="'+sId+'"><span>'+aData['title']+'</span></li>';
			//建立orm的jquery对象
			var aOrm = $(sTemplate);
			//绑定数据
			aOrm.data('property',aData);
			//扩展数据
			aOrm.data('ocExtend',sExtend) ;
			//所属定义
			aOrm.data('ocDefine',sDefines) ;
			//加工完毕,拿去玩吧
			return aOrm;
		}
	}

	/**
	 * ORM 管理器
	 * */

	function OrmsController(sOrmFormId) {
		this.c = $('#'+sOrmFormId);
		this.id = sOrmFormId;
		this.arrOrms = {};
		this.ormFactory = new OrmFactory();
		this.aPropertyController = null;
		//创建一个orm,同时登记到这个控制器的orm名单中
		this.addOrm = function(sExtend,sDefines,aData) {
			var aOrm = this.ormFactory.createOrm(sExtend,sDefines,aData);
			if(!this.arrOrms[sExtend]) {
				this.arrOrms[sExtend] = [];
			}
			if(!this.arrOrms[sExtend][sDefines]) {
				this.arrOrms[sExtend][sDefines] = [];
			}
			this.arrOrms[sExtend][sDefines].push(aOrm);
		};
		this.registerOrm = function() {
			for(var sExtend in defineOrmDefines) {
				for(var sDefines in defineOrmDefines[sExtend]) {
					for(var ormName in defineOrmDefines[sExtend][sDefines]) {
						this.addOrm(sExtend,sDefines ,defineOrmDefines[sExtend][sDefines][ormName]);
					}
				}
			}
		}
		this.renderOrmForm = function() {
			for(var sExtend in this.arrOrms) {
				var aLiForExtend = $('<li>'+sExtend+'</li>');
				var aUlForsDefines = $('<ul></ul>');
				aLiForExtend.append(aUlForsDefines).appendTo(this.c);
				for(var sDefine in this.arrOrms[sExtend]) {
					for(var key in this.arrOrms[sExtend][sDefine]) {
						var aOrm = this.arrOrms[sExtend][sDefine][key];
						//如果定义的名字和扩展的一样,就只显示title,如果不一样(此扩展在覆盖上级扩展的orm定义),就以sDefine:title的样式显示
						//把下面的!=改成== 来查看后者描述的效果
						if(sExtend != sDefine) {
							aOrm.find('span').text( sDefine + ':' + aOrm.find('span').text() );
						}
						aOrm.appendTo(aUlForsDefines);
					}
				}
			}
		}
		this.searchOrm = function(sKeyword) {
		};
		this.hideOrms = function() {
		};
		this.showOrms = function() {
		};
		this.hideAllOrms = function() {
			for(var key in this.arrOrms ) {
				this.arrOrms[key].hide(0);
			}
		};
		this.showAllOrms = function() {
			for(var key in this.arrOrms ) {
				this.arrOrms[key].show(0);
			}
		};
		this.setSelected = function(e,aOrmBeClicked) {
			if(aOrmBeClicked.hasClass('selected')) {
				aOrmBeClicked.removeClass('selected');
				this.aPropertyController = this.aPropertyController.display(false);
			} else {
				this.getSelected().removeClass('selected');
				aOrmBeClicked.addClass('selected');
				//如果上次操作的界面还在,删掉它
				if(this.aPropertyController != null){
					this.aPropertyController = this.aPropertyController.display(false);
				}
				this.aPropertyController = new PropertyController(this.getSelected().data('property') , this.getSelectedExtend() ,this.getSelectedDefine() , defineDbTable , defineOrm);
				this.aPropertyController.display(true);
			}
			//停止冒泡
			e.stopPropagation();
		};
		//选中orm的相关操作
		this.getSelected = function() {
			return this.c.find('.selected');
		}
		this.getSelectedExtend = function() {
			return this.getSelected().data('ocExtend');
		}
		this.getSelectedDefine = function() {
			return this.getSelected().data('ocDefine');
		}
		//初始化
		this.registerOrm();
		this.renderOrmForm();
		var thisObj = this;
		$(this.c).find('ul').find('li').click( function(e) {
			thisObj.setSelected(e,$(this));
		});
	}

	/**
	 * property 工厂
	 * */

	// 工厂
	// function FormWidgetFactory() {
		// this.createFormWidget = function(aWidget) {
			// var aJWidget = $(aWidget);
			// var arrSubWidgets = aJWidget.find('input , select');
			// //扩展formwidget,让它成为基本widget的容器,
			// aJWidget.arrWidgets = [];
			// aJWidget.getValue = function(){
				// return $(this).val();
			// };
			// aJWidget.getValue = function(Value){
				// $(this).val(Value);
			// };
			// //扩展子控件的行为,让他们可以使用统一的赋值和取值函数,以及ocChange事件等等
			// arrSubWidgets.each(function(){
// 				
			// });
			// return aJWidget;
		// }
	// }

	/**
	 * property 控制器
	 * */

	function PropertyController(Data , sExtend, sDefide ,defineDbTable , defineOrm) {
		this.c = $('#property');
		this.arrWidgets = [];
		this.aData = Data;
		this.sExtend = sExtend;
		this.sDefine = sDefide;
		this.defineDbTable = defineDbTable;
		this.defineOrm = defineOrm;
		// this.aFormWidgetFactory = new FormWidgetFactory();

		this.addWidget = function(aWidget) {
			this.arrWidgets[aWidget.id] = aWidget;
			
		};
		this.getWidgets = function() {
			return this.arrWidgets;
		};
		this.getWidgetValueById = function(Id) {
			return this.arrWidgets[Id].getValue();
		};
		this.setWidgetValueById = function(Id,val) {
			this.arrWidgets[Id].setValue(val);
		};
		this.setValues = function(Values) {
			$.each(Values, function(id,value) {
				if( this.arrWidgets[id] != undefined ) {
					this.arrWidgets[id].setValue(value);
				}
			});
		};
		this.getValues = function() {
			var arrValues = [];
			for( var id in this.arrWidgets) {
				arrValues[id] = this.arrWidgets[id].getValue();
			}
			return arrValues;
		};
		this.getNewPrototypeForm = function() {
			$('#template').find('.prototypeForm').clone().insertAfter($('#property').find('div').first()).show(0);
		};
		this.initSelects = function(){
			$('#ormExtend').html('');
			for(var key in defineOrmDefines){
				$('#ormExtend').append('<option value="'+key+'">'+key+'</option>');
			}
			$('#ormExtend').val(this.sExtend);
			$('#ormExtend').trigger('change');
		};
		//还原数据到表单
		this.putDataToForm = function(){
			
		};
		this.display = function(bDisplay) {
			if(bDisplay) {
				$('#guide').remove();
				$('.newOrmMap').show(0);
				this.getNewPrototypeForm();
				this.initSelects();
				this.putDataToForm();
				return this;
			} else {
				//消失
				this.c.find('.newOrmMap').hide(0);
				this.c.find('.prototypeForm').remove();
				this.c.find('.ormForm').remove();
				return null;
			}
		};
		
		that = this;
		
			//增加一个映射关系
		$('.newOrmMap').live('click',function(){
			$('#template .ormForm').clone().insertBefore($(this));
		});
		
		$('#property .ormType').live('change',function(){
			if($(this).val() == 'hasAndBelongsToMany'){
				$(this).parents('.ormForm').find('.ormBridge').show(0);
				$(this).parents('.ormForm').find('.ormBlock').show(0);
			}else{
				$(this).parents('.ormForm').find('.ormBridge').hide(0);
				$(this).parents('.ormForm').find('.ormBlock').hide(0);
			}
		});
		
		
		
		$('#ormExtend').live('change',function(){
			//对ormDefine的影响
			var arrExtends = getExtends();
			$('#ormDefine').html('');
			for(var key in arrExtends){
				$('#ormDefine').append('<option value="'+arrExtends[key]+'">'+arrExtends[key]+'</option>');
			}
			$('#ormDefine').val(that.sDefine);
			$('#ormDefine').trigger('change');
			//对ormDefine的影响
			var arrTables = getTableByExtend($(this).val());
			$('#ormTable').html('');
			for(var key in arrTables){
				$('#ormTable').append('<option value="'+arrTables[key]+'">'+arrTables[key]['title']+'</option>');
			}
			$('#ormTable').val(that.aData['table']);
			$('#ormTable').trigger('change');
		});
		
		$('#ormDefine').live('change',function(){
			
		});
	}

	/**
	 *    初始化页面
	 * */
	var aOrmController = new OrmsController("ormlistUl");



});