<?php
namespace oc\ext\developtoolbox\coder\mvc ;

use jc\pattern\composite\Container;

use jc\io\OutputStreamBuffer;
use jc\io\IOutputStream;
use jc\lang\Exception;
use oc\ext\developtoolbox\coder\AbstractCoder;
use jc\util\IHashTable;

class Controller extends AbstractCoder
{
	public function __construct($arrData,$arrNotEmptys=array())
	{
		if( empty($arrData['filepath']) )
		{
			parent::__construct($arrData,array('classname')) ;	
		}
		else 
		{		
			parent::__construct($arrData,array('filepath','classname','namespace')) ;		
		}
	}
	
	public function generate(IHashTable $aDevPool,IOutputStream $aDev=null)
	{
		$aDev = new OutputStreamBuffer() ;
		$aDevPool[$this->arrData['filepath']] = $aDev ;
		
		$aUsedClasses = new Container() ;
		$aUsedClasses->add('oc\mvc\controller\Controller') ;
		$this->detectChildrenUsedClasses($aUsedClasses) ;
		
		$this->generateByUINgin('code_controller.template.php',$aDev,$aDevPool,array('aUsedClasses'=>$aUsedClasses)) ;
	}

	public function detectUsedClasses(Container $aClasses)
	{
		$aClasses->add($this->arrData['classname']) ;
		
		$this->detectChildrenUsedClasses($aClasses) ;
	}
	
}

?>