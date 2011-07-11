		// create view: -------------{=$arrData['name']} 
		$this->createView('{=$arrData['name']}') ;
		// create widgets for view
		<foreach for="$theCoder->$arrData">
		$this->{=$arrData['name']}->addWidget(new ) ;
	
