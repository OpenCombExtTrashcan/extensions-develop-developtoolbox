		<if "!empty($arrData['belongsController'])"><clear />
		$this->createView('{=addslashes($arrData['name'])}','{=addslashes($arrData['template'])}','{=$arrData['class']}') ;<clear />
		<else /><clear />
		{=$arrData['parent_var_name']}->add(new {=$theCoder->baseClassName($arrData['class'])}('{=$arrData['name']}','{=$arrData['template']}')) ;<clear />
		</if><clear />
		{? $iter = $theCoder->childrenIterator('widget') }<clear />
		<if "$iter->valid()"><clear />
		<foreach for="$iter" item='arrWidget' ><nl /><clear />
		{? ob_flush(); }{? \oc\ext\developtoolbox\coder\mvc\widget\Widget::create($arrWidget,'$this->view'.$arrData['name'],$theCoder->widgetExchangeDataName($arrWidget['id']))->generate($theOutputDevPool,$theDevice) }<clear />
		</foreach>
		</if><clear />
		{? $iter = $theCoder->childrenIterator('view') }<clear />
		<if "$iter->valid()"><clear />
		<foreach for="$iter" item='arrView' ><nl /><clear />
		{? $arrView['belongsView']='1' }<clear />
		{? ob_flush() }{? \oc\ext\developtoolbox\coder\mvc\View::create($arrView,'$this->view'.$arrData['name'])->generate($theOutputDevPool,$theDevice)}<clear />
		</foreach><clear />
		</if><clear />