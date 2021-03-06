<?php
namespace oc\ext\developtoolbox\coder\mvc\widget ;

use jc\util\IHashTable;
use jc\io\IOutputStream;
use jc\lang\Exception;
use oc\ext\developtoolbox\coder\AbstractCoder;

class CheckBtn extends Widget
{	
	public function generate(IHashTable $aDevPool,IOutputStream $aDev=null)
	{
		$this->generateByUINgin('code_widget_checkbtn.template.php',$aDev,$aDevPool) ;
	}
	
	/**
	 * 生成的类
	 */
	public function detectClass()
	{
		return 'jc\\mvc\\view\\widget\\CheckBtn' ;
	}
	
}

?>