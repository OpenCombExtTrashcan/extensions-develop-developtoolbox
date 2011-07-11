<?php
namespace oc\ext\developtoolbox\coder ;

use jc\io\IOutputStream;
use jc\lang\Object;
use jc\ui\xhtml\UIFactory;
use jc\lang\Exception;

abstract class CoderBase extends Object implements ICoder
{
	public function __construct($arrData,$arrNotEmptys=array())
	{
		foreach( $arrNotEmptys as $sKey )
		{
			if( empty($arrData[$sKey]) )
			{
				throw new Exception("缺少必要的数据：%s",$sKey) ;
			}
		}
		
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
	
	protected function generateByUINgin($sTemplate,IOutputStream $aDev)
	{
		$aUI = UIFactory::singleton()->create() ;
		
		$aUI->variables()->setRef('arrData',$this->arrData) ;
		$aUI->variables()->set('theCoder',$this) ;
		
		$aUI->display($sTemplate,null,$aDev) ;
	} 
	
	protected $arrData = array() ;
}

?>