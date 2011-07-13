<?php
namespace oc\ext\developtoolbox\coder\mvc\widget ;

use jc\util\IHashTable;
use jc\io\IOutputStream;
use jc\lang\Exception;
use oc\ext\developtoolbox\coder\AbstractCoder;

class Text extends Widget
{	
	public function generate(IHashTable $aDevPool,IOutputStream $aDev=null)
	{
		$this->generateByUINgin('code_widget_text.template.php',$aDev,$aDevPool) ;
	}
}

?>