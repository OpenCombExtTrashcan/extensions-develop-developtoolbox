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
			
			$aCoder = AbstractCoder::create($arrData) ;
			$aOutputDevPool = new HashTable() ;
			
			$aCoder->generate($aOutputDevPool) ;
		
			
			foreach($aOutputDevPool as $sFilePath=>$aOutputDev)
			{
				echo "<hr />创建文件：", $sFilePath, "<br />\r\n" ;
				highlight_string($aOutputDev->bufferBytes()) ;
				echo "<br />\r\n<br />\r\n" ;
			}
			
			echo "<pre>" ;
			print_r($arrData) ;
			echo "</pre>" ;
		}
		
		else
		{
			// 反射 class namespace
			list($arrNamespacesInfo,$arrControllerClasses,$arrViewClasses) = $this->scanExtensions( $this->application()->classLoader() ) ;
			
			$this->view->variables()->set('sDefineNamespacesCode',json_encode($arrNamespacesInfo)) ;
			$this->view->variables()->set('sDefineAllControllerClassesCode',json_encode($arrControllerClasses)) ;
			$this->view->variables()->set('sDefineAllViewClassesCode',json_encode($arrViewClasses)) ;
	
			// 反射系统中的orm
			$arrModels = $this->scanOrm( PrototypeAssociationMap::singleton() ) ;
			$this->view->variables()->set('sDefineModelsCode',json_encode($arrModels)) ;
		
			// 反射系统中的模板文件目录
			$arrUiTemplateFolders = $this->scanUiTemplateFolders() ;
			$this->view->variables()->set('sDefineUiTemplateFolders',json_encode($arrUiTemplateFolders)) ;
		}
	}

	public function scanExtensions(ClassLoader $aClassLoader)
	{
		$arrNamespacesInfo = array() ;
		$arrControllerClasses = array() ;
		$arrViewClasses = array( 'oc\\mvc\\view\\View', 'oc\\mvc\\view\\FormView' ) ;
		
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
						'folder' => $sFolderPath.'/'.$sSubFolder ,
						'extension' => $sExtensionName ,
					) ;
				}
				
				// class
				else 
				{
					$sFilename = $aIter->filename() ;
					$sClass = substr( $sFilename,0,strpos($sFilename,'.') ) ;
					
					$sFullClass = $sNamespace . '\\' . (dirname($sSubFolder)=='.'? '': (dirname($sSubFolder).'\\')) . $sClass ;
					$sFullClass = str_replace('/', '\\', $sFullClass) ;
				
					if(!class_exists($sFullClass,false))
					{
						include_once $aIter->path() ;
					}
					if(  is_subclass_of($sFullClass,'jc\\mvc\\controller\\IController') )
					{
						$arrControllerClasses[] = $sFullClass ;
					}
					
					if( is_subclass_of($sFullClass,'jc\\mvc\\view\\IView') )
					{
						$arrViewClasses[] = $sFullClass ;
					}
				}
			}
		}
		
		return array($arrNamespacesInfo,$arrControllerClasses,$arrViewClasses) ;
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
	
	public function scanUiTemplateFolders()
	{
		$aSrcFileMgr = UIFactory::singleton()->sourceFileManager() ;
		
		$arrFolders = array() ;
		
		foreach($this->application()->extensionsIterator() as $aExtension)
		{
			$sExtName = $aExtension->metainfo()->name() ;
			$sExtPath = $this->application()->extenstionsDir().$aExtension->metainfo()->installFolder();
			$sExtPath = File::formatPath($sExtPath) ;
			$nExtPathLen = strlen($sExtPath) ;
		
			foreach ($aSrcFileMgr->foldersIterator($sExtName) as $sFolder)
			{
				if( substr($sFolder,0,$nExtPathLen)==$sExtPath )
				{
					$arrFolders[] = $sExtName.':'.substr($sFolder,$nExtPathLen) ;
				}
			}
		}
		
		return $arrFolders ;
	}
}

?>