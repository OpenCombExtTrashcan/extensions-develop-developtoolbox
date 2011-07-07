jQuery(function () {
	//配置
	var treeTableId = "#toolpanel";
	var treeTable = jQuery(treeTableId);
	var childClassPre = "child_of_"; //用来标记子node的class的前缀,暂时不要修改,会影响getParent函数
	var fileName = ""; //本页顶级controller的文件名
	var extensionName = ""; //本页顶级controller所属扩展的名字

	var allowTypes = {
		"noselected" : ['controller' , 'view' , 'model']
    	,"controller" : ['']
		,"view" : ['view' , 'widget']
		,"widget" : [ 'verifier' ]
		,"verifier" : ['']
		,"model" : ['model']
	};
	
	//数据对象
	treeData ={"filename":"","children":[]};
	
	//为view显示字段而准备的数据对象
	ormTableColumn = {};
	
	//orm 唯一id
	var idForOrm = 1;
	function getIdForOrm(){
		idForOrm = idForOrm + 1;
		return idForOrm;
	}
	
	//获得node的层级,顶级为0,顶级的子node就是1,孙node就是2,依次类推
	function getLevel(aNode){
		var classNames = aNode.attr("class").split(' ');
	  for(var key in classNames) {
	    if(typeof(classNames[key])=="string" && classNames[key].match("level_")) {
	    	var arrLevel = classNames[key].split('_');
	      return Number(arrLevel[1]);
	    }
	  }
	  return 0; // 前面的代码没有return,则代表node是顶级标签
	}
	
	//调整node的缩进,注意:已经有缩进的会重复缩进,如果要修正,请从//1开始
	function intendNode(aNode){
		var nLevel = getLevel(aNode);
		if( nLevel != 0){
			//1
			aNode.find("td:first-child").prepend('<div class="tr_indent"></div>');
			aNode.find(".tr_indent").css("width" ,16*nLevel+"px" );
		}	
	}
	
	//选中
	function setSelected(aNode){
		if(aNode.hasClass("selected")){
			aNode.removeClass("selected");
			changeBtnStateByTrType(null);
			// getPropertyPage(null);
			return;
		}
		treeTable.find("tr").removeClass("selected");
		aNode.addClass("selected");
		//左侧添加按钮按权限显示
		changeBtnStateByTrType(aNode);
		//右侧属性栏
		getPropertyPage(aNode);
	}
	
	//属性页面切换
	function getPropertyPage(aNode){
		var sNodeType = getNodeType(aNode);
		//如果是widget的属性页,把属性附表先隐藏
		if(sNodeType == "widget"){
			widgetOtherPropertyGoBackToStore();
		}
		//处理属性通用页面
		jQuery( ".propertys" ).hide(0);
		var aPropertyPage = jQuery( "#" + getNodeType(aNode) + "_property" );
		aPropertyPage.show(0);
		if(sNodeType == "view"){
			initViewDataExchangeSelect(aNode);
		}
		//得到数据
		var aData = aNode.data("property");
		if(aData != undefined){
			getProperties(aPropertyPage,aData);
		}
	}
	
	//还原属性栏内容
	function getProperties(aPropertyPage,aData){
		//先看看是不是widget类型,如果是widget类型,那么先组合附表单
		if( aData["objectClass"] == "widget" && aData["classname"] != undefined){  //处理select属性附属页面
			widgetTypeChange(aData["classname"]);
		}
		//先看看是不是verifier类型,如果是verifier类型,那么先组合附表单
		if(aData["objectClass"] == "verifier" && aData["class"] != undefined){
			rebuildVerifierProperty(aData["class"]);
		}
		
		//得到属性表单中的widget
		var arrProperty = getPropertyWidget(aPropertyPage);
		//复原widget的值
		jQuery.each(arrProperty, function(i,n){
			var sArgId = jQuery(n).attr("id");
			var sArgName = jQuery(n).attr("id").split("_")[1];
			if(aData!=undefined){
				var sValue = aData[sArgName];
			}
			var aArgWidget = aPropertyPage.find("#"+sArgId);
			if(aArgWidget[0].type=="checkbox" || aArgWidget[0].type=="radio"){
				aArgWidget[0].checked = sValue;
			}else if( aArgWidget[0].type == "hidden" ){
				giveValueToHiddenWidget(aArgWidget,sValue);
			}else if( sArgName!="submit"){
				if(sValue != undefined){
					jQuery(n).val(sValue);
				}else{
					jQuery(n).val(null);
				}
			}
		});
	}
	
	//返回一个数组,包含propertypage的可提交控件的对象数组,比如input和select控件
	function getPropertyWidget(aPropertyPage){
		return aPropertyPage.find("input,select").not(".nosave");
	}
	
	//widget 的类型(比如;select,checkbox,text等)变化时触发
	function widgetTypeChange(widgetClass){
		var sWidgetClass = "";
		if(widgetClass == null){
			sWidgetClass = jQuery("#widget_property #widget_classname").val();
		}else{
			sWidgetClass = widgetClass;
		}
		var sWidgetPropertyPageId = "#"+ sWidgetClass +'_property';
		widgetOtherPropertyGoBackToStore();
		jQuery(sWidgetPropertyPageId).appendTo(jQuery("#other_property")).show(0);											   
	}
	
	//widget的附属表单隐藏
	function widgetOtherPropertyGoBackToStore(){
		jQuery(".widget_propertys").appendTo(jQuery("#widget_property_store")).hide(0);
	}
	
	//新建node(tr)
	function makeNewNode(aParent,newNodeId,sNewType){
		if(jQuery("#"+newNodeId).length > 0){
			alert("你有一个对象没有命名");
			return false;
		}
		if(aParent==null){
			//如果没有父对象,就建立一个顶级的对象
			treeTable.append('<tr id="'+ newNodeId +'"><td><span class="'+sNewType+'"></span><b>newNode</b></td><td></td><td></td></tr>');
		}else{
			//如果有父对象,就建立一个子对象
			aParent.after('<tr id="'+ newNodeId +'"><td><span class="'+sNewType+'"></span><b>newNode</b></td><td></td><td></td></tr>');	
		}
		
		var aNewNode = jQuery("#"+newNodeId);
		var aNewNodeProperty = {"objectClass":sNewType,"children":[]};
		aNewNode.data("property",aNewNodeProperty);
		if(aParent!=null){
			var aParentProperty = aParent.data("property");
			aParentProperty["children"].push(aNewNodeProperty);
			aNewNode.addClass( childClassPre+aParent.attr("id") );
			aNewNode.addClass("level_"+(getLevel(aParent)+1) );
			intendNode(aNewNode);
		}else{
			treeData["children"].push(aNewNodeProperty);
		}
	}
	
	//获得btn的Type
	function getBtnType(aBtn){
		var btnId = aBtn.attr("id");
		if(btnId == "add_controller"){
			return "controller";
		}else if(btnId == "add_view"){
			return "view";
		}else if(btnId == "add_widget"){
			return "widget";
		}else if(btnId == "add_verifier"){
			return "verifier";
		}else if(btnId == "add_model"){
			return "model";
		}
	}
	
	//获得node的type
	function getNodeType(aNode){
		return aNode.find("span").attr("class");
	}
	
	//左侧按钮按照选中的tr的类型切换可用状态,如果没有aNode参数,typeclass=noselected,意为没有任何被选中标签
	function changeBtnStateByTrType(aNode){
		var typeClass = "";
		if(aNode==null){
			typeClass = "noselected";
		}else{
			typeClass = getNodeType(aNode);
		}
		if(typeClass in allowTypes){
			jQuery(".addButtons").addClass("add_btn_disabled");
			for(var key in allowTypes[typeClass]){
				jQuery("#add_"+allowTypes[typeClass][key]).removeClass("add_btn_disabled");
			}
		}
	}
	
	//获得父node
	function getParent(aNode){
		var arrClasses = aNode.attr("class").split(" ");
		var sParentId = "";
		for(var key in arrClasses){
			if(typeof(arrClasses[key])=="string" && arrClasses[key].match(childClassPre)){
				sParentId = arrClasses[key].split("_")[2];
			}
		}
		if(sParentId == ""){
			return false; //没有父node
		}
		return jQuery("#"+sParentId);
	}
	
	//获得指定类型的父node
	function getParentByType(aNode,sType){
		var aNodeTemp = aNode;
		while( aNodeTemp != "topController" && getNodeType(aNodeTemp) != sType ){
			aNodeTemp = getParent(aNodeTemp);
			if(aNodeTemp == false){
				aNodeTemp = "topController";
			}
		}
		return aNodeTemp;
	}
		
	//获得子node , 返回子node对象数组,如果没有子node,返回false
	function getChildren(aNode){
		var arrChildren = [];
		var sNodeId = aNode.attr("id");
		var sChildrenClass = childClassPre+sNodeId;
		arrChildren = jQuery("."+sChildrenClass);
		if(arrChildren.length <= 0){
			arrChildren = false;
		}
		return arrChildren;
	}
	//从node数组中查找指定类型的node,返回数组,如果没有指定的node,返回false
	function findNodeFormChildren(arrNodes,sType){
		if(arrNodes==false){
			return false;
		}
		var arrSubNode = [];
		$.each(arrNodes,function(i,v){
			if(getNodeType($(v)) == sType){
				arrSubNode.push($(v));
			}
		});
		if(arrSubNode.length <= 0){
			arrSubNode = false;
		}
		return arrSubNode;
	}
	
	//删除数组元素
	function removeElementByIndex(dx,arr){
	  if(isNaN(dx)||dx>arr.length){return false;}
	  for(var i=0,n=0;i<arr.length;i++){
		  if(arr[i]!=arr[dx]){
		  	arr[n++]=arr[i];
		  }
	  }
	  arr.length-=1;
	  return arr;
  	}
	
	//转义 . ,初期目的是为了防止用文件名做ID的时候 . 被误读成css选择器的. 
	function escapeId(sOldId){
		var sNewId = sOldId.replace(/\./ig,"-");
		sNewId = sNewId.replace(/\\/ig,'-');
		return sNewId;
	}
	
	//删除node ,包括子node
	function removeNode(aSelected){
		var arrChildren = getChildren(aSelected);
		if(arrChildren != false){
			jQuery.each(arrChildren,function(i,n){
				removeNode(jQuery(n));			  
			});
		}
		var aSelectedProperty = aSelected.data("property");
		var aSelectedParentProperty ;
		//删除父node的children中的记录
		var aSelectedParent = getParent(aSelected);
		if(aSelectedParent == false){//如果用户想删除的对象是顶级对象,则删除treedata中的children的数据,即吧treedata当做父对象
			aSelectedParentProperty = treeData;
		}else{
			aSelectedParentProperty = aSelectedParent.data("property");
		}
		for(var key in aSelectedParentProperty["children"]){
			if(aSelectedParentProperty["children"][key] == aSelectedProperty){
				removeElementByIndex(key,aSelectedParentProperty["children"]);
			}
		}
		aSelected.remove();
		changeBtnStateByTrType(null);
	}
	
	//当namespace区域被编辑时的行为
	function nameSpaceEdit(){
		var aClassName = jQuery("#className");
		var namespaceSelectValue = jQuery("#namespaceSelect").val();
		//首字母大写
		aClassName.val(aClassName.val()[0].toUpperCase()+aClassName.val().substr(1));
		if(namespaceSelectValue == 0 || aClassName.val().length == 0){
			jQuery("#namespaceComplete").addClass("noFileName").text("还没有确定命名空间...");
			treeData["filename"] = "";
			return;
		}else{
			var filepath = namespaceData[namespaceSelectValue]["folder"];
			fileName = filepath+'/'+aClassName.val()+".php";
			jQuery("#namespaceComplete").removeClass("noFileName").text(fileName);
			treeData["filename"] = fileName;
			extensionName = namespaceData[namespaceSelectValue]["extension"];
		}
	}
	
	//命名空间部分被编辑时触发
	jQuery("#className").change(nameSpaceEdit);
	jQuery("#namespaceSelect").change(nameSpaceEdit);
	
	//视图名称变化时自动生成template
	jQuery("#view_name").keyup(function(){
		if(extensionName == ""){
			return;
		}
		jQuery("#view_template").val(jQuery(this).val()+".template.html");//extensionName + "_" +jQuery(this).val()+".template.html");
	});
	
	//左侧按钮功能
	jQuery(".addButtons").click(function(){
		var selectedTr = treeTable.find(".selected");
		var sNewType = getBtnType(jQuery(this));
		if(selectedTr.length <= 0){
			//目前没有node,显示所有的btn
			makeNewNode(null,"newNode",sNewType);
			return false;
		}
		makeNewNode(selectedTr,"newNode",sNewType);
		return false;
	});
	
	//表格点击后..
	jQuery(treeTableId + " tbody tr").live("click",function(){
		//选中
		setSelected(jQuery(this));
	});
	
	//相应删除按钮
	jQuery("#deleteBtn").click(function(){
		if(!confirm('确实要删除这个对象吗? \n\n所有的子对象都会被删除!!')){
			return false;	
		}
		var aSelected = jQuery(".selected");
		if(aSelected.length <= 0){
			return false;
		}
		removeNode(aSelected);
		return false;
	});
	
	//属性提交
	jQuery(".submitBtn").live("click",function(){
		var aSelected = jQuery(".selected");	
		var sSubmitBtnId = jQuery(this).attr("id");	
		var sSubmitType = sSubmitBtnId.split("_")[0];
		var arrProperties = getPropertyWidget(jQuery("#"+sSubmitType+"_property"));
		var dataObject = {};
		
		if(aSelected.data("property")!=undefined){
			dataObject=aSelected.data("property");
			//除了children意外,清除所有的数据
			for(var key in dataObject){
				if(key != "children" && key!="objectClass"){
					delete dataObject[key];
				}
			}
		}
		//取值
		jQuery.each( arrProperties , function(i, n){
			var sArgName = jQuery(n).attr("id").split("_")[1];
			var sArgValue = "";
			if(n.type == "checkbox" || n.type == "radio" ){
				if(n.checked){
					sArgValue = n.checked;
				}
			}else if(n.type == "hidden"){
				sArgValue = jQuery(n).data("value");
			}else if(n.id == "model_name"){ //保存model的数据交换关系,之所以插在这里是为了在id确定好以后再处理,以防id混乱
				sArgValue = jQuery(n).val();
				var widgetcolumbmap = $("#model_widgetcolumbmap").data("widgetcolumbmap");
				if(widgetcolumbmap == undefined){
					delete ormTableColumn[sArgValue];
				}
				ormTableColumn[sArgValue] = widgetcolumbmap;
			}else{
				sArgValue = jQuery(n).val();
			}
			if(sArgName!="submit"){
				dataObject[sArgName] = sArgValue;
			}
		});
		//修正对象列表中的ID和text
		var name = jQuery("#"+sSubmitType+"_property .object_name").val();
		aSelected.attr("id",escapeId(name)).find("td b").text(name);
		//数据保存到tr对象
		//aSelected.data("property",dataObject);
		 fdsfsdtreeData = treeData;
		 namespaceData = namespaceData;
		 controllerNames = controllerNames;
		 extensionName = extensionName;
	});
	//json  toJSON(objectData);  jQuery.evalJSON(
												 
	//widget 类型选择
	jQuery("#widget_classname").live("change",function(){
		widgetTypeChange(null);												   
	});
	
	//添加optoions
	jQuery("#add_option").click(function(){
		jQuery(this).parents("tr").before('<tr><td class="options"></td><td class="options"></td><td><input type="checkbox" class="nosave"/></td><td><a class="del_option" title="点击删除选项" href="#">删</a></td></tr>');
		return false;
	});
	
	//可编辑表格
	jQuery("#widget_options_table .options").live("click" , function(){
		var aTd = jQuery(this);
		var sTdText = aTd.text();
		aTd.text("").append('<input type="text" value="'+sTdText+'"/>');
		var aNewInput = aTd.find("input");
		aNewInput.focus();
		aNewInput.live("focusout",function(){
			var sNewValue = jQuery(this).val();
			aTd.text(sNewValue);
			saveOptionsData();
		});
	});
	//删除可编辑表格的行
	jQuery("#widget_options_table .del_option").live("click",function(){
		jQuery(this).parents("tr").remove();
		saveOptionsData();
	});
	//select的options数据的保存行为通过3个行为触发,1.是编辑表格后触发,2.是点击"选中"checkbox后触发,3.是删除时触发 可以搜索函数名saveOptionsData找到所有的触发点 
	//这里处理"选中"checkbox的触发情况
	jQuery("#widget_options_table td input:checkbox").live("click",function(){
		saveOptionsData();
	});
	//保存option数据到widget_options的data中
	function saveOptionsData(){
		var arrOptions = [];
		$.each($("#widget_options_table tbody tr"),function(i,n){
			var arrAOption = [];
			if($(n).attr("id") == "modeify_options"){
				return true;
			}
			$.each( $(n).find("td") , function(v,b){
				// 前三个td记录有用的数据,最后一个没有用,前2个是text和value,第3个是是否选中
				if(v < 2){ 
					arrAOption.push($(b).text());
				}else if(v == 2){
					arrAOption.push($(b).find("input:checkbox").prop("checked"));
				}
			});
			arrOptions.push(arrAOption);
		});
		$("#widget_options").data("value",arrOptions);
	}
	
	//恢复widget_options的值还有widget_option_table的值
	function rebuildOptionTable(aHiddenWidget,arrValue){
		if(arrValue == undefined){
			return;
		}
		clearOptionsTable($("#widget_options_table"));
		aHiddenWidget.data("value",arrValue);
		jQuery.each(arrValue,function(i,n){
			var sSelected = "";
			if(n[2]){
				sSelected = 'checked = "checked"';
			}
			jQuery("#widget_options_table #modeify_options").before('<tr><td class="options">'+n[0]+'</td><td class="options">'+n[1]+'</td><td><input type="checkbox" class="nosave" '+sSelected+'/></td><td><a class="del_option" title="点击删除选项" href="#">删</a></td></tr>');
		});
	}
	//清空"#widget_options_table表
	function clearOptionsTable(aOptionsTable){
		aOptionsTable.find('tbody tr[id!="modeify_options"]').remove();
	}
	//处理特殊的widget值,比如input:hidden
	function giveValueToHiddenWidget(aArgWidget,sValue){
		if(aArgWidget[0].id == "widget_options" ){
			rebuildOptionTable($(aArgWidget[0]),sValue);
		}
		if(aArgWidget[0].id == "model_orm-data" ){
			rebuildOrmProperty();
			getPropertyForOrm($(aArgWidget[0]),sValue);
		}
		if(aArgWidget[0].id == "view_dataexchange" ){
			// if(dataExchange == undefined){
				// return false;
			// }
			rebuildDataExchangeData(sValue);
		}
	}
	
	//
	jQuery("#verifier_class").live("change",function(){
		rebuildVerifierProperty($(this).val());
	});
	
	//恢复verifier表单
	function rebuildVerifierProperty(sType){
		if(sType == "Length"){
			clearVerifierProperty().append('<label for="verifier_min">从</label><input id="verifier_min" type="text" size="3"/><label for="verifier_max">到</label><input id="verifier_max" type="text"  size="3"/><br/>');
		}else if(sType == "Number"){
			clearVerifierProperty().append('<label for="verifier_bint">整数 ?</label><input id="verifier_bint" type="checkbox" /><br/>');
		}else{
			clearVerifierProperty();
		}
	}
		
	//清空verifier辅助表单
	function clearVerifierProperty(){
		var property = jQuery("#verifier_more_property");
		property.html("");
		return property;
	}
	
	
	
	
	//选择orm关系的起点
	jQuery("#model_orm-start").live("change",function(){
		rebuildOrmProperty();
	});
	//恢复model的orm表单
	function rebuildOrmProperty(){
		$("#model_orm_div").html('');
		if(jQuery("#model_orm-start").val() != 0){
			addOrmTree($("#model_orm_div"),jQuery("#model_orm-start").val());
		}
	}
	//添加一层orm关系
	function addOrmTree(target,sOrmTop){
		var sOrm = '<ul>';
		$.each(ormData[sOrmTop]['assoc'],function(i,v){
			sOrm+='<li><b>'+i+'</b></li>';
			$.each(v,function(c,b){
				var id=getIdForOrm();
				sOrm+='<li><input type="checkbox" class="nosave" id="'+b['name']+'|'+id+'" value="'+b['prop']+'"/><label for="'+b['name']+'|'+id+'">'+b['prop']+'('+b['name']+')'+'</label></li>';
			});
		});
		sOrm += '</ul>';
		target.append(sOrm);
	}
	//用户请求添加一层orm关系
	$("#model_orm_div input:checkbox").live("click",function(){
		if($(this).prop("checked")){
			//添加层次
			addOrmTree($(this).parents("li").first(),$(this).attr("id").split("|")[0]);
			var aOrmTreeData = getOrmTreeData($("#model_orm_div > ul"),'');
			$("#model_orm-data").data("value",aOrmTreeData[0]);
			$("#model_widgetcolumbmap").data("widgetcolumbmap",aOrmTreeData[1]) ;
		}else{
			//删除层次
			$(this).nextAll("ul").remove();
			//如果表单中有完整的树结构(至少有一个checkbox被选中)就建立数据给model_orm-data,如果没有,删除以前的数据
			if($("#model_orm_div").find("input:checked").length > 0){
				var aOrmTreeData = getOrmTreeData($("#model_orm_div > ul"),'');
				$("#model_orm-data").data("value",aOrmTreeData[0]);
				$("#model_widgetcolumbmap").data("widgetcolumbmap",aOrmTreeData[1]) ;
			}else{
				$("#model_orm-data").removeData("value");
				$("#model_widgetcolumbmap").removeData("widgetcolumbmap") ;
			}
		}
	});
	//重建一层orm关系树数据,同时找出本次遍历的数据表的所有字段,组合成完整的带有orm关系的字段字符串
	//本函数的返回值是由前两者组合而成的数组,组合的目的仅仅是为了返回2个值
	//本函数是递归函数
	function getOrmTreeData(aStart,sLastPre){
		var aOrm = {}; //orm关系
		var arrChecked = aStart.children("li").children("input:checked");
		var aOrmTemp = {};
		var sToColumn = '';
		if(arrChecked.length > 0){
			$.each(arrChecked,function(i,v){
				var sOrmName = getTableName($(v));
				var sOrmProp = getTableProp($(v));
				var sWholePre = sLastPre+sOrmProp+".";
				var arrResult =  getOrmTreeData($(this).nextAll("ul"),sWholePre);
				aOrmTemp[sOrmProp] = arrResult[0];
				sToColumn = arrResult[1];
				$.each( ormData[sOrmName].columns , function(c,b){
					sToColumn = sToColumn+' '+sWholePre+b;
				});
			});
		}else{
			aOrm = aStart.prevAll("input:checked").val();
		}
		return [aOrmTemp,sToColumn];
	}
	//获取orm关系中表的name
	function getTableName(aOrm){
		return aOrm.attr("id").split("|")[0];
	}
	//获取orm关系中表的prop
	function getTableProp(aOrm){
		return aOrm.val();
	}
	//重建用户上一次输入的数据
	function getPropertyForOrm(aArgWidget,Value){
		if(Value == undefined){
			return;
		}
		var arrCheckboxs = [];
		if(aArgWidget.attr("id") == "model_orm-data"){
			aArgWidget = $("#model_orm_div > ul");
		}else{
			aArgWidget = aArgWidget.nextAll("ul");
		}
		arrCheckboxs = aArgWidget.children("li").children("input:checkbox");
		$.each(Value,function(i,v){
			$.each(arrCheckboxs,function(c,d){
				if($(d).val() == i){
					$(d).attr("checked","checked");
					//恢复表单
					addOrmTree($(d).parents("li").first(),$(d).attr("id").split("|")[0]);
					//递归
					getPropertyForOrm($(d),v);
				}
			});
		});
	}
	
	//view数据交换
	$("#view_model").change(function(){
		$("#view_model_table tbody > tr").remove();
		addNewTrForDataExchange();
	});
	//删除tr
	$(".del_dbmap").live("click",function(){
		$(this).parents("tr").first().remove();
		saveDataExchangeData();
	});
	//数据保存
	$(".view_dbmap_widget, .view_dbmap_column").live("change",function(){
		saveDataExchangeData();
	});
	//数据保存
	function saveDataExchangeData(){
		var arrTr = $("#view_model_table tbody > tr");
		var arrValues = [];
		$.each( arrTr ,function(v,n){
			var arrSelect = $(n).find("select");
			var aValue = { "widget" : $(arrSelect[0]).val(), "column":$(arrSelect[1]).val() };
			arrValues.push( aValue );
		});
		$("#view_dataexchange").data("value",arrValues);
	}
	//恢复数据交换表单的数据
	function rebuildDataExchangeData(dataExchange){
		//清空tr
		$("#view_model_table > tbody").html("");
		
		//重建
		if(dataExchange == undefined){
			return false;
		} 
		$.each(dataExchange,function(v,d){
			addNewTrForDataExchange();
			//找到最后2个select分别赋值
			$("#view_model_table").find(".view_dbmap_column").last().val(d.column);
			$("#view_model_table").find(".view_dbmap_widget").last().val(d.widget);
		});
	}
	//根据用户操作新加一行tr
	$("#add_view_model_tr").click(function(){
		addNewTrForDataExchange();
		return false;
	});
	//新添加一行select
	function addNewTrForDataExchange(){
		var sModelId = $("#view_model").val();
		if(sModelId == 0){
			return;
		}
		var newTr = '<tr class="view_dbmap"><td>'
						+'<select class="view_dbmap_widget nosave">'
							+'<option value="0">选择控件...</option>'
						+'</select>'
					+'</td><td>'
						+'<select class="view_dbmap_column nosave">'
							+'<option value="0">选择字段...</option>'
						+'</select>'
					+'</td>'
					+'<td><a href="#" class="del_dbmap">删</a></td>'
				+'</tr>';
		$("#view_model_table").append(newTr);
		//初始化select
		initLastViewWidgetAndColumnSelect(sModelId);
	}
	//初始化数据关系widget和column选项
	function initLastViewWidgetAndColumnSelect(sModelId){
		//column
		var arrColumnOptions = ormTableColumn[sModelId].split(" ");
		$.each(arrColumnOptions,function(i,v){
			if(v != ""){
				$("#view_model_table").find(".view_dbmap_column").last().append('<option value="'+v+'">'+v+'</option>');
			}
		});
		//widget
		var aView = $(".selected");
		var arrSubNodes=[];
		arrSubNodes = getChildren(aView);
		var arrSubWidgets = [];
		if(arrSubNodes.length > 0){
			arrSubWidgets = findNodeFormChildren(arrSubNodes,"widget");
		}
		$.each(arrSubWidgets,function(c,b){
			var sWidgetId = $(b).attr("id");
			$("#view_model_table").find(".view_dbmap_widget").last().append('<option value="'+sWidgetId+'">'+sWidgetId+'</option>');
		});
	}
	
	//初始化数据交换关系表单中的model select
	function initViewDataExchangeSelect(aNode){
		var aController = getParentByType(aNode,"controller");
		var arrChildren = [];
		var arrSubModel = [];
		if(aController =='topController'){
			arrChildren = $("#toolpanel tbody > tr");
		}else{
			arrChildren = getChildren(aController);
		}
		arrSubModel = findNodeFormChildren(arrChildren,"model");
		//初始化select
		$("#view_model").find("option[value!='0']").remove();
		$.each(arrSubModel,function(v,b){
			var sModelId = $(b).attr("id");
			$("#view_model").append('<option value="'+sModelId+'">'+sModelId+'</option>');
		});
	}
	
	//初始化命名空间
	function initNameSpaceSelect(){
		for(var key in namespaceData){
			jQuery("#namespaceSelect").append("<option value='"+key+"'>"+key+"</option>");
		}
	}
	initNameSpaceSelect();
	
	//初始化controller选项
	function initControllerSelect(){
		for(var key in controllerNames){
			jQuery("#controller_classname").append("<option value='"+controllerNames[key]+"'>"+controllerNames[key]+"</option>");
		}
	}
	initControllerSelect();
	
	//初始化orm关系表
	function initOrmTopSelect(){
		for(var key in ormData){
			jQuery("#model_orm-start").append("<option value='"+key+"'>"+key+"</option>");
		}
	}
	initOrmTopSelect();
	
	//用ajax发送编译请求
	function generateCode(bDoSave){
		var encoded = $.toJSON(treeData);
		var url = window.location;
		var data = "&data="+encoded+"&act=generate";
		if(bDoSave){
			data += "&act.generate.save=1";
		}
		$.ajax({
			type: "POST",
			url: url,
			data: data,
			success: function(msg){
				$("#preview_div").html("").append(msg);
			}
		});
	}
	//只生成代码
	$("#generate_code").click(function(){
		generateCode(false);
	});
	//生成代码并保存
	$("#save_code").click(function(){
		generateCode(true);
	});
});