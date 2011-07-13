<if "$arrData['size']<=1">
		{= $theCoder->viewVarName()}->addWidget( new Select('{=addslashes($arrData['id'])}','{=addslashes($arrData['title'])}'){=$theCoder->generateDataExchange()} )<clear />
<else />
		{= $theCoder->viewVarName()}->addWidget( new SelectList('{=addslashes($arrData['id'])}','{=addslashes($arrData['title'])}',{=intval($arrData['size'])},{=$arrData['multiple']?'true':'false'}){=$theCoder->generateDataExchange()} )<clear />
</if>
		{? ob_flush() }{? $theCoder->generateOptions($theDevice) }
		{? ob_flush() }{? $theCoder->generateVerifiers($theDevice) }