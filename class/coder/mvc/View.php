<?php
namespace oc\ext\developtoolbox\coder\mvc ;

use jc\lang\Exception;

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
	
	static public function create($arrData,$sParentVarName='$this')
	{
		$arrData['parent_var_name'] = $sParentVarName ;
		return new self($arrData) ;
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
			$aDev->write("		{$this->arrData['parent_var_name']}->addView(new {$this->arrData['classname']}()) ;") ;
			
			$aDev = new OutputStreamBuffer() ;
			$aDevPool[ $this->arrData['filepath'] ] = $aDev ;

			$aUsedClasses = new Container() ;
			$aUsedClasses->add($this->arrData['class']) ;
			$this->detectUsedClasses($aUsedClasses,true) ;
		
			$this->generateByUINgin('code_view_class.template.php',$aDev,$aDevPool,array('aUsedClasses'=>$aUsedClasses)) ;
		}
		
		// 生成对应的模板文件
		if(empty($this->arrData['templateFolder']))
		{
			throw new Exception("请选择视图%s的模板目录",$this->arrData['name']) ;
		}
		list($sExtName,$sTemplateFolder) = explode(':',$this->arrData['templateFolder']) ;
		$sTemplateFolder = $this->application()->extensionsDir().$this->application()->extensions()->extension($sExtName)->metainfo()->installFolder().$sTemplateFolder.'/' ;
		$sTemplatePath = File::formatPath($sTemplateFolder.$this->arrData['template']) ;
		
		$aDevPool[$sTemplatePath] = new OutputStreamBuffer() ;
		$this->generateByUINgin('code_view_template.template.php',$aDevPool[$sTemplatePath],$aDevPool) ;
	}

	public function detectUsedClasses(Container $aClasses,$bIncludeSelf=true)
	{
		// 
		if( !empty($this->arrData['aloneClass']) ) 
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
	
	/**
	 * 生成的类
	 */
	public function detectClass()
	{
		if($this->arrData['aloneClass'])
		{
			return $this->arrData['namespace'].'\\'.$this->arrData['classname'] ;
		}
		else 
		{
			return $this->arrData['class'] ;
		}
	}
}

?>