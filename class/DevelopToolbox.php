<?php
namespace oc\ext\developtoolbox ;

use oc\ext\Extension;

class DevelopToolbox extends Extension
{
	public function load()
	{
		///////////////////////////////////////
		// 向系统添加控制器
		$this->application()->accessRouter()->addController("oc\\ext\\developtoolbox\\MVCCoder",'coder.mvc') ;
		$this->application()->accessRouter()->addController("oc\\ext\\developtoolbox\\ORMCoder",'coder.orm') ;
	}
}
?>