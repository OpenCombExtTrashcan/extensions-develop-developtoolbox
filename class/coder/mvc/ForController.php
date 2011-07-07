<?php
namespace oc\ext\developtoolbox\coder\mvc ;


use jc\io\OutputStreamBuffer;
use jc\io\IOutputStream;
use jc\ui\xhtml\UIFactory;
use jc\lang\Exception;
use oc\ext\developtoolbox\coder\CoderBase;

class ForController extends CoderBase
{
	public function generate(array $arrData,IOutputStream $aDev)
	{
		foreach( array('filename','classname','namespace') as $sKey )
		{
			if( empty($arrData[$sKey]) )
			{
				throw new Exception("缺少必要的数据：%s",$sKey) ;
			}
		}
		
		$aUI = UIFactory::singleton()->create() ;
		$aUI->variables()->setRef('arrData',$arrData) ;
		
		$aBuff = new OutputStreamBuffer() ;
		$aUI->display('code_controller.template.php',null,$aBuff) ;
		
		$aDev->write(highlight_string($aBuff->bufferBytes(),true)) ;
	}
	
}

?>