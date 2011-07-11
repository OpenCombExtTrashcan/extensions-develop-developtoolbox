<?php
namespace oc\ext\developtoolbox\coder\mvc\widget ;

use jc\io\IOutputStream;
use jc\lang\Exception;
use oc\ext\developtoolbox\coder\CoderBase;

abstract class ForWidget extends CoderBase
{
	public function __construct($arrData,$arrNotEmptys=array())
	{
		parent::__construct(
				$arrData
				, array_merge(
					array('name','view_var') ,
					$arrNotEmptys
				)
		) ;
	}
	
	public function viewVarName()
	{
		
	}
}

?>