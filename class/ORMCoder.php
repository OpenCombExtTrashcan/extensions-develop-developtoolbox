<?php
namespace oc\ext\developtoolbox ;

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
use jc\ui\xhtml\Factory as UIFactory;
use jc\mvc\model\db\orm\PrototypeAssociationMap;
use oc\base\FrontFrame;
use jc\db\DB;

class ORMCoder extends Controller
{
	protected function init()
	{
		//页面内容
		$this->add(new FrontFrame()) ;

		$this->createView('view','ORMCoder.template.html') ;


		//数据
		// 反射 orm 配置
		$arrOrm = $this->reflectionOrm() ;
		$this->view->variables()->set('arrDefineOrm',$arrOrm) ;
		$this->view->variables()->set('sDefineOrm',json_encode($arrOrm)) ;
		
		// 反射 数据表
		$arrTables = $this->reflectionDbTable() ;
		$this->view->variables()->set('arrDefineDbTable',$arrTables) ;
		$this->view->variables()->set('sDefineDbTable',json_encode($arrTables)) ;
		
		/*
		 * prototype 部分
		 * */
		
		$this->view->addWidget( new Select('extend','所属扩展') );
		$this->view->addWidget( new Select('table','表') );
		$this->view->addWidget( new Text('tableProp','表别名','',Text::single) )
				->addVerifier(Length::flyweight(array(2,30))) ;
		
		$aPrimaryKey = new Select('primaryKey','主键');  // TODO 多个
		$this->view->addWidget( $aPrimaryKey );
		
		/*
		 * orm关系部分
		 * */
		//orm类型分类,用原生函数获取
		$arrOrmType = Association::allAssociationTypes();
		//array(4) { [0]=> string(6) "hasOne" [1]=> string(9) "belongsTo" [2]=> string(7) "hasMany" [3]=> string(19) "hasAndBelongsToMany" }
		$aOrmType = new Select('ormType','orm关系');
		foreach($arrOrmType as $sOrmType){
			$aOrmType->addOption($sOrmType,$sOrmType);
		}
		$this->view->addWidget( $aOrmType );
		
		$aOrmFromKey = new Select('ormFromKey','FromKey');
		$this->view->addWidget( $aOrmFromKey );
		$aOrmBrigdeToKey = new Select('ormBrigdeToKey','BrigdeToKey');
		$this->view->addWidget( $aOrmBrigdeToKey );
		$aOrmBrigdeFromKey = new Select('ormBrigdeFromKey','BrigdeFromKey');
		$this->view->addWidget( $aOrmBrigdeFromKey );
		$aOrmToKey = new Select('ormToKey','ToKey');
		$this->view->addWidget( $aOrmToKey );
		
		/*
		 * 数据还原
		 * */
		
		if($this->aParams->get('ormname')){
			$sExt = $this->aParams->get('ext');
			$sOrmname = $this->aParams->get('ormname');
		}
		
		
		
			//用户现在的行为
//		$this->view->variables()->set('whatyoudoing', ) ;
	}

	public function process()
	{
		//整理orm列表的数据
	}
	

	/**
	 * 执行控制器
	 */
//	public function process()
//	{
//
//		// ------------------------------------------
//		// 处理表单视图(ORMCoder)的提交
//		if( $this->ORMCoder->isSubmit() )
//		{do{
//			// 从控制器的参数中加载数据到视图的窗体中
//			$this->ORMCoder->loadWidgets() ;
//			
//			// 校验视图窗体中的数据
//			if( !$this->ORMCoder->verifyWidgets() )
//			{
//				break ;
//			}
//			
//			// 数据交换：从视图窗体到模型
//			$this->ORMCoder->exchangeData(DataExchanger::WIDGET_TO_MODEL) ;
//			
//			// 其他操作
//			// todo ... ...
//
//						
//		}while(1) ; }
//		// 处理表单结束
//		// ------------------------------------------
//	}

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
