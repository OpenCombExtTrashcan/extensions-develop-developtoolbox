<?php
namespace oc\ext\developtoolbox\coder\mvc\widget ;

use jc\util\IHashTable;
use jc\io\IOutputStream;
use jc\lang\Exception;
use oc\ext\developtoolbox\coder\CoderBase;

class Select extends Widget
{
	public function generate(IHashTable $aDevPool,IOutputStream $aDev=null)
	{
		$this->generateByUINgin('code_widget_select.template.php',$aDev,$aDevPool) ;
	}
	public function generateOptions(IOutputStream $aDev)
	{
		if( empty($this->arrData['options']) )
		{
			return ;
		}
			
		$aDev->write("\r\n				// 为表单控件添加校验器") ;
		
		foreach($this->arrData['options'] as $arrOption)
		{
			$arrOption[0] = addslashes($arrOption[0]) ;
			$arrOption[1] = addslashes($arrOption[1]) ;
			$arrOption[2] = $arrOption[2]? ',true': '' ;

			$aDev->write("\r\n				->addOption('{$arrOption[0]}','{$arrOption[1]}'{$arrOption[2]})") ;
		}
	}
	
	/**
	 * 生成的类
	 */
	public function detectClass()
	{
		return $this->arrData['size']<=1? 'jc\\mvc\\view\\widget\\Select': 'jc\\mvc\\view\\widget\\SelectList' ;
	}
}

?>