<?php
namespace oc\ext\developtoolbox\coder\mvc ;

use jc\io\IOutputStream;
use jc\ui\xhtml\UIFactory;
use jc\lang\Exception;
use oc\ext\developtoolbox\coder\CoderBase;

class ForModel extends CoderBase
{
	public function __construct($arrData,$arrNotEmptys=array())
	{
		parent::__construct($arrData,array('name')) ;			
	}
	
	public function generate(IOutputStream $aDev)
	{
		$sCode = "// create models -------------\r\n" ;
		$sCode.= '		$this->'.$this->arrData['name'] ;
			
		// 创建一个空模型
		if( empty($this->arrData['orm-start']) )
		{
			$sCode.= " = new Model(null" ;
			
			if(!empty($this->arrData['aggregation']))
			{
				$sCode.= ',true' ;
			}
			$sCode.= ") ;" ;
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
			
			$sCode.= " = Model::fromFragment('{$this->arrData['orm-start']}'{$this->arrData['orm-data']}" ;
			if(!empty($this->arrData['aggregation']))
			{
				if( empty($this->arrData['orm-data']) )
				{
					$sCode.= ',null' ;
				}
				$sCode.= ',true' ;
			}
			$sCode.= ") ;" ;
		}
		
		$aDev->write($sCode) ;
	}

}

?>