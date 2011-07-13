<?php

namespace oc\ext\developtoolbox\coder\mvc\verifier ;

use jc\io\IOutputStream;
use jc\util\IHashTable;

class Length extends VerifierCoder
{
	public function generate(IHashTable $aDevPool,IOutputStream $aDev=null)
	{
		$nMin = intval($this->arrData['min']) ;
		$nMax = intval($this->arrData['max']) ;
		$aDev->write("\r\n				->addVerifer(Length::flyweight(array({$nMin},{$nMax})))") ;
	}
}

?>