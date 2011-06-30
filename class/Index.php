<?php
namespace oc\ext\developtoolbox ;

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
		$arrNamespacesInfo = $this->reflectNamespace( $this->application()->classLoader() ) ;
		$this->view->variables()->set('sDefineNamespacesCode',json_encode($arrNamespacesInfo)) ;

		//
		 
	}
	
	public function reflectNamespace(ClassLoader $aClassLoader)
	{
		$arrNamespacesInfo = array() ;
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
			
			if( count($arrPackages)>=3 and $arrPackages[0]=='oc' and $arrPackages[1]=='ext' )
			{
				$sExtensionName = $arrPackages[2] ;
			}
			else 
			{
				$sExtensionName = null ;
			}
			
			$arrNamespacesInfo[$sNamespace] = array(
				'folder' => $sFolderPath ,
				'extension' => $sExtensionName ,
			) ;
		}
		
		return $arrNamespacesInfo ;
	}
}

?>