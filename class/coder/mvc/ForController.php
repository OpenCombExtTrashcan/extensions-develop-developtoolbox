<?php
namespace oc\ext\developtoolbox\coder\mvc ;

use jc\io\IOutputStream;
use jc\lang\Exception;
use oc\ext\developtoolbox\coder\CoderBase;

class ForController extends CoderBase
{
	public function generate(IOutputStream $aDev)
	{
		foreach( array('filename','classname','namespace') as $sKey )
		{
			if( empty($this->arrData[$sKey]) )
			{
				throw new Exception("缺少必要的数据：%s",$sKey) ;
			}
		}
		
		$this->generateByUINgin('code_controller.template.php') ;
	}
	
}

?>