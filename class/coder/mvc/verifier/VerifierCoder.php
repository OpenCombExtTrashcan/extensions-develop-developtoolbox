<?php
namespace oc\ext\developtoolbox\coder\mvc\verifier ;

use jc\lang\Object;
use jc\util\IHashTable;
use jc\io\IOutputStream;
use jc\lang\Exception;
use oc\ext\developtoolbox\coder\AbstractCoder;

class VerifierCoder extends AbstractCoder
{
	private static $mapVerifierCoders = array(
			'Email' => 'oc\\ext\\developtoolbox\\coder\\mvc\\verifier\\VerifierCoder' ,
			'Number' => 'oc\\ext\\developtoolbox\\coder\\mvc\\verifier\\Number' ,
			'Length' => 'oc\\ext\\developtoolbox\\coder\\mvc\\verifier\\Length' ,
			'Same' => 'oc\\ext\\developtoolbox\\coder\\mvc\\verifier\\VerifierCoder' ,
			'NotEmpty' => 'oc\\ext\\developtoolbox\\coder\\mvc\\verifier\\VerifierCoder' ,
	) ;
	
	static public function create($arrData)
	{
		return Object::createInstance(array($arrData), null, self::$mapVerifierCoders[$arrData['verifierType']] ) ;
	}
	
	public function generate(IHashTable $aDevPool,IOutputStream $aDev=null)
	{
		$aDev->write("\r\n				->addVerifer({$this->arrData['verifierType']}::singleton())") ;
	}
}

?>