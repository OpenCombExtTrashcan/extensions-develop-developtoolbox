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

	function getExtends() {
		var arrExtends = [];
		for(var key in defineOrmDefines) {
			arrExtends.push(key);
		}
		return arrExtends;
	}

	function getTableByExtend(sExtend) {
		var arrTable = [];
		for(var table in defineDbTable[sExtend]) {
			arrTable.push(table);
		}
		return arrTable;
	}

	function getDefineByExtend(sExtend) {
		var arrDefine = [];
		for(var define in defineOrmDefines[sExtend]) {
			arrDefine.push(define);
		}
		return arrDefine;
	}
	
	function getTableColumns(extend,tableName){
		return defineDbTable[extend][tableName]['columns'];
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
			aOrm.click(function(e){
				aOrmController.setSelected(e,$(this));
			});
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
				$('#property').find('.newOrmMap').hide(0);
				$('#property').find('.prototypeForm').remove();
				$('#property').find('.ormForm').remove();
				this.aPropertyController = null;
			} else {
				this.getSelected().removeClass('selected');
				aOrmBeClicked.addClass('selected');
				//如果上次操作的界面还在,删掉它
				if(this.aPropertyController != null) {
					$('#property').find('.newOrmMap').hide(0);
					$('#property').find('.prototypeForm').remove();
					$('#property').find('.ormForm').remove();
					this.aPropertyController = null;
				}
				this.aPropertyController = new PropertyController(this.getSelected().data('property') , this.getSelectedExtend() ,this.getSelectedDefine() , defineDbTable , defineOrm);
			}
			//停止冒泡
			// e.stopPropagation();
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
		
	}

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
		this.initForm = function() {
			$('#ormExtend').html('');
			for(var key in defineOrmDefines) {
				$('#ormExtend').append('<option value="'+key+'">'+key+'</option>');
			}
			$('#ormExtend').val(this.sExtend);
			$('#ormTitle').val(this.aData['title']);
			ormExtendChange();
		};
		this.rebuideOrmMaps = function(){
			var ormMaps = this.defineOrm[this.sExtend][this.aData['title']];
			if(ormMaps['asscociations'].length > 0){
				makeNewOrmMap(ormMaps['asscociations'] , this);
			}
		}

		$('#ormExtend').die();
		$('#ormExtend').live('change',ormExtendChange);

		$('#ormTable').die();
		$('#ormTable').live('change',ormTableChange);

		function ormExtendChange() {
			//对ormDefine的影响
			var arrExtends = getExtends();
			$('#ormDefine').find('option').remove();
			for(var key in arrExtends) {
				$('#ormDefine').append('<option value="'+arrExtends[key]+'">'+arrExtends[key]+'</option>');
			}
			$('#ormDefine').val(that.sDefine);
			// $('#ormDefine').trigger('change');

			//对ormDefine的影响
			var arrTables = getTableByExtend($('#ormExtend').val());
			$('#ormTable').find('option').remove();
			for(var key in arrTables) {
				$('#ormTable').append('<option value="'+arrTables[key]+'">'+defineDbTable[$('#ormExtend').val()][arrTables[key]]['title']+'</option>');
			}
			$('#ormTable').val(that.aData['table']);
			ormTableChange();
		}

		//字段列表
		function ormTableChange() {
			var sColumns = '';
			var sExtend = $('#ormExtend').val();
			var sTable = $('#ormTable').val();
			if(!sTable) {
				alert(sExtend+'扩展没有任何数据表');
				return;
			}
			var sTitle = $('#ormTitle').val();
			var arrAllColumn = defineDbTable[sExtend][sTable]['columns'];
			var arrUsedColumn = defineDbTable[sExtend][sTable]['columns'];
			var arrPrimary = [];
			if(typeof defineDbTable[sExtend][sTable]['primaryKey'] =='string') {
				arrPrimary.push();
			} else {
				arrPrimary = defineDbTable[sExtend][sTable]['primaryKey'];
			}
			var sDevPrimary = defineDbTable[sExtend][sTable]['primaryKey'];
			//如果是和当前页面相符的数据
			if(sExtend == that.aData['extension'] && sTable == that.aData['table'] && sTitle == that.aData['title']) {
				arrUsedColumn = that.aData['columns'];
				arrPrimary = that.aData['primaryKeys'];
				sDevPrimary = that.aData['devicePrimaryKey'];
			}

			for(var key in arrAllColumn) {
				var bIsUsed = '';
				if($.inArray(arrAllColumn[key],arrAllColumn) != -1 ) {
					bIsUsed = 'checked="checked"';
				}
				var bIsPrimary = '';
				if( $.inArray(arrAllColumn[key],arrPrimary) != -1  ) {
					bIsPrimary = 'checked="checked"';
				}
				if(arrPrimary.length == 0 && arrAllColumn[key] == sDevPrimary) {
					bIsPrimary = 'checked="checked"';
				}
				sColumns += '<tr><td><input class="primaryKey" type="checkbox" value="'+arrAllColumn[key]+'" '+ bIsPrimary +'/></td>'
							+'<td><input class="usedColumn" type="checkbox" value="'+arrAllColumn[key]+'" '+ bIsUsed +'/></td>'
							+'<td>'+arrAllColumn[key]+'</td></tr>';
			}

			$('#ormColumn').find('tbody').find('tr:not(:last)').remove();
			$('#ormColumn').find('tbody').find('tr').before(sColumns);
		}
		
		var that = this;

		$('#guide').remove();
		$('.newOrmMap').show(0);
		this.getNewPrototypeForm();
		this.initForm();
		this.rebuideOrmMaps();
	}

	/**
	 *    初始化页面
	 * */
	
	
	// $('.ormType').die();
	$('.ormType').live('change', function() {
		if($(this).val() == 'hasAndBelongsToMany') {
			$(this).parents('.ormForm').find('.ormBridge').show(0);
			$(this).parents('.ormForm').find('.ormBridgeTableDiv').show(0);
		} else {
			$(this).parents('.ormForm').find('.ormBridge').hide(0);
			$(this).parents('.ormForm').find('.ormBridgeTableDiv').hide(0);
		}
	});
		
	//原型保存按钮
	$('#save').live('click', function() {
		var aData = {};
		aData['extend'] = $('#ormExtend').val();
		aData['define'] = $('#ormDefine').val();
		aData['table'] = $('#ormTable').val();
		aData['title'] = $('#ormTitle').val();
		aData['primaryKeys'] = [];
		$('.primaryKey:checked').each( function() {
			aData['primaryKeys'].push($(this).val());
		});
		aData['usedKeys'] = [];
		$('.usedColumn:checked').each( function() {
			aData['usedKeys'].push($(this).val());
		});
		ajaxSave(aData);
	});
	function ajaxSave(aData) {
		var url = '?c=developtoolbox.coder.orm';
		jQuery.ajax({
			type: "POST",
			url: url,
			data: '&ajaxSaveData='+jQuery.toJSON(aData),
			success: function(msg) {
			}
		});
	}
	
	//全选
	$('#checkAll').live('change',function(){
		var bChecked = this.checked;
		var arrCheckboxs = $('.usedColumn');
		arrCheckboxs.prop('checked',bChecked);
	});
	
	//增加一个映射关系
	$('.newOrmMap').live('click',makeNewOrmMap);
	
	function makeNewOrmMap(asscociations,theProperty) {
		//恢复表单
		if(asscociations != null && asscociations.length > 0){
			$.each(asscociations,function(i,ass){
				//获取模板
				var newOrmMap = $('#template .ormForm').clone();
				//对象归位
				newOrmMap.insertBefore($('.newOrmMap').parent('div'));
				newOrmMap.find('.ormType').val(ass['type']);
				newOrmMap.find('.ormType').trigger('change');
				//恢复选项
				//桥接表
				if(ass['bridgeTableName'] != null){
					rebuildBridgeTableSelect(newOrmMap,theProperty.sExtend);
					newOrmMap.find('.ormBridgeTable').val(ass['bridgeTableName']);
				}
				//TO原型
				rebuildToPrototypeSelect(newOrmMap ,defineOrm[theProperty.sExtend]);
				newOrmMap.find('.ormToPrototype').val(ass['toPrototype'].split(':')[1]);
				//TO原型别名
				newOrmMap.find('.ormToProp').val(ass['prop']);
				
				//数据恢复
				
// bridgeTableName
// bridgeToKeys
// fromKeys
// prop
// toKeys
// toPrototype
// type
			});
		//新建表单
		}else{
			//获取模板
			var newOrmMap = $('#template .ormForm').clone();
			//对象归位
			newOrmMap.insertBefore($('.newOrmMap'));
			newOrmMap.find('.ormType').trigger('change');
			//桥接表
			rebuildBridgeTableSelect(newOrmMap,theProperty.sExtend);
			//TO原型
			rebuildToPrototypeSelect(newOrmMap ,defineOrm[theProperty.sExtend]);
		}
	}
	
	function rebuildBridgeTableSelect(ormMap,extend){
		var arrTables = getTableByExtend(extend);
		ormMap.find('.ormBridgeTable').find('option').remove();
		for(var key in arrTables){
			ormMap.find('.ormBridgeTable').append('<option value="'+arrTables[key]+'">'+arrTables[key]+'</option>');
		}
	}
	
	function rebuildToPrototypeSelect(ormMap,arrOrms){
		$.each(arrOrms,function(key,orm){
			ormMap.find('.ormToPrototype').append('<option value="'+key+'">'+key+'</option>');
		});
	}
	

	var aOrmController = new OrmsController("ormlistUl");
});