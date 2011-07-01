jQuery(function () {
	//配置
	var treeTableId = "#toolpanel";
	var treeTable = jQuery(treeTableId);
	var childClassPre = "child_of_"; //用来标记子node的class的前缀,暂时不要修改,会影响getParent函数
	var fileName = ""; //本页顶级controller的文件名
	var extensionName = ""; //本页顶级controller所属扩展的名字

	var allowTypes = {
		"noselected" : ['controller' , 'view' , 'widget' , 'model']
    	,"controller" : ['controller' , 'view' , 'model']
		,"view" : ['view' , 'widget'  , 'model']
		,"widget" : [ 'widget' , 'verifier' ]
		,"verifier" : ['']
		,"model" : ['model']
	}
	
	//数据对象
	treeData ={"filename":"","children":[]};
	
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
		// if(aNode == null){
			// widgetOtherPropertyGoBackToStore();
			// jQuery( ".propertys" ).hide(0);
			// return;
		// }
		var sNodeType = getNodeType(aNode);
		//如果是widget的属性页,把属性附表先隐藏
		if(sNodeType == "widget"){
			widgetOtherPropertyGoBackToStore();
		}
		//处理属性通用页面
		jQuery( ".propertys" ).hide(0);
		var aPropertyPage = jQuery( "#" + getNodeType(aNode) + "_property" );
		aPropertyPage.show(0);
		//得到数据
		var aData = aNode.data("property");
		getProperties(aPropertyPage,aData);
	}
	
	
	//还原属性栏内容
	function getProperties(aPropertyPage,aData){
		//先看看是不是widget类型,如果是widget类型,那么先组合附表单
		if( aData["objectClass"] == "widget" && aData["classname"] != undefined){  //处理select属性附属页面
			widgetTypeChange(aData["classname"]);
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
		return aPropertyPage.find("input,select");
	}
	
	//widget 的类型(比如;select,checkbox,text等)变化时触发
	function widgetTypeChange(widgetClass){
		var sWidgetClass = "";
		if(widgetClass == null){
			sWidgetClass = $("#widget_property #widget_classname").val();
		}else{
			sWidgetClass = widgetClass;
		}
		var sWidgetPropertyPageId = "#"+ sWidgetClass +'_property';
		widgetOtherPropertyGoBackToStore();
		jQuery(sWidgetPropertyPageId).appendTo($("#other_property")).show(0);											   
	}
	
	//widget的附属表单隐藏
	function widgetOtherPropertyGoBackToStore(){
		jQuery(".widget_propertys").appendTo($("#widget_property_store")).hide(0);
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
		var aNewNodeProperty = {"objectClass":sNewType,"children":[]}
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
		//setSelected( aNewNode );
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
		//alert(aNode.find("span").attr("class"));
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
	
	//获得子node , 返回子node对象数组,如果没有子node,返回false
	function getChildren(aNode){
		var arrChildren = [];
		var sNodeId = aNode.attr("id");
		var sChildrenClass = childClassPre+sNodeId;
		arrChildren = $("."+sChildrenClass);
		if(arrChildren.length <= 0){
			arrChildren = false;
		}
		return arrChildren;
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
			$.each(arrChildren,function(i,n){
				removeNode($(n));			  
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
		var aClassName = $("#className");
		var namespaceSelectValue = $("#namespaceSelect").val();
		//首字母大写
		aClassName.val(aClassName.val()[0].toUpperCase()+aClassName.val().substr(1));
		if(namespaceSelectValue == 0 || aClassName.val().length == 0){
			$("#namespaceComplete").addClass("noFileName").text("还没有确定命名空间...");
			treeData["filename"] = "";
			return;
		}else{
			var filepath = namespaceData[namespaceSelectValue]["folder"];
			fileName = filepath+'/'+aClassName.val()+".php";
			$("#namespaceComplete").removeClass("noFileName").text(fileName);
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
		jQuery("#view_template").val(extensionName + "_" +$(this).val()+".template.html");
	});
	
	//左侧按钮功能部分
	jQuery(".addButtons").click(function(){
		var selectedTr = treeTable.find(".selected");
		var sNewType = getBtnType(jQuery(this));
		if(selectedTr.length <= 0){
			//目前没有node,显示所有的btn
			makeNewNode(null,"newNode",sNewType);
			return;
		}
		makeNewNode(selectedTr,"newNode",sNewType);
		
	});
	
	//表格点击后..
	jQuery(treeTableId + " tbody tr").live("click",function(){
		//选中
		setSelected(jQuery(this));
	});
	
	//相应删除按钮
	$("#deleteBtn").click(function(){
		if(!confirm('确实要删除这个对象吗? \n\n所有的子对象都会被删除!!')){
			return ;	
		}
		var aSelected = $(".selected");
		if(aSelected.length <= 0){
			return;
		}
		removeNode(aSelected);
	});
	
	//属性提交
	jQuery(".submitBtn").live("click",function(){
		 var fdsfsdtreeData = treeData;
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
		 controllerNames= controllerNames;
		 extensionName = extensionName;
	});
	//json  toJSON(objectData);  jQuery.evalJSON(
												 
	//widget 类型选择
	jQuery("#widget_classname").live("change",function(){
		widgetTypeChange(null);												   
	});
	
	//初始化命名空间
	function initNameSpaceSelect(){
		for(var key in namespaceData){
			$("#namespaceSelect").append("<option value='"+key+"'>"+key+"</option>");
		}
	}
	initNameSpaceSelect();
	//初始化controller选项
	function initControllerSelect(){
		for(var key in controllerNames){
			$("#controller_classname").append("<option value='"+controllerNames[key]+"'>"+controllerNames[key]+"</option>");
		}
	}
	initControllerSelect();
	//初始化orm关系表
	
});