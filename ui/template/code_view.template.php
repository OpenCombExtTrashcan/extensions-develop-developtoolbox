		// -- 视图: {=$arrData['name']}<nl />
		<if "!empty($arrData['belongsController'])"><clear />
		$this->createView('{=$arrData['name']}','{=$arrData['template']}','{=$arrData['class']}') ;<clear />
		<else /><clear />
		$this->{=$arrData['name']} = new {=$arrData['class']}('{=$arrData['name']}','{=$arrData['template']}') ;<clear />
		</if><clear />
		{? $iter = $theCoder->childrenIterator('widget') }<clear />
		<if "$iter->valid()"><clear />
		<foreach for="$iter" item='arrWidget' ><nl /><clear />
		{? ob_flush(); }{? \oc\ext\developtoolbox\coder\mvc\widget\Widget::create($arrWidget,'$this->'.$arrData['name'],$theCoder->widgetExchangeDataName($arrWidget['id']))->generate($theDevice) }<clear />
		</foreach>
		</if><clear />
		{? $iter = $theCoder->childrenIterator('view') }<clear />
		<if "$iter->valid()"><nl /><clear />
		<foreach for="$iter" item='arrView' ><nl /><clear />
		{? $arrView['belongsView']='1' }<clear />
		{? ob_flush() }{? \oc\ext\developtoolbox\coder\mvc\View::createInstance(array($arrView))->generate($theDevice)}
		$this->{=$arrData['name']}->add($this->{=$arrView['name']}) ; // 建立视图“父子”关系<clear />
		</foreach><clear />
		</if><nl /><clear />
		<if "$arrData['model']">
		$this->{=$arrData['name']}->setModel($this->{=$arrData['model']}) ;<nl /><clear />
		</if><nl /><clear />