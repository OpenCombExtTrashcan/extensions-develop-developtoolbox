<?php
namespace oc\ext\developtoolbox\coder\mvc ;

use jc\io\IOutputStream;
use jc\lang\Exception;
use oc\ext\developtoolbox\coder\CoderBase;

class ForController extends CoderBase
{
	public function __construct($arrData,$arrNotEmptys=array())
	{
		parent::__construct($arrData,array('filename','classname','namespace')) ;			
	}
	
	public function generate(IOutputStream $aDev)
	{
		$this->generateByUINgin('code_controller.template.php',$aDev) ;
	}
	
}

?>