jQuery(function () {
	//配置
	var treeTableId = "#toolpanel";
	var treeTable = jQuery(treeTableId);
	var childClassPre = "child_of_"; //用来标记子node的class的前缀,暂时不要修改,会影响getParent函数

	var allowTypes = {
		"noselected" : Array('controller' , 'view' , 'widget' , 'model')
    ,"controller" : Array('controller' , 'view' , 'widget' , 'verifier' , 'model')
		,"view" : Array( 'view' , 'widget'  , 'model')
		,"widget" : Array( 'widget' , 'verifier' )
		,"verifier" : Array('')
		,"model" : Array('model')
	}
	
	//数据对象,测试用
	var treeData ={"name":"testname","class":"testclass" , "children":[]};
	
	//获得node的层级,顶级为0,顶级的子node就是1,孙node就是2,依次类推
	function getLevel(aNode){
		var classNames = aNode.attr("class").split(' ');
	  for(key in classNames) {
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
		jQuery( ".propertys" ).hide(0);
		var aPropertyPage = jQuery( "#" + getNodeType(aNode) + "_property" );
		aPropertyPage.show(0);
		//得到数据
		var aData = aNode.data("property");
		getProperties(aPropertyPage,aData);
	}
	
	//还原属性栏内容
	function getProperties(aPropertyPage,aData){
		//得到widget
		var arrProperty = getPropertyWidget(aPropertyPage);
		//复原widget的值
		$.each(arrProperty, function(i,n){
			var sArgId = $(n).attr("id");
			var sArgName = $(n).attr("id").split("_")[1];
			if(aData!=undefined){
				var sValue = aData[sArgName];
			}
			var aArgWidget = aPropertyPage.find("#"+sArgId);
			if(aArgWidget[0].type=="checkbox" || aArgWidget[0].type=="radio"){
				aArgWidget[0].checked = sValue;
			}else if( sArgName!="submit"){
				if(sValue != undefined){
					$(n).val(sValue);
				}else{
					$(n).val(null);
				}
			}
		});
	}
	
	//返回一个数组,包含propertypage的可提交控件的对象数组,比如input和select控件
	function getPropertyWidget(aPropertyPage){
		return aPropertyPage.find("input,select");
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
		var aNewNodeProperty = {"type":sNewType,"children":[]}
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
		return aNode.find("td span").attr("class");
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
		for(key in arrClasses){
			if(typeof(arrClasses[key])=="string" && arrClasses[key].match(childClassPre)){
				sParentId = arrClasses[key].split("_")[2];
			}
		}
		if(sParentId == ""){
			return false; //没有父node
		}
		return $("#"+sParentId);
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
	jQuery(treeTableId + " tr").live("click",function(){
		//选中
		setSelected(jQuery(this));
	});
	
	//属性提交
	jQuery(".submitBtn").live("click",function(){
		var aSelected = $(".selected");	
		var sSubmitBtnId = $(this).attr("id");	
		var sSubmitType = sSubmitBtnId.split("_")[0];
		var arrProperties = getPropertyWidget($("#"+sSubmitType+"_property"));
		var dataObject = {};
		if(aSelected.data("property")!=undefined){
			dataObject=aSelected.data("property");
		}
		//取值
		$.each( arrProperties , function(i, n){
			var sArgName = $(n).attr("id").split("_")[1];
			var sArgValue = "";
			if(n.type == "checkbox" || n.type == "radio" ){
				if(n.checked){
					sArgValue = n.checked;
				}
			}else{
				sArgValue = $(n).val();
			}
			if(sArgName!="submit"){
				dataObject[sArgName] = sArgValue;
			}
		});
		//修正对象列表中的ID和text
		var name = $("#"+sSubmitType+"_property .object_name").val();
		aSelected.attr("id",name).find("td b").text(name);
		//数据保存到tr对象
		//aSelected.data("property",dataObject);
		treeData = treeData;
	});
	//json  toJSON(objectData);  jQuery.evalJSON(
});