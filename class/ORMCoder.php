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
		
		// 反射 orm 配置
		$arrOrm = $this->reflectionOrm() ;
		$this->viewForm->variables()->set('arrDefineOrm',$arrOrm) ;
		$this->viewForm->variables()->set('sDefineOrm',json_encode($arrOrm)) ;
		
		// 反射 数据表
		$arrTables = $this->reflectionDbTable() ;
		$this->viewForm->variables()->set('arrDefineDbTable',$arrTables) ;
		$this->viewForm->variables()->set('sDefineDbTable',json_encode($arrTables)) ;
		
		//所有的扩展名
		$arrExtends = array_keys($arrOrm); 
		
		//整理请求参数
		$sDO =  $this->aParams->has('do') ? $this->aParams->get('do') : 'new';						//请求分类
		$sExtend = $this->aParams->has('ext') ? $this->aParams->get('ext') : $arrExtends[0] ;    //请求的扩展名,如果不存在就给与默认的扩展名
		$sOrmTitle = $this->aParams->has('title') ? $this->aParams->get('title') : "";  		//指定orm的名字
		
		$sTableName = $sOrmTitle != '' ? $arrOrm[$sExtend][$sOrmTitle]['table'] : $this->getFirstTable($arrTables , $sExtend);                           //指定orm所属table
		$arrAllColumns = $arrTables[$sExtend][$sTableName]['columns'] ;																	//指定orm所属table的所有列
		$arrUsedColumns =  $sOrmTitle != '' ? $arrOrm[$sExtend][$sOrmTitle]['columns'] : '';										//指定orm所属table的使用到的列
		$arrPrimaryKey = $sOrmTitle != '' ?  $arrOrm[$sExtend][$sOrmTitle]['primaryKeys'] : '';									//指定orm的所有主键
		$sDevicePrimaryKey = $arrTables[$sExtend][$sTableName]['primaryKey'];		
		
		/*
		 * prototype 表单
		 * */
		
		$aExtend = new Select('extend','所属扩展') ;
		foreach($arrExtends as $sExt){
			$aExtend->addOption($sExt, $sExt);
		}
		$this->viewForm->addWidget( $aExtend );
		$aExtend->setValue($sExtend);

		
		$aOrmTable = new Select('table','表');
		foreach($arrTables[$sExtend] as $sTableName=>$aTable){
			$aOrmTable->addOption($aTable['title'], $sTableName);
		}
		$this->viewForm->addWidget( $aOrmTable );
		if($sOrmTitle != ''){
			$aOrmTable->setValue($sTableName);
		}
		
		
		$aOrmTitle = new Text('ormTitle','表别名','',Text::single);
		$this->viewForm->addWidget( $aOrmTitle )
				->addVerifier(Length::flyweight(array(2,30))) ;
		if($sOrmTitle != ''){
			$aOrmTitle->setValue($arrOrm[$sExtend][$sOrmTitle]['title']);
		}
				
		//主键,列
		$arrColumns = $this->getColumns($arrOrm,$arrAllColumns,$arrPrimaryKey,$arrUsedColumns );
		$this->viewForm->variables()->set('arrDefineColumns',$arrColumns);
//			$this->viewForm->variables()->set('sDefineColumns',json_encode($arrColumns)) ;
		
		/*
		 * orm关系表单
		 * */
		
		//orm类型分类,用原生函数获取
		$arrOrmType = Association::allAssociationTypes();
		$aOrmType = new Select('ormType','orm关系');
		foreach($arrOrmType as $sOrmType){
			$aOrmType->addOption($sOrmType,$sOrmType);
		}
		$this->viewForm->addWidget( $aOrmType );
		
		$aOrmFromKey = new Select('ormFromKey','FromKey');
		$this->viewForm->addWidget( $aOrmFromKey );
		$aOrmBrigdeToKey = new Select('ormBrigdeToKey','BrigdeToKey');
		$this->viewForm->addWidget( $aOrmBrigdeToKey );
		$aOrmBrigdeFromKey = new Select('ormBrigdeFromKey','BrigdeFromKey');
		$this->viewForm->addWidget( $aOrmBrigdeFromKey );
		$aOrmToKey = new Select('ormToKey','ToKey');
		$this->viewForm->addWidget( $aOrmToKey );
		
		/*
		 * 数据还原
		 * */
		
		if($this->aParams->get('ormname')){
			$sExt = $this->aParams->get('ext');
			$sOrmname = $this->aParams->get('ormname');
		}
		
		
		
			//用户现在的行为
//		$this->viewForm->variables()->set('whatyoudoing', ) ;
	}

	public function process()
	{
		//整理orm列表的数据
	}
	
	//返回一个数组,数组中记录所给orm
	public function getColumns($arrOrm,$arrAllColumns,$arrPrimaryKey,$arrUsedColumns ){
		$arrColumns = array();
		foreach($arrAllColumns as $sColumn){
			$bIsPrimary = false;
			if($arrPrimaryKey != ''){
				$bIsPrimary = in_array($sColumn,$arrPrimaryKey);
			}
			$bIsUsedColumn = false;
			if($arrUsedColumns != ''){
				$bIsUsedColumn = in_array($sColumn,$arrUsedColumns);
			}
			$arrColumns[] = array($sColumn , $bIsPrimary , $bIsUsedColumn);
		}
		return $arrColumns;
	}
	
	//返回指定扩展下"第一个"table的全名
	public function getFirstTable($arrTables , $sExtend){
		$arrTablesTemp = array_keys($arrTables[$sExtend]) ;
		return array_shift($arrTablesTemp);
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

			$arrOrm[$sExtName][$sOrmName] = array(
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

?>
