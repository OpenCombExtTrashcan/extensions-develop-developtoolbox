<?php

namespace oc\ext\developtoolbox\coder\mvc\verifier ;

use jc\io\IOutputStream;

class Number extends VerifierCoder
{
	public function generate(IOutputStream $aDev)
	{
		$sInt = $this->arrData['bint']? 'true': 'false' ;
		$aDev->write("\r\n				->addVerifer(Number::flyweight(array({$sInt})))") ;
	}
}

?>