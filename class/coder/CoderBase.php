<?php
namespace oc\ext\developtoolbox\coder ;

use jc\lang\Object;
use jc\ui\xhtml\UIFactory;

abstract class CoderBase extends Object implements ICoder
{
	public function __construct($arrData)
	{
		$this->arrData = $arrData ;
	}
	
	public function childrenIterator($sType)
	{
		$arrReqChildren = array() ;
		foreach($this->arrData['children'] as $arrChildData)
		{
			if($arrChildData['coder'] == $sType)
			{
				$arrReqChildren[] = $arrChildData ;
			}
		}
		
		return new \ArrayIterator($arrReqChildren) ;
	}
	
	protected function generateByUINgin($sTemplate)
	{
		$aUI = UIFactory::singleton()->create() ;
		
		$aUI->variables()->setRef('arrData',$this->arrData) ;
		$aUI->variables()->set('theCoder',$this) ;
		
		$aUI->display($sTemplate,null,$aDev) ;
	} 
	
	protected $arrData = array() ;
}

?>