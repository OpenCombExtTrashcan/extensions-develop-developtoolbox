		{= $theCoder->viewVarName()}->addWidget( new Text('{=addslashes($arrData['id'])}','{=addslashes($arrData['title'])}','{=addslashes($arrData['value'])}',Text::{=$arrData['textType']}){=$theCoder->generateDataExchange()} )<clear />
		{? ob_flush() }{? $theCoder->generateVerifiers($theOutputDevPool,$theDevice) }