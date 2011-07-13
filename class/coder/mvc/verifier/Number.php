<?php

namespace oc\ext\developtoolbox\coder\mvc\verifier ;

use jc\io\IOutputStream;
use jc\util\IHashTable;

class Number extends VerifierCoder
{
	public function generate(IHashTable $aDevPool,IOutputStream $aDev=null)
	{
		$sInt = $this->arrData['bint']? 'true': 'false' ;
		$aDev->write("\r\n				->addVerifer(Number::flyweight(array({$sInt})))") ;
	}
}

?>