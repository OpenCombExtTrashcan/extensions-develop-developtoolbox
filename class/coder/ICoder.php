<?php
namespace oc\ext\developtoolbox\coder ;

use jc\io\IOutputStream;

interface ICoder 
{
	public function generate(array $arrData,IOutputStream $aDev) ;
}

?>