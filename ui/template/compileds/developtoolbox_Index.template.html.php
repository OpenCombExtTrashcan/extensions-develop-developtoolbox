  <link href="/extensions/developtoolbox/ui/css/developtoolbox.css" rel="stylesheet" type="text/css" />
  <script type="text/javascript">
  	var namespaceData = <?php echo eval("if(!isset(\$__uivar_sDefineNamespacesCode)){ \$__uivar_sDefineNamespacesCode=&\$aVariables->getRef('sDefineNamespacesCode') ;};
return \$__uivar_sDefineNamespacesCode;") ;?>;
	var controllerNames =<?php echo eval("if(!isset(\$__uivar_sDefineAllControllerClassesCode)){ \$__uivar_sDefineAllControllerClassesCode=&\$aVariables->getRef('sDefineAllControllerClassesCode') ;};
return \$__uivar_sDefineAllControllerClassesCode;") ;?>;
	var ormData = <?php echo eval("if(!isset(\$__uivar_sDefineModelsCode)){ \$__uivar_sDefineModelsCode=&\$aVariables->getRef('sDefineModelsCode') ;};
return \$__uivar_sDefineModelsCode;") ;?>;
  </script>
  <script type="text/javascript" src="/extensions/developtoolbox/ui/js/jquery.js"></script>
  <script type="text/javascript" src="/extensions/developtoolbox/ui/js/jquery.json-2.2.min.js"></script>
  <script type="text/javascript" src="/extensions/developtoolbox/ui/js/developtoolbox.js"></script>
<div id="right">
	<div id="preview">
		<h1>代码预览</h1>
		<div id="preview_btns">
			<button id="generate_code">生成</button>
			<button id="save_code">保存</button>
		</div>
		<div id="preview_div">
			
			
		</div>
  	</div>
</div>
<div id="main">
	<div id="namespace">
		<label for="namespaceSelect">编辑命名空间: </label>
		<select id="namespaceSelect">
			<option value="0">选择命名空间...</option>
			<!-- 命名空间数据放在这里 -->
		</select>
		\
		<input id="className" type="text" />
	</div>
	<div><b>命名空间:</b><span id="namespaceComplete">还没有确定命名空间...</span></div>
    <div id="leftBottom">
		<div id="toolPanelButtons">
			<a id="add_controller" class="addButtons" href='#' title='添加Controller对象'>+<span class='controller'></span></a>
			<a id="add_view" class="addButtons" href='#' title='添加View对象'>+<span class='view'></span></a>
			<a id="add_widget" class="addButtons add_btn_disabled" href='#' title='添加Widget对象'>+<span class='widget'></span></a>
			<a id="add_verifier" class="addButtons add_btn_disabled" href='#' title='添加Verifier对象'>+<span class='virifier'></span></a>
			<a id="add_model" class="addButtons" href='#' title='添加Model对象'>+<span class='model'></span></a>
			<a id="deleteBtn" href='#' title='删除对象'>-<span class='delete'></span></a>
		</div>
		
		<div id="property">
            <div id='controller_property' class="propertys">
				<h1>控制器属性</h1>
				<label for="controller_name">名称:</label><input id="controller_name" type="text" class="object_name" /><br />
                <label for="controller_classname">类名:</label>
                <select id="controller_classname">
                    <option value="0">请选择对象名...</option>
                </select><br />
                <input id="controller_submit" class="submitBtn" type="button" value="保存" />
            </div>
            <div id='view_property' class="propertys">
            	<h1>视图属性</h1>
                <label for="view_name">名称:</label><input id="view_name" type="text" class="object_name" /><br />
                <label for="view_template">模版:</label><input id="view_template" type="text" /><br />
                <label for="view_formview">表单视图 ? :</label><input id="view_formview" type="checkbox" value="true" /><br />
                <label for="view_model">数据交换对应的模型:</label>
                <select id="view_model">
                    <option value="0">请选择</option>
                </select><br />
                <table id="view_model_table">
					<thead>
						<th title="视图包含的控件" width=150>控件</th>
						<th title="控件对应的数据字段" width=350>字段</th>
						<th title="点击删除关系" width=16>删</th>
					</thead>
					<tbody>
						
					</tbody>
				</table>
				<a href="#" id="add_view_model_tr">添加</a><br />
				<input id="view_dataexchange" type="hidden" />
				<input id="view_submit" class="submitBtn" type="button" value="保存" />
			</div>
			<div id='widget_property' class="propertys">
				<h1>控件属性</h1>
				<label for="widget_classname">类名:</label>
                <select id="widget_classname">
                    <option value="0">请选择</option>
                    <option value="text">Text</option>
                    <option value="checkbtn">CheckBtn</option>
					<option value="group">Group</option>
                    <option value="radiogroup">RadioGroup</option>
					<option value="select">Select</option>
                </select><br />
                <label for="widget_id">ID:</label><input id="widget_id" type="text" class="object_name" /><br />
                <label for="widget_title">标题:</label><input id="widget_title" type="text" /><br />
				<div id="other_property">
					
				</div>
				<input id="widget_submit" class="submitBtn" type="button" value="保存" />
			</div>
            <div id='verifier_property' class="propertys">
            	<h1>校验器属性</h1>
                <label for="verifier_class">类名:</label>
                <select id="verifier_class" class="object_name">
                    <option value="0">请选择...</option>
                    <option value="Email">Email</option>
                    <option value="NotEmpty">NotEmpty</option>
					<option value="Length">Length</option>
					<option value="Number">Number</option>
					<option value="Same">Same</option>
                </select><br />
                <div id="verifier_more_property">
                	
                </div>
                <input id="verifier_submit" class="submitBtn" type="button" value="保存" />
            </div>
            <div id='model_property' class="propertys">
            	<h1>模型属性</h1>
                <label for="model_name">名称:</label><input id="model_name" type="text" class="object_name" /><br />
                <label for="model_orm-start">orm起点:</label>
                <select id="model_orm-start">
                    <option value="0">请选择...</option>
                </select><br />
                <div id="model_orm_outer_div">
                	<div id="model_orm_div">
                	
                	</div>
                </div>
                <input id="model_orm-data" type="hidden" />
                <input id="model_widgetcolumbmap" type="hidden" />
                <input id="model_submit" class="submitBtn" type="button" value="保存" />
            </div>
		</div>
		
		
		<div id="widget_property_store">
			<!-- 各个widget的附加属性, 当需要显示的时候会复制到propertys中,这里这是临时仓库 -->
			<div id="text_property" class="widget_propertys">
				<label for="widget_value">值:</label><input id="widget_value" type="text" /><br />
				<label for="widget_type">类型:</label>
				<select id="widget_type">
					<option value="0">请选择</option>
					<option value="single">单行</option>
					<option value="password">密码</option>
					<option value="multiple">多行</option>
				</select><br />
			</div>
			<div id="checkbtn_property" class="widget_propertys">
				<label for="widget_type">类型:</label>
				<select id="widget_type">
					<option value="0">请选择</option>
					<option value="radio">单选框</option>
					<option value="checkbox">多选框</option>
				</select><br />
			</div>
			<div id="group_property" class="widget_propertys">
				
			</div>
			<div id="radiogroup_property" class="widget_propertys">
				 
			</div>
			<div id="select_property" class="widget_propertys">
				<label for="widget_size">显示条目数量:</label><input id="widget_size" type="text" value="1" /><br />
				<label for="widget_multiple">多选 ?:</label><input id="widget_multiple" type="checkbox" /><br />
				<label>选项:</label><br />
				<input id="widget_options" type="hidden" />
				<table id="widget_options_table">
					<thead>
						<th title="选项显示的文本" width=100>文本</th>
						<th title="选项显示的值" width=110>值</th>
						<th title="选项是否选中" width=16>选</th>
						<th title="点击删除选项" width=16>删</th>
					</thead>
					<tbody>
						<tr id="modeify_options">
							<td><a id="add_option" href="#">添加</a></td>
							<td> </td>
							<td> </td>
							<td> </td>
						</tr>
					</tbody>
				</table>
			</div>
			
			<!-- end 各个widget的附加属性 -->
		</div>
		
		
		<div id="toolpanelDiv">
			<table id="toolpanel">
				<thead> 
				   <tr> 
					  <th class="nameColumn">Name</th> 
					  <th class="classColumn">Class</th> 
					  <th class="propertyColumn">Property</th> 
				   </tr> 
				</thead> 
				<tbody>
					<!-- 对象列表 -->
				</tbody>
			</table>
		</div>
		
    </div>

</div>