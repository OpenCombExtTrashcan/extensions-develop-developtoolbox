<?php

namespace oc\ext\developtoolbox\coder\mvc\verifier ;

use jc\io\IOutputStream;

class Length extends VerifierCoder
{
	public function generate(IOutputStream $aDev)
	{
		$nMin = intval($this->arrData['min']) ;
		$nMax = intval($this->arrData['max']) ;
		$aDev->write("\r\n				->addVerifer(Length::flyweight(array({$nMin},{$nMax})))") ;
	}
}

?>