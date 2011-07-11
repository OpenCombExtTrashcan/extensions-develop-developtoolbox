{= "<?php\r\n" }
namespace {=$arrData['namespace']} ;

use oc\mvc\controller\Controller ;

class {=$arrData['classname']} extends Controller
{
	protected function init()
	{
		<foreach for="$theCoder->childrenIterator('model')" item='arrChild'><nl />
		{? ob_flush() }{? \oc\ext\developtoolbox\coder\mvc\ForModel::createInstance($arrChild)->generate($theDevice)}<clear />
		</foreach><nl /><clear />

		<foreach for="$theCoder->childrenIterator('view')" item='arrView'><clear />
		{? $arrView['belongsController']='controller' }<clear />
		{? ob_flush() }<clear />
		{? \oc\ext\developtoolbox\coder\mvc\ForView::createInstance(array($arrView))->generate($theDevice)}<clear />
		</foreach><nl />
		
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