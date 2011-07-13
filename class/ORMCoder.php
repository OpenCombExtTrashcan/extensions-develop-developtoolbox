<?php
namespace oc\ext\developtoolbox ;

use jc\fs\Dir;

use jc\fs\File;
use jc\ui\xhtml\UIFactory;

use jc\ui\SourceFileManager;
use jc\util\HashTable;
use oc\ext\developtoolbox\coder\AbstractCoder;
use oc\ext\developtoolbox\coder\mvc\Controller as ControllerCoder;
use jc\io\OutputStreamBuffer;
use jc\mvc\model\db\orm\PrototypeAssociationMap;
use jc\fs\FSOIterator;
use jc\system\ClassLoader;
use oc\base\FrontFrame;
use jc\db\sql\Select;
use oc\mvc\controller\Controller;

class ORMCoder extends Controller
{
	protected function init()
	{
		$this->add(new FrontFrame()) ;
		
		$this->createView('view','ORMCoder.template.html') ;
	}

	public function process()
	{
		
	}

	
}

?>