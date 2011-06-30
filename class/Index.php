<?php
namespace oc\ext\developtoolbox ;

use jc\fs\FSOIterator;

use jc\system\ClassLoader;

use oc\base\FrontFrame;
use jc\db\sql\Select;
use jc\mvc\controller\Controller;

class Index extends Controller
{
	protected function init()
	{
		$this->add(new FrontFrame()) ;

		$this->createView('view','developtoolbox_Index.template.html') ;

		
	}
	
	public function process()
	{
		// 反射 class namespace
		list($arrNamespacesInfo,$arrControllerClasses) = $this->scanExtensions( $this->application()->classLoader() ) ;
		
		$this->view->variables()->set('sDefineNamespacesCode',json_encode($arrNamespacesInfo)) ;
		$this->view->variables()->set('sDefineAllControllerClassesCode',json_encode($arrControllerClasses)) ;

		//
		 
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
					$arrNamespacesInfo[$sNamespace.'\\'.str_replace('//','\\',$sSubFolder)] = array(
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
					
					if( class_exists($sFullClass) and is_subclass_of($sFullClass,'jc\\mvc\\controller\\IController') )
					{
						$arrControllerClasses[] = $sFullClass ;
					}
				}
			}
		}
		
		return array($arrNamespacesInfo,$arrControllerClasses) ;
	}
}

?>