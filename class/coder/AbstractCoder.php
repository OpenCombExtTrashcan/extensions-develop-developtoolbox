<?php
namespace oc\ext\developtoolbox\coder ;

use jc\pattern\composite\Container;
use jc\util\IHashTable;
use jc\io\IOutputStream;
use jc\lang\Object;
use jc\ui\xhtml\UIFactory;
use jc\lang\Exception;

abstract class AbstractCoder extends Object implements ICoder
{
	private static $mapVerifierCoders = array(
			'controller' => 'oc\\ext\\developtoolbox\\coder\\mvc\\Controller' ,
			'model' => 'oc\\ext\\developtoolbox\\coder\\mvc\\Model' ,
			'view' => 'oc\\ext\\developtoolbox\\coder\\mvc\\View' ,
			'widget' => 'oc\\ext\\developtoolbox\\coder\\mvc\\widget\\Widget' ,
			'verifier' => 'oc\\ext\\developtoolbox\\coder\\mvc\\verifier\\VerifierCoder' ,
	) ;
	
	public function __construct($arrData,$arrNotEmptys=array())
	{
		foreach( $arrNotEmptys as $sKey )
		{
			if( empty($arrData[$sKey]) )
			{
				throw new Exception("%s coder缺少必要的数据：%s",array(get_class($this),$sKey)) ;
			}
		}
		
		$this->arrData = $arrData ;
	}
	
	static public function create($arrData)
	{
		$sClass = get_called_class() ;
		
		if( $sClass==__CLASS__ )
		{
			if( $sClass=self::$mapVerifierCoders[$arrData['coder']] )
			{
				return $sClass::create($arrData) ;
			}
		}
		
		else 
		{
			return new $sClass($arrData) ;
		}
	}
	
	public function childrenIterator($types)
	{
		$types = $types? (array)$types: array() ;
		
		$arrReqChildren = array() ;
		foreach($this->arrData['children'] as $arrChildData)
		{
			if( in_array($arrChildData['coder'],$types) )
			{
				$arrReqChildren[] = $arrChildData ;
			}
		}
		
		return new \ArrayIterator($arrReqChildren) ;
	}
	
	protected function generateByUINgin($sTemplate,IOutputStream $aDev,IHashTable $aDevPool,array $arrVars=array())
	{
		$aUI = UIFactory::singleton()->create() ;
		
		$aUI->variables()->setRef('arrData',$this->arrData) ;
		$aUI->variables()->set('theCoder',$this) ;
		$aUI->variables()->set('theOutputDevPool',$aDevPool) ;
		
		foreach($arrVars as $sName=>$value)
		{
			$aUI->variables()->set($sName,$value) ;
		}
		
		$aUI->display($sTemplate,null,$aDev) ;
	} 
		
	public function detectUsedClasses(Container $aClasses)
	{
		$aClasses->add($this->detectClass()) ;
		
		$this->detectChildrenUsedClasses($aClasses) ;
	}
	protected function detectChildrenUsedClasses(Container $aClasses)
	{
		foreach($this->arrData['children'] as $arrChild)
		{
			AbstractCoder::create($arrChild)->detectUsedClasses($aClasses) ;
		}
	}
	
	public function generateClassesUse(Container $aClasses,IOutputStream $aDev)
	{
		foreach($aClasses->iterator() as $sClass)
		{
			$aDev->write("use {$sClass} ;\r\n") ;
		}
	}
	
	public function baseClassName($sFullClassname)
	{
		$nLastSlashPos = strrpos($sFullClassname, '\\') ;
		if($nLastSlashPos===false)
		{
			return $sFullClassname ;
		}
		
		return substr($sFullClassname,$nLastSlashPos+1) ;
	}
	
	protected $arrData = array() ;
}

?>