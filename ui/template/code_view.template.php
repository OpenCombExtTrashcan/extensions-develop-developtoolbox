		// create view: ------------- 
		$aView = $this->createView('{=$arrData['name']}','{=$arrData['template']}','{=$arrData['class']}') ;
		
		// create widgets for view
		<foreach for="$theCoder->childrenIterator('widget')" item='arrWidget' >
			{? \oc\ext\developtoolbox\coder\mvc\widget\ForWidget::create($arrWidget,'$aView'); }
		</foreach>