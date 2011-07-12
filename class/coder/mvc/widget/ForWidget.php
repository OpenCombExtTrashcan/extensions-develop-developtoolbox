<?php
namespace oc\ext\developtoolbox\coder\mvc\widget ;

use jc\lang\Object;

use jc\io\IOutputStream;
use jc\lang\Exception;
use oc\ext\developtoolbox\coder\CoderBase;

abstract class ForWidget extends CoderBase
{
	private static $mapWidgetCoders = array(
			'text' => 'oc\\ext\\developtoolbox\\coder\\mvc\\widget\\ForWidgetText' ,
			'checkbtn' => '' ,
			'group' => '' ,
			'radiogroup' => '' ,
			'select' => '' ,
		
	) ;	
	
	public function create($arrData,$sViewVarName=null)
	{
		if($sViewVarName)
		{
			$arrData['view_var'] = $sViewVarName ;
		}
		
		return Object::createInstance(array($arrData), null, self::$mapWidgetCoders[$arrData['widget_type']] ) ;
	}
	
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
		return $this->arrData['view_var'] ;
	}
}

?>