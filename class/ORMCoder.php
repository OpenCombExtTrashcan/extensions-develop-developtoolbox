<?php
namespace oc\ext\developtoolbox ;

use oc\ext\Extension;

use oc\mvc\model\db\orm\PAMap;

use jc\db\DB;
use jc\fs\Dir;
use jc\fs\File;
use jc\ui\xhtml\UIFactory;
use jc\ui\SourceFileManager;
use jc\util\HashTable;
use oc\ext\developtoolbox\coder\AbstractCoder;
use oc\ext\developtoolbox\coder\mvc\Controller as ControllerCoder;
use jc\io\OutputStreamBuffer;
use jc\mvc\model\db\orm\Association;
use oc\mvc\controller\Controller ;
use jc\mvc\view\DataExchanger ;
use jc\message\Message ;
use jc\mvc\model\db\Model;
use jc\verifier\Length;
use jc\verifier\Same;
use jc\verifier\Email;
use jc\verifier\NotEmpty;
use jc\verifier\Number;
use jc\mvc\view\widget\CheckBtn;
use jc\mvc\view\widget\Select;
use jc\mvc\view\widget\SelectList;
use jc\mvc\view\widget\Group;
use jc\mvc\view\widget\RadioGroup;
use jc\mvc\view\widget\Text;
use jc\mvc\view\widget\FileUpdate;
use jc\mvc\view\View;
use jc\mvc\model\db\orm\PrototypeAssociationMap;
use oc\base\FrontFrame;
use jc\mvc\controller\WebpageFrame;

class ORMCoder extends Controller
{
	protected function init()
	{
		//页面内容
		$this->createView('Form','ORMCoder.template.html') ;

		//数据
		$this->viewForm->variables()->set('aPam',PrototypeAssociationMap::singleton()) ;
		
		// 反射 orm 定义
		$arrOrmDefines = $this->reflectionExtensionsOrmDefine() ;
		$this->viewForm->variables()->set('sDefineOrmDefines',json_encode($arrOrmDefines)) ;
		
		// 反射 orm 配置
		$arrOrm = $this->reflectionOrm( $aPam = PrototypeAssociationMap::singleton() ) ;
		$this->viewForm->variables()->set('arrDefineOrm',$arrOrm) ;
		$this->viewForm->variables()->set('sDefineOrm',json_encode($arrOrm)) ;
		
		// 反射 数据表
		$arrTables = $this->reflectionDbTable() ;
		$this->viewForm->variables()->set('arrDefineDbTable',$arrTables) ;
		$this->viewForm->variables()->set('sDefineDbTable',json_encode($arrTables)) ;
		
		//反射
		$arrOrmType = Association::allAssociationTypes();
		$this->viewForm->variables()->set('arrDefineOrmType',$arrOrmType);
		$this->viewForm->variables()->set('sDefineOrmType',json_encode($arrOrmType));
	}

	public function process()
	{
		
		if($this->aParams->has('ajaxSaveData')){
			$arrOrm = json_decode($this->aParams->get('ajaxSaveData'),true);
			//得到数组字面量
			$arrOrmString = var_export($arrOrm, true);
			echo $arrOrmString;
			
		}
	}
	
	public function reflectionExtensionsOrmDefine()
	{
		$arrOrmDefines = array() ;
		$aPAMap = new _PAM() ;
		
		foreach($this->application()->extensions()->iterator() as $aExtension)
		{
			if( method_exists($aExtension, 'defineOrm') )
			{
				$aPAMap->clear() ;
				$aExtension->defineOrm($aPAMap) ;
				
				$arrOrmDefines[$aExtension->metainfo()->name()] = $this->reflectionOrm($aPAMap) ;
			}
			
			else
			{
				$arrOrmDefines[$aExtension->metainfo()->name()] = array() ;
			}
		}
		
		return $arrOrmDefines ;
	}

	public function reflectionOrm(PrototypeAssociationMap $aPam)
	{
		$arrOrm = array() ;
		
		foreach($aPam->modelNameIterator() as $sName)
		{
			$aPrototype = $aPam->modelPrototype($sName) ;
			
			$arrAssoc = array() ;
			foreach($aPrototype->associations() as $aAssoc)
			{
				$arrAssoc[] = array(
					
					'type' => $aAssoc->type() ,
					'prop' => $aAssoc->modelProperty() ,
					'fromKeys' => $aAssoc->fromKeys() ,
					'toKeys' => $aAssoc->toKeys() ,
					'bridgeFromKeys' => $aAssoc->bridgeFromKeys() ,
					'bridgeToKeys' => $aAssoc->bridgeToKeys() ,
					'bridgeTableName' => $aAssoc->bridgeTableName() ,
					'toPrototype' => $aAssoc->toPrototype()->name() ,
				) ;
			}
			
			@list($sExtName,$sOrmName) = explode(':', $sName) ;

			
			$arrOrm[$sExtName][$sOrmName] = array(
					'name' => $aPrototype->name() ,
					'extension' => $sExtName ,
					'title' => $sOrmName ,
					'table' => $aPrototype->tableName() ,
					'devicePrimaryKey' => $aPrototype->devicePrimaryKey() ,
					'primaryKeys' => $aPrototype->primaryKeys() ,
					'columns' => $aPrototype->columns() ,
					'asscociations' => $arrAssoc ,
			) ;
		}
		
		return $arrOrm ;
	}
	
	public function reflectionDbTable()
	{
		$arrTables = array() ;
		foreach($this->application()->extensions()->iterator() as $aExtension)
		{
			$arrTables[$aExtension->metainfo()->name()] = array() ;
		}
		
		foreach(DB::singleton()->query("show tables ;") as $arrRowTable)
		{
			$sTable = array_shift($arrRowTable) ;
			list($sExtensionName,$sTableName) = self::getExtensionFromTableName($sTable) ;
			if( !$sExtensionName or !$sTableName )
			{
				continue ;
			}
			
			$arrTables[$sExtensionName][$sTable] = array(
					'name' => $sTableName ,
					'primaryKey' => null ,
					'title' => $sTableName ,
			) ;
			
			foreach(DB::singleton()->query("show columns from ".$sTable) as $arrClm)
			{
				$arrTables[$sExtensionName][$sTable]['columns'][] = $arrClm['Field'] ;
				
				if($arrClm['Key']=='PRI')
				{
					$arrTables[$sExtensionName][$sTable]['primaryKey'] = $arrClm['Field'] ;
				}
			}
		}
				
		return $arrTables ;		
	}
	
	static public function getExtensionFromTableName($sTableName)
	{
		$nPos = strpos($sTableName,'_') ;
		if(!$nPos)
		{
			return array(null,null) ;
		}
		
		return array(substr($sTableName,0,$nPos),substr($sTableName,$nPos+1)) ;
	}
	
	
    public function createFrame()
    {
    	return new WebpageFrame() ;
    }
}


class _PAM extends PAMap
{
	public function addOrm(array $arrOrm,$bCheck=true)
	{
		$arrStack = debug_backtrace() ;
		array_shift($arrStack) ;
		$sExtension = Extension::retraceExtensionName($arrStack) ;
		
		parent::addOrm($arrOrm,$bCheck,$sExtension) ;
		
		PAMap::transFullOrmNameForCfg( $arrOrm, $sExtension ) ;
		$this->arrNewDefines[] = $arrOrm['name'] ;
	}
	
	public function modelNameIterator()
	{
		return new \ArrayIterator( array_values($this->arrNewDefines) ) ;
	}
	
	public function clear()
	{
		$this->arrNewDefines = array() ;
	}
	
	private $arrNewDefines = array() ;
}
?>
