<?php
namespace oc\ext\developtoolbox\coder\mvc ;

use jc\io\IOutputStream;
use jc\ui\xhtml\UIFactory;
use oc\ext\developtoolbox\coder\AbstractCoder;

class View extends AbstractCoder
{
	public function __construct($arrData,$arrNotEmptys=array())
	{
		parent::__construct($arrData,array('name')) ;
	}
	
	public function generate(IOutputStream $aDev)
	{		
		$this->generateByUINgin('code_view.template.php',$aDev) ;
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