<?php
namespace oc\ext\developtoolbox\coder\mvc ;

use jc\fs\File;

use jc\pattern\composite\Container;

use jc\io\OutputStreamBuffer;

use jc\io\IOutputStream;
use jc\util\IHashTable;
use jc\ui\xhtml\UIFactory;
use oc\ext\developtoolbox\coder\AbstractCoder;

class View extends AbstractCoder
{
	public function __construct($arrData,$arrNotEmptys=array())
	{
		$arrNotEmptys = array('name') ;
		if( !empty($this->arrData['aloneClass']) )
		{
			$arrNotEmptys[] = 'filepath' ;
			$arrNotEmptys[] = 'classname' ;
			$arrNotEmptys[] = 'namespace' ;
		}
		
		parent::__construct($arrData,$arrNotEmptys) ;
	}
	
	public function generate(IHashTable $aDevPool,IOutputStream $aDev=null)
	{
		$aDev->write("		// -- 视图: {$this->arrData['name']}\r\n") ;
			
		if( empty($this->arrData['aloneClass']) )
		{
			$this->generateByUINgin('code_view.template.php',$aDev,$aDevPool) ;
		}
		else 
		{
			$aDev->write("		\$this->{$this->arrData['name']} = new {$this->arrData['classname']}() ;") ;
			
			$aDev = new OutputStreamBuffer() ;
			$aDevPool[ $this->arrData['filepath'] ] = $aDev ;

			$aUsedClasses = new Container() ;
			$aUsedClasses->add($this->arrData['class']) ;
			$this->detectUsedClasses($aUsedClasses,true) ;
		
			$this->generateByUINgin('code_view_class.template.php',$aDev,$aDevPool,array('aUsedClasses'=>$aUsedClasses)) ;
		}
		
		// 生成对应的模板文件
		list($sExtName,$sTemplateFolder) = explode(':',$this->arrData['templateFolder']) ;
		$sTemplateFolder = $this->application()->extensionsDir().$this->application()->extensions()->extension($sExtName)->metainfo()->installFolder().$sTemplateFolder.'/' ;
		$sTemplatePath = File::formatPath($sTemplateFolder.$this->arrData['template']) ;
		
		$aDevPool[$sTemplatePath] = new OutputStreamBuffer() ;
		$this->generateByUINgin('code_view_template.template.php',$aDevPool[$sTemplatePath],$aDevPool) ;
		
	}

	public function detectUsedClasses(Container $aClasses,$bExcludeSelf=false)
	{
		// 
		if( !empty($this->arrData['aloneClass']) and !$bExcludeSelf)
		{
			$aClasses->add($this->arrData['namespace'].'\\'.$this->arrData['classname']) ;
		}
		
		$this->detectChildrenUsedClasses($aClasses) ;
		
		foreach($this->childrenIterator('view') as $arrChildView)
		{
			$aClasses->add($arrChildView['class']) ;
		}
	}
	
	public function isBelongsController()
	{
		return !empty($this->arrData['belongsController']) ;
	}
	
	public function widgetExchangeDataName($sWidgetId)
	{
		if(empty($this->arrData['dataexchange']))
		{
			return '' ;
		}
		
		foreach($this->arrData['dataexchange'] as $array)
		{
			if( $array['widget'] == $sWidgetId )
			{
				return $array['column'] ;
			}
		}
		
		return null ;
	}
}

?>