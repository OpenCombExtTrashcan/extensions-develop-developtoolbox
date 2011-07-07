<?php
namespace oc\ext\developtoolbox\coder\mvc ;

use jc\io\OutputStreamBuffer;
use jc\io\IOutputStream;
use jc\ui\xhtml\UIFactory;
use jc\lang\Exception;
use oc\ext\developtoolbox\coder\CoderBase;

class ForModel extends CoderBase
{
	public function generate(array $arrData,IOutputStream $aDev)
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
		if( empty($arrData['orm-data']) )
		{
			$arrData['orm-data'] = '' ;
		}
		
		else 
		{
			$arrData['orm-data'] = ','.$fnGenerateOrmFragmentCode($arrData['orm-data'],$fnGenerateOrmFragmentCode) ;
		}
		
		$sCode = '$this->'.$arrData['name'] ;
		$sCode.= " = Model::fromFragment('{$arrData['orm-start']}'{$arrData['orm-data']}) ;" ;
		
		$aDev->write($sCode) ;
	}

}

?>