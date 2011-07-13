{= "<?php\r\n" }<nl />
namespace {=$arrData['namespace']} ;

{? ob_flush() }{? $theCoder->generateClassesUse($aUsedClasses,$theDevice) }<nl />

class {=$arrData['classname']} extends {=basename(str_replace('\\','/',$arrData['class']))}<nl />
{
	public function __construct()
	{
		parent::__construct('{=addslashes($arrData['name'])}','{=addslashes($arrData['template'])}') ;<nl /><clear />

		{? $iter = $theCoder->childrenIterator('widget') }<clear />
		<if "$iter->valid()"><clear />
		<foreach for="$iter" item='arrWidget' ><nl /><clear />
		{? ob_flush(); }{? \oc\ext\developtoolbox\coder\mvc\widget\Widget::create($arrWidget,'$this',$theCoder->widgetExchangeDataName($arrWidget['id']))->generate($theOutputDevPool,$theDevice) }<clear />
		</foreach>
		</if><clear />
		{? $iter = $theCoder->childrenIterator('view') }<clear />
		<if "$iter->valid()"><clear />
		<foreach for="$iter" item='arrView' ><nl /><clear />
		{? $arrView['belongsView']='1' }<clear />
		{? ob_flush() }{? \oc\ext\developtoolbox\coder\mvc\View::createInstance(array($arrView))->generate($theOutputDevPool,$theDevice)}<nl />
		$this->add($this->{=$arrView['name']}) ; // 建立视图“父子”关系<clear />
		</foreach><nl /><clear />
		</if><nl />
	}
}

{= '?>' }