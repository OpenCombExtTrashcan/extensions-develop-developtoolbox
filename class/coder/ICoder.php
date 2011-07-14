<?php
namespace oc\ext\developtoolbox\coder ;

use jc\pattern\composite\Container;
use jc\util\IHashTable;
use jc\io\IOutputStream;

interface ICoder 
{
	public function generate(IHashTable $aDevPool,IOutputStream $aDev=null) ;
	
	public function detectUsedClasses(Container $aClasses) ;
	
	/**
	 * 生成的类
	 */
	public function detectClass() ;
}

?>