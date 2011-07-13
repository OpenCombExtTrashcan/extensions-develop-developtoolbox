{= "<?php\r\n" }
namespace {=$arrData['namespace']} ;

use oc\mvc\controller\Controller ;

class {=$arrData['classname']} extends Controller
{
	protected function init()
	{
		{? $aIter=$theCoder->childrenIterator('model'); }<clear />
		<if "$aIter->valid()"><clear />
		// ---------------------------------------------
		// 创建模型<clear />
		<foreach for="$aIter" item='arrChild'><nl />
		{? ob_flush() }{? \oc\ext\developtoolbox\coder\mvc\Model::createInstance(array($arrChild))->generate($theDevice)}<clear />
		</foreach><nl /><clear />

		</if><nl />
		{? $aIter=$theCoder->childrenIterator('view'); }<clear />
		<if "$aIter->valid()"><clear />
		// ---------------------------------------------
		// 创建视图<clear />
		<foreach for="$aIter" item='arrView'><nl /><clear />
		{? $arrView['belongsController']='1' }<clear />
		{? ob_flush() }{? \oc\ext\developtoolbox\coder\mvc\View::createInstance(array($arrView))->generate($theDevice)}<clear />
		</foreach><nl />

		</if><nl />
		
		{? $aIter=$theCoder->childrenIterator('controller'); }<clear />
		<if "$aIter->valid()"><clear />
		// create child controllers -------------<clear />
			<foreach for="$aIter" item='arrChild'><nl />
		$this->add( $this->{=$arrChild['name']} = new {=$arrChild['classname']}() ) ;<clear />
			</foreach><nl />
		</if><nl />
	}

	public function process()
	{
	}
	

}

{= '?>' }