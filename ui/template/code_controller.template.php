{= "<?php\r\n" }
namespace {=$arrData['namespace']} ;

use oc\mvc\controller\Controller ;

class {=$arrData['classname']} extends Controller
{
	protected function init()
	{
		<if "$aIter=\oc\ext\developtoolbox\coder\mvc\ForController::singleton()->childrenIterator($arrData,'model')"><clear />
		// create models -------------<clear />
			<foreach for="$aIter" item='arrChild'><nl />
		{? ob_flush() }{? \oc\ext\developtoolbox\coder\mvc\ForModel::singleton()->generate($arrChild,$theDevice)}<clear />
			</foreach><clear />
		</if><nl />
		
		<foreach for="\oc\ext\developtoolbox\coder\mvc\ForController::singleton()->childrenIterator($arrData,'view')" item='arrView'><nl />
		{? $arrView['belongs']='controller' }<clear />
		{? ob_flush() }<clear />
		{? \oc\ext\developtoolbox\coder\mvc\ForView::singleton()->generate($arrView,$theDevice)}<clear />
		</foreach><nl />
		
		<if "$aIter=\oc\ext\developtoolbox\coder\mvc\ForController::singleton()->childrenIterator($arrData,'controller')"><clear />
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