{= "<?php\r\n" }
namespace {=$arrData['namespace']} ;

{? ob_flush() }{? $theCoder->generateClassesUse($aUsedClasses,$theDevice) }

class {=$arrData['classname']} extends Controller
{
	protected function init()
	{
		{? $aIter=$theCoder->childrenIterator('model'); }<clear />
		<if "$aIter->valid()"><clear />
		// ---------------------------------------------
		// 创建模型<clear />
		<foreach for="$aIter" item='arrChild'><nl />
		{? ob_flush() }{? \oc\ext\developtoolbox\coder\mvc\Model::createInstance(array($arrChild))->generate($theOutputDevPool,$theDevice)}<clear />
		</foreach><nl /><clear />
		</if><clear />
		
		{? $aIter=$theCoder->childrenIterator('view'); }<clear />
		<if "$aIter->valid()"><nl />
		// ---------------------------------------------
		// 创建视图<clear />
		<foreach for="$aIter" item='arrView'><nl /><clear />
		{? $arrView['belongsController']='1' }<clear />
		{? ob_flush() }{? \oc\ext\developtoolbox\coder\mvc\View::createInstance(array($arrView))->generate($theOutputDevPool,$theDevice)}<clear />
		<if "$arrView['model']"><nl />
		$this->{=$arrView['name']}->setModel($this->{=$arrView['model']}) ;<clear />
		</if><clear />
		</foreach><nl /><clear />
		</if><clear />
		
		{? $aIter=$theCoder->childrenIterator('controller'); }<clear />
		<if "$aIter->valid()"><nl />
		// create child controllers -------------<clear />
			<foreach for="$aIter" item='arrChild'><nl />
		$this->add( $this->{=$arrChild['name']} = new {=$arrChild['classname']}() ) ;<clear />
			</foreach><clear />
		</if><clear />
<nl />	}

	public function process()
	{
	}
	

}

{= '?>' }