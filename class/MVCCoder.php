<?php
namespace oc\ext\developtoolbox ;

use oc\ext\developtoolbox\coder\mvc\ForController;

use jc\mvc\model\db\orm\PrototypeAssociationMap;
use jc\fs\FSOIterator;
use jc\system\ClassLoader;
use oc\base\FrontFrame;
use jc\db\sql\Select;
use oc\mvc\controller\Controller;

class MVCCoder extends Controller
{
	protected function init()
	{
		$this->add(new FrontFrame()) ;
		
		$this->createView('view','MVCCoder.template.html') ;
	}

	public function process()
	{
		// 生成代码
		if( $this->aParams->get('act')=='generate' )
		{
			$this->aParams->set('noframe',true) ;
			$this->view->disable() ;
			
			$arrData = json_decode($this->aParams->get('data'),true) ;
			
			// 这里需要一个 coder 管理器
			// todo
			ForController::singleton()->generate($arrData,$this->application()->response()->printer()) ;
		}
		
		else
		{
			
			// 反射 class namespace
			list($arrNamespacesInfo,$arrControllerClasses) = $this->scanExtensions( $this->application()->classLoader() ) ;
			
			$this->view->variables()->set('sDefineNamespacesCode',json_encode($arrNamespacesInfo)) ;
			$this->view->variables()->set('sDefineAllControllerClassesCode',json_encode($arrControllerClasses)) ;
	
			// 反射系统中的orm
			$arrModels = $this->scanOrm( PrototypeAssociationMap::singleton() ) ;
			$this->view->variables()->set('sDefineModelsCode',json_encode($arrModels)) ;
		
		}
	}

	public function scanExtensions(ClassLoader $aClassLoader)
	{
		$arrNamespacesInfo = array() ;
		$arrControllerClasses = array() ;
		
		foreach( $aClassLoader->namespaceIterator() as $sNamespace)
		{
			$sFolderPath = $aClassLoader->namespaceFolder($sNamespace) ;
			
			$arrPackages = explode('\\', $sNamespace) ;
			foreach($arrPackages as $idx=>$sPackage)
			{
				if( empty($sPackage) )
				{
					unset($arrPackages[$idx]) ;
				}
			}
			$arrPackages = array_values($arrPackages) ;
			
			if( count($arrPackages)<3 or $arrPackages[0]!='oc' or $arrPackages[1]!='ext' )
			{
				continue ;
			}
			$sExtensionName = $arrPackages[2] ;
			
			$arrNamespacesInfo[$sNamespace] = array(
				'folder' => $sFolderPath ,
				'extension' => $sExtensionName ,
			) ;
			
			$aIter = new FSOIterator($sFolderPath,(FSOIterator::FLAG_DEFAULT&(~FSOIterator::RETURN_PATH))|FSOIterator::RETURN_SUBPATH) ;
			$aIter->filters()->add(function ($sPath){
				if( strstr($sPath,'.svn/')===false )
				{
					return $sPath ;
				}
			}) ;
			
			// 遍历所有的扩展类包
			foreach($aIter as $sSubFolder)
			{
				// package
				if( $aIter->isDir() )
				{
					$sSubFolder = preg_replace('|[\\/]$|', '', $sSubFolder) ;
					
					$arrNamespacesInfo[$sNamespace.'\\'.str_replace('/','\\',$sSubFolder)] = array(
						'folder' => $sFolderPath.'\\'.$sSubFolder ,
						'extension' => $sExtensionName ,
					) ;
				}
				
				// class
				else 
				{
					$sFilename = $aIter->filename() ;
					$sClass = substr( $sFilename,0,strpos($sFilename,'.') ) ;
					
					$sFullClass = $sNamespace . '\\' . (dirname($sSubFolder)=='.'? '': (dirname($sSubFolder).'\\')) . $sClass ;
					
					if( class_exists($sFullClass) and is_subclass_of($sFullClass,'jc\\mvc\\controller\\IController') )
					{
						$arrControllerClasses[] = $sFullClass ;
					}
				}
			}
		}
		
		return array($arrNamespacesInfo,$arrControllerClasses) ;
	}
	
	public function scanOrm(PrototypeAssociationMap $aMap)
	{
		$arrModels = array() ;
		
		foreach($aMap->modelNameIterator() as $sModelName)
		{
			$arrModels[$sModelName] = array(
				'columns' => array() ,
				'assoc' => array() ,
			) ; 
			
			$aPrototype = $aMap->modelPrototype($sModelName) ;
			
			// 字段
			foreach($aPrototype->columnIterator() as $sClm)
			{
				$arrModels[$sModelName]['columns'][] = $sClm ;
			} 
			
			// 关联
			foreach($aPrototype->associations()->valueIterator() as $aAssociation)
			{
				$sAssoType = $aAssociation->type() ;
				
				if( empty($arrModels[$sModelName]['assoc'][$sAssoType]) )
				{
					$arrModels[$sModelName]['assoc'][$sAssoType] = array() ;
				}
				
				$arrModels[$sModelName]['assoc'][$sAssoType][] = array(
					'prop' => $aAssociation->modelProperty() ,
					'name' => $aAssociation->toPrototype()->name() ,
				) ;
			}
		}
		
		return $arrModels ;
	}
}

?>