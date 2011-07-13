		<if "!empty($arrData['belongsController'])"><clear />
		$this->createView('{=addslashes($arrData['name'])}','{=addslashes($arrData['template'])}','{=$arrData['class']}') ;<clear />
		<else /><clear />
		$this->{=$arrData['name']} = new {=$arrData['class']}('{=$arrData['name']}','{=$arrData['template']}') ;<clear />
		</if><clear />
		{? $iter = $theCoder->childrenIterator('widget') }<clear />
		<if "$iter->valid()"><clear />
		<foreach for="$iter" item='arrWidget' ><nl /><clear />
		{? ob_flush(); }{? \oc\ext\developtoolbox\coder\mvc\widget\Widget::create($arrWidget,'$this->'.$arrData['name'],$theCoder->widgetExchangeDataName($arrWidget['id']))->generate($theOutputDevPool,$theDevice) }<clear />
		</foreach>
		</if><clear />
		{? $iter = $theCoder->childrenIterator('view') }<clear />
		<if "$iter->valid()"><clear />
		<foreach for="$iter" item='arrView' ><nl /><clear />
		{? $arrView['belongsView']='1' }<clear />
		{? ob_flush() }{? \oc\ext\developtoolbox\coder\mvc\View::createInstance(array($arrView))->generate($theOutputDevPool,$theDevice)}<nl />
		$this->{=$arrData['name']}->add($this->{=$arrView['name']}) ; // 建立视图“父子”关系<clear />
		</foreach><clear />
		</if><clear />