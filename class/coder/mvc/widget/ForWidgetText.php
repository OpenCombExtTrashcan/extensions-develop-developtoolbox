<?php
namespace oc\ext\developtoolbox\coder\mvc\widget ;

use jc\io\IOutputStream;
use jc\lang\Exception;
use oc\ext\developtoolbox\coder\CoderBase;

abstract class ForWidgetText extends ForWidget
{	
	public function generate(IOutputStream $aDev)
	{
		$this->generateByUINgin('code_widget_text.template.php',$aDev) ;
	}
}

?>