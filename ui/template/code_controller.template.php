{= '<?php' } 
namespace {=$arrData['namespace']} ;

use oc\mvc\controller\Controller ;

class {=$arrData['classname']} extends Controller
{
	protected function init()
	{
		// create models <foreach for="$arrData['children']" item='arrChild'><if "$arrChild['coder']=='model'"> 
		{? ob_flush() }{? \oc\ext\developtoolbox\coder\mvc\ForModel::singleton()->generate($arrChild,$theDevice)} 
		</if></foreach> 
	}

	public function process()
	{
	}
	

}

{= '?>' }