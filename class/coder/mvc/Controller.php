<?php
namespace oc\ext\developtoolbox\coder\mvc ;

use jc\mvc\model\db\orm\PrototypeAssociationMap;

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
		if(empty($arrData['classname']))
		{
			$arrData['classname'] = 'oc\mvc\controller\Controller' ;
		}
		
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
		$aUsedClasses->add("oc\\mvc\\controller\\Controller") ;
		$this->detectUsedClasses($aUsedClasses,true) ;
		
		$this->generateByUINgin('code_controller.template.php',$aDev,$aDevPool,array('aUsedClasses'=>$aUsedClasses)) ;
	}

	public function detectUsedClasses(Container $aClasses,$bIgnoreSelf=false)
	{
		if(!$bIgnoreSelf)
		{
			$aClasses->add($this->arrData['classname']) ;
		}
		
		if($this->childrenIterator('model')->valid())
		{
		}
		
		foreach($this->arrData['children'] as $arrChild)
		{
			if ($arrChild['coder']=='model')
			{
				$aClasses->add('oc\\mvc\\model\\Model') ;
				
				if($arrChild['generationLoadModel'])
				{
					$aClasses->add('jc\\mvc\\view\\DataExchanger') ;
				}
			}
			else if ($arrChild['coder']=='view' and $arrChild['generationProcessForm'] )
			{
				$aClasses->add('jc\\mvc\\view\\DataExchanger') ;
				$aClasses->add('jc\\message\\Message') ;
			}
		}
		
		$this->detectChildrenUsedClasses($aClasses) ;
	}
	
	public function generateProcessingCodeForLoadModel(array $arrModel,IOutputStream $aDev)
	{
		if( empty($arrModel['generationLoadModel']) )
		{
			return ;
		}
		
		// 聚合模型
		if( $arrModel['aggregation'] )
		{
			$aDev->write("\t\t// 为聚合模型载入数据:{$arrModel['name']}\r\n") ;
			$aDev->write("\t\t\$this->{$arrModel['name']}->load() ;\r\n") ;
		}
		
		else
		{
			if( empty($arrModel['orm-start']) or !$aModePrototype=PrototypeAssociationMap::singleton()->modelPrototype($arrModel['orm-start']) )
			{
				throw new Exception("模型(%s)ORM 无效。",$arrModel['name']) ;
			}
			$arrKeys = $aModePrototype->primaryKeys() ;
			
			$aDev->write("\t\t// 为模型载入数据:{$arrModel['name']}\r\n") ;
			$aDev->write("\t\t\$this->{$arrModel['name']}->load( \$this->aParams") ;
			
			if( count($arrKeys)>1 )
			{
				 $aDev->write("->values('" . implode("','",$arrKeys) . "')") ;
			}
			else 
			{
				 $aDev->write("['".$arrKeys[0]."']") ;
			}
				 
			$aDev->write(" ) ;	// 从控制器的参数中得到DB模型主键值\r\n") ;
		}
	}
	
	/**
	 * 生成的类
	 */
	public function detectClass()
	{
		return 'oc\\mvc\\controller\\Controller' ;
	}
}

?>