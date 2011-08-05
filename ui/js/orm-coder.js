/**
 *   BUG : This is a STUPID code . if you know kongyuan , remind him rebuild this code .
 */


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

	function getPrototypes(){
		var arrOrms = [];
		$.each(defineOrm,function(extend,prototype){
			$.each(prototype,function(ormName ,orm){
				arrOrms.push(extend+':'+ormName);
			});
		});
		return arrOrms;
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
			//恢复orm条目和选项等
			if(ormMaps['asscociations'].length > 0){
				$.each(ormMaps['asscociations'],function(i,ass){
					var newOrmMap = makeNewOrmMap(ass , that);
					var arrFormkeyColumns = getTableColumns(that.sExtend,that.aData['table']);
						var arrToProto = ass['toPrototype'].split(':');
					var arrTokeyColumns = defineOrm[arrToProto[0]][arrToProto[1]]['columns'];
					if(ass['type'] == "hasAndBelongsToMany"){
						var arrBFormkeyColumns = getTableColumns(that.sExtend,ass['bridgeTableName']);
						var arrBTokeyColumns = getTableColumns(that.sExtend,ass['bridgeTableName']);
					}
					
					//恢复orm关联的内容(ormFomr中所有控件的值),只在编辑状态下才进行的步骤
					//fromkey
					rebuildFromKeySelect(newOrmMap.find('.ormFromKey') , arrFormkeyColumns );
					var fromkeyTemplate = newOrmMap.find('.ormFromKey').first();
					for(var key in ass['fromKeys']){
						var newLine = newOrmMap.find('.ormFromKey').last();
						if(key > 0){
							//新的key
							newLine = fromkeyTemplate.clone();
							newLine.after(newOrmMap.find('.ormFromKey').last().next('br'));
							$('<br />').after(newLine);
						}
						var newLine = newOrmMap.find('.ormFromKey').last();
						newLine.val(ass['fromKeys'][key]);
					}
					
					//Tokey
					rebuildToKeySelect(newOrmMap.find('.ormToKey') , arrTokeyColumns );
					var fromkeyTemplate = newOrmMap.find('.ormToKey').first();
					for(var key in ass['toKeys']){
						var newLine = newOrmMap.find('.ormToKey').last();
						if(key > 0){
							//新的key
							newLine = fromkeyTemplate.clone();
							newLine.after(newOrmMap.find('.ormToKey').last().next('br'));
							$('<br />').after(newLine);
						}
						var newLine = newOrmMap.find('.ormToKey').last();
						newLine.val(ass['toKeys'][key]);
					}
					
					if(ass['type'] == "hasAndBelongsToMany"){
						//bFromkey
						rebuildToKeySelect(newOrmMap.find('.ormBrigdeToKey') , arrBFormkeyColumns );
						var fromkeyTemplate = newOrmMap.find('.ormBrigdeToKey').first();
						for(var key in ass['bridgeFromKeys']){
							var newLine = newOrmMap.find('.ormBrigdeToKey').last();
							if(key > 0){
								//新的key
								newLine = fromkeyTemplate.clone();
								newLine.after(newOrmMap.find('.ormBrigdeToKey').last().next('br'));
								$('<br />').after(newLine);
							}
							var newLine = newOrmMap.find('.ormBrigdeToKey').last();
							newLine.val(ass['bridgeFromKeys'][key]);
						}
						//bTokey
						rebuildToKeySelect(newOrmMap.find('.ormBrigdeFromKey') , arrBTokeyColumns );
						var fromkeyTemplate = newOrmMap.find('.ormBrigdeFromKey').first();
						for(var key in ass['bridgeToKeys']){
							var newLine = newOrmMap.find('.ormBrigdeFromKey').last();
							if(key > 0){
								//新的key
								newLine = fromkeyTemplate.clone();
								newLine.after(newOrmMap.find('.ormBrigdeFromKey').last().next('br'));
								$('<br />').after(newLine);
							}
							var newLine = newOrmMap.find('.ormBrigdeFromKey').last();
							newLine.val(ass['bridgeToKeys'][key]);
						}
					}
				});
			}
			
		}
		
		$('#ormExtend').die('change',ormExtendChange);
		$('#ormExtend').live('change',ormExtendChange);

		$('#ormTable').die('change',ormTableChange);
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
		function ormTableChange(){
			//字段的变化
			ormColumns();
		}

		//字段列表
		function ormColumns() {
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
	
	// $('.ormType').die();
	$('.ormType').live('change', function() {
		// if(!confirm('您正试图修改orm类型,如果继续操作,对应的orm关系会被清空,是否继续操作?')){
			// return false;
		// }
		var newOrmForm = $('#template').find('.ormForm').clone();
		var newVal =$(this).val();
		
		$(this).parents('.ormForm').replaceWith(newOrmForm);
		newOrmForm.find('.ormType').val(newVal);
		rebuildOrmType(newOrmForm , true);
		//TODO 申请恢复表单
		
	});
	
	//根据ormtype的值显示或者隐藏中间表
	function rebuildOrmType(ormForm , bNewOrm){
		if(ormForm.find('.ormType').val() == 'hasAndBelongsToMany'){
			ormForm.find('.ormBridge').show(0);
			ormForm.find('.ormBridgeTableDiv').show(0);
		}else{
			ormForm.find('.ormBridge').hide(0);
			ormForm.find('.ormBridgeTableDiv').hide(0);
		}
		//如果是新建的orm,
		if(bNewOrm == true){
			rebuildOrmOptions(ormForm);
		}
	}
		
	function rebuildOrmOptions(newOrmMap){
		var sExtend = $('#ormExtend').val();
		var sTable = $('#ormTable').val();
		var arrTables = defineDbTable[sExtend];
		var arrTableNames = [];
		$.each(arrTables,function(tableName,table){
			arrTableNames.push(tableName);
		});
		rebuildBridgeTableSelect(newOrmMap,sExtend);
		var sBridgeTableName = newOrmMap.find('.ormBridgeTable').val();
		var arrBFormkeyColumns = getTableColumns(sExtend,sBridgeTableName);
		var arrBTokeyColumns = getTableColumns(sExtend,sBridgeTableName);
		//bFromkey
		rebuildToKeySelect(newOrmMap.find('.ormBrigdeToKey') , arrBFormkeyColumns );
		//bTokey
		rebuildToKeySelect(newOrmMap.find('.ormBrigdeFromKey') , arrBTokeyColumns );
		
		//from
		var arrFormkeyColumns = getTableColumns(sExtend,sTable);
		rebuildFromKeySelect(newOrmMap.find('.ormFromKey') , arrFormkeyColumns );
		//TO
		// rebuildToPrototypeSelect(newOrmMap , defineOrm[sExtend]);
			//如果是事件在调用函数,那么把事件的触发控件作为ormForm,如果不是就用传进来的
		newOrmMap.find('.ormToKey').find('option').remove();
		//TO原型
		rebuildToPrototypeSelect(newOrmMap ,getPrototypes());
		var sToPrototype = newOrmMap.find('.ormToPrototype').val();
		var arrPrototypeColumns = defineOrm[sToPrototype.split(':')[0]][sToPrototype.split(':')[1]]['columns'];
		rebuildToKeySelect( newOrmMap.find('.ormToKey'), arrPrototypeColumns);
	}
					
	//原型保存按钮
	$('#save').live('click', function() {
		var aData = {};
		var sExtension = $('#ormExtend').val();
		var sToExtension = $('#ormDefine').val();
		aData['table'] = $('#ormTable').val();
		aData['title'] = $('#ormTitle').val();
		//列
		aData['keys'] = [];  //primaryKeys
		$('.primaryKey:checked').each( function() {
			aData['keys'].push($(this).val());  //primaryKeys
		});
		aData['colunms'] = [];
		$('.usedColumn:checked').each( function() {
			aData['colunms'].push($(this).val());
		});
		//orm关系
		$('#property .ormForm').each(function(key,ormForm){
			ormForm = $(ormForm);
			var aAsscociation = {};
			var sOrmType = ormForm.find('.ormType').val();
			aAsscociation['model'] = ormForm.find('.ormToPrototype').val();//toPrototype
			var sOrmProp = ormForm.find('.ormToProp').val();
			aAsscociation['bridge'] = null;				//bridgeTableName
			if(aAsscociation['type'] == "hasAndBelongsToMany"){
				aAsscociation['bridge'] = ormForm.find('.ormBridgeTable').val();//bridgeTableName
			}
			aAsscociation['fromk'] = getValuesOfKeys(ormForm.find('.ormFromKey'));
			aAsscociation['tok'] = getValuesOfKeys(ormForm.find('.ormToKey'));
			aAsscociation['bfromk'] = null;
			aAsscociation['btok'] = null;
			if(aAsscociation['type'] == "hasAndBelongsToMany"){
				aAsscociation['bfromk'] = getValuesOfKeys(ormForm.find('.ormBrigdeToKey'));
				aAsscociation['btok'] = getValuesOfKeys(ormForm.find('.ormBrigdeFromKey'));
			}
			if(!aData[sOrmType]){
				aData[sOrmType] = {};
			}
			if(!$.isArray(aData[sOrmType][sOrmProp])){
				aData[sOrmType][sOrmProp] = [];
			}
			aData[sOrmType][sOrmProp] = aAsscociation;
		});
		ajaxSave(sExtension,sToExtension,aData);
	});
	function ajaxSave(sExtension,sToExtension,aData) {
		var url = '?c=developtoolbox.coder.orm';
		jQuery.ajax({
			type: "POST",
			url: url,
			data: '&extension='+sExtension+'&toExtension='+sToExtension+'&ajaxSaveData='+jQuery.toJSON(aData),
			success: function(msg) {
				$('#property').html(msg);
			}
		});
	}
	
	function getValuesOfKeys(arrKeys){
		var arrValues = [];
		arrKeys.map(function(){
			arrValues.push($(this).val());
		});
		return arrValues;
	}
	
	//全选
	$('#checkAll').live('change',function(){
		var bChecked = this.checked;
		var arrCheckboxs = $('.usedColumn');
		arrCheckboxs.prop('checked',bChecked);
	});
	
	//提醒用户不要轻易修改所属扩展
	$('#ormExtend').die('click');
	$('#ormExtend').live('click',function(){
		var temp = $('#ormExtend').val();
		//如果已经有多条orm关系,那么提醒用户那些关系会被清空
		if($('#property').find('.ormForm').length > 0){
			if(confirm('你正在试图改变orm所属扩展,但是你已经编写了针对这个扩展的orm关系,如果确定修改所属扩展,已经编辑好的orm关系将被删除.是否删除这些orm关系?')){
				$('#property').find('.ormForm').remove();
			}else{
				$('#ormExtend').val(temp);
				// return false;
			}
		}
	});
	//提醒用户不要轻易修改表
	$('#ormTable').die('click');
	$('#ormTable').live('click',function(){
		var temp = $('#ormTable').val();
		//如果已经有多条orm关系,那么提醒用户那些关系会被清空
		if($('#property').find('.ormForm').length > 0){
			if(confirm('你正在试图改变orm相关的表,但是你已经编写了针对这个扩展的orm关系,如果确定修改表,已经编辑好的orm关系将被删除.是否删除这些orm关系?')){
				$('#property').find('.ormForm').remove();
			}else{
				$('#ormTable').val(temp);
				// return false;
			}
		}
	});
	
	//增加一个映射关系
	$('.newOrmMap').live('click',makeNewOrmMap);
	
	function makeNewOrmMap(asscociation,theProperty) {
		//恢复表单
		if(asscociation != null && asscociation != undefined && theProperty != undefined){
			// $.each(asscociations,function(i,ass){
			//获取模板
			var newOrmMap = $('#template .ormForm').clone();
			//对象归位
			newOrmMap.insertBefore($('.newOrmMap').parent('div'));
			newOrmMap.find('.ormType').val(asscociation['type']);
			// newOrmMap.find('.ormType').trigger('change');
			rebuildOrmType(newOrmMap);
			//恢复选项
			//桥接表
			if(asscociation['bridgeTableName'] != null){
				rebuildBridgeTableSelect(newOrmMap,theProperty.sExtend);
				newOrmMap.find('.ormBridgeTable').val(asscociation['bridgeTableName']);
			}
			//TO原型
			rebuildToPrototypeSelect(newOrmMap ,getPrototypes());
			newOrmMap.find('.ormToPrototype').val(asscociation['toPrototype']);//.split(':')[1]);
			//TO原型别名
			newOrmMap.find('.ormToProp').val(asscociation['prop']);
			//数据恢复
		//新建表单
		}else{
			//获取模板
			var newOrmMap = $('#template .ormForm').clone();
			//对象归位
			newOrmMap.insertBefore($('.newOrmMap'));
			// newOrmMap.find('.ormType').trigger('change');
			rebuildOrmType(newOrmMap,true);
			//桥接表
			// rebuildBridgeTableSelect(newOrmMap,$('#ormExtend').val());
			
		}
		return newOrmMap;
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
			ormMap.find('.ormToPrototype').append('<option value="'+orm+'">'+orm+'</option>');
		});
	}
	
	function rebuildFromKeySelect(fromKeySelect , arr){
		// fromKeySelect.find('option').remove();
		for(var key in arr){
			fromKeySelect.append('<option value="'+arr[key]+'">'+arr[key]+'</option>');
		}
	}
	function rebuildBToKeySelect(BToKeySelect,arr){
		for(var key in arr){
			fromKeySelect.append('<option value="'+arr[key]+'">'+arr[key]+'</option>');
		}
	}
	function rebuildBFromKeySelect(BFromKeySelect,arr){
		for(var key in arr){
			fromKeySelect.append('<option value="'+arr[key]+'">'+arr[key]+'</option>');
		}
	}
	function rebuildToKeySelect(toKeySelect , arr){
		for(var key in arr){
			toKeySelect.append('<option value="'+arr[key]+'">'+arr[key]+'</option>');
		}
	}
	//如果更改了toprototype,那么重置所有对应字段
	$('.ormToPrototype').live('change', onOrmToPrototypeChanged);
	function onOrmToPrototypeChanged(event){
		//如果是事件在调用函数,那么把事件的触发控件作为ormForm,如果不是就用传进来的
		if(event['originalEvent']['type'] == 'change'){
			var ormForm = $(event['originalEvent']['target']).parents('.ormForm').first();
		}
		//清空所有option
		ormForm.find('.ormToKey').find('option').remove();
		//重新组织option
		var sToPrototype = $(event['originalEvent']['target']).val();
		var arrPrototypeColumns = defineOrm[sToPrototype.split(':')[0]][sToPrototype.split(':')[1]]['columns'];
//		var arrPrototypeColumns = defineOrm[$('#ormExtend').val()][$(event['originalEvent']['target']).val()]['columns'];
		rebuildToKeySelect( ormForm.find('.ormToKey'), arrPrototypeColumns);
	}
	//如果更改了中间表,那么重置所有对应字段
	$('.ormBridgeTable').live('change', onOrmBridgeTableChanged);
	function onOrmBridgeTableChanged(event){
		//如果是事件在调用函数,那么把事件的触发控件作为ormForm,如果不是就用传进来的
		if(event['originalEvent']['type'] == 'change'){
			ormForm = $(event['originalEvent']['target']).parents('.ormForm').first();
		}
		//清空所有option
		ormForm.find('.ormBrigdeToKey').find('option').remove();
		ormForm.find('.ormBrigdeFromKey').find('option').remove();
		//重新组织option
		var arrPrototypeColumns = defineDbTable[$('#ormExtend').val()][$(event['originalEvent']['target']).val()]['columns'];
		rebuildToKeySelect( ormForm.find('.ormBrigdeToKey'), arrPrototypeColumns);
		rebuildToKeySelect( ormForm.find('.ormBrigdeFromKey'), arrPrototypeColumns);
	}
	
	$('.addOrmFromKey').live('click',addFromKey);
	function addFromKey(event){
		var thisForm = $(event['originalEvent']['target']).parents('.ormForm').first();
		var newFromKey = thisForm.find('.ormFromKey').first().clone();
		newFromKey.insertBefore(thisForm.find('.addOrmFromKey')).after($('<br/>'));
		if(thisForm.find('.ormType').val() == 'hasAndBelongsToMany'){
			//如果存在中间表(多对多)
			var newFromKey = thisForm.find('.ormBrigdeToKey').first().clone();
			newFromKey.appendTo(thisForm.find('.ormBridgeStart')).after($('<br/>'));
		}else{
			//没有中间表
			var newFromKey = thisForm.find('.ormToKey').first().clone();
			newFromKey.appendTo(thisForm.find('.ormTo')).after($('<br/>'));
		}
		return false;
	}
	
	$('.addOrmBrigdeFromKey').live('click',addToKey);
	function addToKey(event){
		var thisForm = $(event['originalEvent']['target']).parents('.ormForm').first();
		var newFromKey = thisForm.find('.ormBrigdeFromKey').first().clone();
		newFromKey.insertBefore(thisForm.find('.addOrmBrigdeFromKey')).after($('<br/>'));
		var newFromKey = thisForm.find('.ormToKey').first().clone();
		newFromKey.appendTo(thisForm.find('.ormTo')).after($('<br/>'));
		return false;
	}
	
	//初始化左侧列表
	var aOrmController = new OrmsController("ormlistUl");
});