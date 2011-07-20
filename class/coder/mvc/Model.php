<?php
namespace oc\ext\developtoolbox\coder\mvc ;

use jc\io\IOutputStream;
use jc\util\IHashTable;
use jc\ui\xhtml\UIFactory;
use jc\lang\Exception;
use oc\ext\developtoolbox\coder\AbstractCoder;

class Model extends AbstractCoder
{
	public function __construct($arrData,$arrNotEmptys=array())
	{
		parent::__construct($arrData,array('name')) ;			
	}
	
	public function generate(IHashTable $aDevPool,IOutputStream $aDev=null)
	{
		$sCode = "// -- 模型:{$this->arrData['name']}\r\n" ;
		$sCode.= '		$this->createModel(' ;
			
		// 创建一个空模型
		if( empty($this->arrData['orm-start']) )
		{
			$sCode.= "null" ;
			
			if(!empty($this->arrData['aggregation']))
			{
				$sCode.= ',true' ;
			}
		}
		
		// 通过 orm 片段创建模型
		else 
		{
			$fnGenerateOrmFragmentCode = function($arrOrmData,$fnGenerateOrmFragmentCode)
			{
				$sCode = 'array(' ;
				
				$arrItems = array() ;
				foreach($arrOrmData as $name=>$property)
				{
					if( is_string($property) )
					{
						$arrItems[]= "'{$property}'" ;
					}
					else if( is_array($property) )
					{
						if(empty($property))
						{
							$arrItems[]= "'{$name}'" ;
						}
						else 
						{
							$arrItems[]= "'{$name}'=>" . $fnGenerateOrmFragmentCode($property,$fnGenerateOrmFragmentCode) ;
						}
					}
				}
				
				$sCode.= implode(',',$arrItems) ;
				$sCode.= ')' ;
				
				return $sCode ;
			} ;
		
			// -- --
			if( empty($this->arrData['orm-data']) )
			{
				$this->arrData['orm-data'] = '' ;
			}
			
			else 
			{
				$this->arrData['orm-data'] = ','.$fnGenerateOrmFragmentCode($this->arrData['orm-data'],$fnGenerateOrmFragmentCode) ;
			}
			
			$sCode.= "'{$this->arrData['orm-start']}'{$this->arrData['orm-data']}" ;
			if(!empty($this->arrData['aggregation']))
			{
				if( empty($this->arrData['orm-data']) )
				{
					$sCode.= ',null' ;
				}
				$sCode.= ',true' ;
			}
		}
		
			
		$sCode.= ",'{$this->arrData['name']}'" ;
		$sCode.= ") ;" ;
		
		$aDev->write($sCode) ;
	}
	
	/**
	 * 生成的类
	 */
	public function detectClass()
	{
		return 'oc\\mvc\\model\\Model' ;
	}
}

?>