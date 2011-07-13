<?php
namespace oc\ext\developtoolbox\coder\mvc\widget ;

use oc\ext\developtoolbox\coder\mvc\verifier\VerifierCoder;
use jc\lang\Object;
use jc\io\IOutputStream;
use jc\lang\Exception;
use oc\ext\developtoolbox\coder\AbstractCoder;
use jc\util\IHashTable;

abstract class Widget extends AbstractCoder
{
	private static $mapWidgetCoders = array(
			'text' => 'oc\\ext\\developtoolbox\\coder\\mvc\\widget\\Text' ,
			'checkbtn' => 'oc\\ext\\developtoolbox\\coder\\mvc\\widget\\CheckBtn' ,
			'group' => '' ,
			'radiogroup' => '' ,
			'select' => 'oc\\ext\\developtoolbox\\coder\\mvc\\widget\\Select' ,
		
	) ;	
	
	static public function create($arrData,$sViewVarName=null,$sExchageDataName=null)
	{
		if($sViewVarName)
		{
			$arrData['view_var'] = $sViewVarName ;
		}
		
		$arrData['exchange_data_name'] = $sExchageDataName ;
		
		return Object::createInstance(array($arrData), null, self::$mapWidgetCoders[$arrData['widgetType']] ) ;
	}
	
	public function viewVarName()
	{
		return $this->arrData['view_var'] ;
	}
	
	public function generateDataExchange()
	{
		if( empty($this->arrData['exchange_data_name']) )
		{
			return '' ;
		}
		
		else 
		{
			return ", '".addslashes($this->arrData['exchange_data_name'])."'" ;
		}
	}
	
	public function generateVerifiers(IHashTable $aDevPool,IOutputStream $aDev)
	{
		$aIter = $this->childrenIterator('verifier') ;
		if( $aIter->valid() )
		{
			$aDev->write("\r\n				// 为表单控件添加校验器") ;
			foreach($aIter as $arrVerifier)
			{
				VerifierCoder::create($arrVerifier)->generate($aDevPool,$aDev) ;
			}
		}
		
		$aDev->write(" ;") ;
	}
	
}

?>