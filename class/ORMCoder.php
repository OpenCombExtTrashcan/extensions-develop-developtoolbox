<?php
namespace oc\ext\developtoolbox ;

use jc\db\DB;

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
		// 反射 orm 配置
		$arrOrm = $this->reflectionOrm() ;
		$this->view->variables()->set('sDefineOrm',json_encode($arrOrm)) ;
		
		// 反射 数据表
		$arrTables = $this->reflectionDbTable() ;
		$this->view->variables()->set('sDefineDbTable',json_encode($arrTables)) ;
	}

	public function reflectionOrm()
	{
		$arrOrm = array() ;
		
		$aPam = PrototypeAssociationMap::singleton() ;
		foreach($aPam->modelNameIterator() as $sName)
		{
			$aPrototype = $aPam->modelPrototype($sName) ;
			
			$arrAssoc = array() ;
			foreach($aPrototype->associations() as $aAssoc)
			{
				$arrAssoc[] = array(
					
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
			
			$arrOrm[] = array(
					'name' => $aPrototype->name() ,
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
			
			$arrTables[$sExtensionName][$sTableName] = array(
					'name' => $sTableName ,
					'primaryKey' => null ,
			) ;
			
			foreach(DB::singleton()->query("show columns from ".$sTable) as $arrClm)
			{
				$arrTables[$sExtensionName][$sTableName]['columns'][] = $arrClm['Field'] ;
				
				if($arrClm['Key']=='PRI')
				{
					$arrTables[$sExtensionName][$sTableName]['primaryKey'] = $arrClm['Field'] ;
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
	
}

?>