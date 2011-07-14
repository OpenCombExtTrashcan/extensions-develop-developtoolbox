jQuery(function () {
	//配置
	var treeTableId = "#toolpanel";
	var treeTable = jQuery(treeTableId);
	var childClassPre = "child_of_"; //用来标记子node的class的前缀,暂时不要修改,会影响getParent函数
	var fileName = ""; //本页顶级controller的文件名
	var extensionName = ""; //本页顶级controller所属扩展的名字

	var allowTypes = {
		"noselected" : ['controller' , 'view' , 'model']
    	,"controller" : ['delete']
		,"view" : ['view' , 'widget' , 'delete']
		,"widget" : [ 'verifier' ,'delete']
		,"verifier" : ['delete']
		,"model" : ['delete']
	};
	
	var arrGirlLastNames = ["Abigail","Ada","Adela","Adelaide","Afra","Agatha","Agnes","Alberta","Alexia","Alice","Alma","Althea","Alva","Amanda","Amelia","Amy","Anastasia","Andrea","Angela","Ann","Anna","Annabelle","Antonia","April","Arabela","Arlene","Astrid","Atalanta","Athena","Audrey","Aurora","Barbara","Beatrice","Belinda","Bella","Belle","Bernice","Bertha","Beryl","Bess","Betsy","Betty","Beulah","Beverly","Blanche","Blythe","Bonnie","Breenda","Bridget","Brook","Camille","Candance","Candice","Cara","Carol","Caroline","Catherine","Cathy","Cecilia","Celeste","Charlotte","Cherry","Cheryl","Chloe","Christine","Claire","Clara","Clementine","Constance","Cora","Coral","Cornelia","Crystal","Cynthia","Daisy","Dale","Dana","Daphne","Darlene","Dawn","Debby","Deborah","Deirdre","Delia","Denise","Diana","Dinah","Dolores","Dominic","Donna","Dora","Doreen","Doris","Dorothy","Eartha","Eden","Edith","Edwina","Eileen","Elaine","Eleanore","Elizabeth","Ella","Ellen","Elma","Elsa","Elsie","Elva","Elvira","Emily","Emma","Enid","Erica","Erin","Esther","Ethel","Eudora","Eunice","Evangeline","Eve","Evelyn","Faithe","Fanny","Fay","Flora","Florence","Frances","Freda","Frederica","Gabrielle","Gail","Gemma","Genevieve","Georgia","Geraldine","Gill","Giselle","Gladys","Gloria","Grace","Griselda","Gustave","Gwendolyn","Hannah","Harriet","Hazel","Heather","Hedda","Hedy","Helen","Heloise","Hermosa","Hilda","Hilary","Honey","Hulda","Ida","Ina","Ingrid","Irene","Iris","Irma","Isabel","Ivy","Jacqueline","Jamie","Jane","Janet","Janice","Jean","Jennifer","Jenny","Jessie","Jessica","Jill","Jo","Joa","Joanna","Joanne","Jocelyn","Jodie","Josephine","Joy","Joyce","Judith","Judy","Julia","Julie","Juliet","June","Kama","Karen","Katherine","Kay","Kelly","Kimberley","Kitty","Kristin","Laura","Laurel","Lauren","Lee","Leila","Lena","Leona","Lesley","Letitia","Lilith","Lillian","Linda","Lindsay","Lisa","Liz","Lorraine","Louise","Lucy","Lydia","Lynn","Mabel","Madeline","Madge","Maggie","Mamie","Mandy","Marcia","Margaret","Marguerite","Maria","Marian","Marina","Marjorie","Martha","Martina","Mary","Maud","Maureen","Mavis","Maxine","Mag","May","Megan","Melissa","Meroy","Meredith","Merry","Michelle","Michaelia","Mignon","Mildred","Mirabelle","Miranda","Miriam","Modesty","Moira","Molly","Mona","Monica","Muriel","Murray","Myra","Myrna","Nancy","Naomi","Natalie","Natividad","Nelly","Nicola","Nicole","Nina","Nora","Norma","Novia","Nydia","Octavia","Odelette","Odelia","Olga","Olive","Olivia","Ophelia","Pag","Page","Pamela","Pandora","Patricia","Paula","Pearl","Penelope","Penny","Philipppa","Phoebe","Phoenix","Phyllis","Polly","Poppy","Prima","Priscilla","Prudence","Queena","Quintina","Rachel","Rae","Rebecca","Regina","Renata","Renee","Rita","Riva","Roberta","Rosalind","Rose","Rosemary","Roxanne","Ruby","Ruth","Sabina","Sally","Sabrina","Salome","Samantha","Sandra","Sandy","Sara","Sarah","Sebastiane","Selena","Sharon","Sheila","Sherry","Shirley","Sibyl","Sigrid","Simona","Sophia","Spring","Stacey","Setlla","Stephanie","Susan","Susanna","Susie","Suzanne","Sylvia","Tabitha","Tammy","Teresa","Tess","Thera","Theresa","Tiffany","Tina","Tobey","Tracy","Trista","Truda","Ula","Una","Ursula","Valentina","Valerie","Vanessa","Venus","Vera","Verna","Veromca","Veronica","Victoria","Vicky","Viola","Violet","Virginia","Vita","Vivien","Wallis","Wanda","Wendy","Winifred","Winni","Xanthe","Xaviera","Xenia","Yedda","Yetta","Yvette","Yvonne"];
	var arrFirstNames = ["abbot","t","abe","abraham","abraham","acheson","ackerman","n","adam","adams","addison","adela","adelaide","adolph","agnes","albert","alcott","aldington","aldridge","aled","k","alexander","alerander","alfred","alice","alick","alexander","alsop","p","aly","amelia","anderson","andrew","ann","anna","anne","anthony","antoinette","antonia","arabella","archibald","armstrong","arnold","arthur","attlee","augustine","augustus","austen","austin","babbitt","bach","bacon","baldwin","barnard","barney","barnard","barrett","barrie","bart","bartholomew","bartholomew","bartlett","barton","bauer","beard","beaufort","becher","beck","rebecca","becky","beerbohm","bell","bellamy","belle","arabella","belloc","ben","benjamin","benedict","benjamin","bennett","benedict","benson","bentham","berkeley","bernal","bernard","bert","albert","herbert","bertha","bertie","bertram","bess","elizabeth","bessemer","bessie","elizabeth","bethune","betsy","elizabeth","betty","elizabeth","bill","william","billy","william","birrell","black","blake","bloomer","bloomfield","bloor","blume","bob","robert","bobby","robert","boswell","bowen","bowman","boyle","bradley","bray","brewster","bridges","bright","broad","bronte","brooke","brown","browne","browning","bruce","bruno","bryan","bryce","buck","buckle","bulwer","bunyan","burke","burne","jones","burns","butler","byron","camilla","camp","carey","carl","carllyle","carmen","carnegie","caroline","carpenter","carrie","carroll","carter","catharine","catherine","cecillia","chamberlain","chaplin","chapman","charles","charley","charles","charlotte","charles","chaucer","chesterton","child","childe","christ","christian","christiana","christie","christian","christopher","christy","christian","church","churchill","cissie","cecillia","clapham","clara","clare","claraclarissa","clarissa","clark","e","clemens","clement","cocker","coffey","colclough","coleridge","collins","commons","conan","congreve","connie","constance","connor","conrad","constance","cook","e","cooper","copperfield","cotton","coverdale","cowper","craigie","crane","crichton","croft","crofts","cromwell","cronin","cumberland","curme","daisy","dalton","dan","daniell","daniel","daniell","darwin","david","davy","david","defoe","delia","den","n","is","dequincey","dewar","dewey","dick","richard","dickens","dickey","dillon","dobbin","robert","dodd","doherty","dolly","dorthea","dorothy","donne","dora","dorthea","dorothy","doris","dorothea","dorothy","douglas","s","doyle","dierser","dryden","dubois","dulles","dunbar","duncan","dunlop","dupont","dutt","eddie","edward","eden","edgeworth","edie","adam","edison","edith","edmund","edward","effie","euphemia","eipstein","eisenhower","eleanor","electra","elinor","eliot","elizabeth","ella","eleanor","elinor","ellen","eleanor","elinor","ellis","elsie","alice","elizabeth","emerson","emily","emma","emmie","emmy","emma","ernest","esther","eugen","eugene","euphemia","eva","evan","evans","eve","evelina","eveline","evelyn","eva","eve","ezekiel","fanny","frances","faraday","fast","faulkner","felix","felton","ferdinand","ferguson","field","fielding","finn","fitzgerald","flower","flynn","ford","forster","foster","fowler","fox","frances","francis","frank","francis","franklin","franklin","fred","frederick","frederick","freeman","funk","gabriel","galbraith","gallacher","gallup","galsworthy","garcia","garden","gard","i","ner","gaskell","geoffrey","geordie","george","george","gibbon","gibson","gilbert","giles","gill","juliana","gissing","gladstone","godwin","gold","goldsmith","gosse","grace","gracie","grace","graham","grant","grantham","gray","green","gregory","gresham","grey","grote","gunter","gunther","gus","augustus","guy","habakkuk","haggai","hal","henry","halifax","hamilton","hamlet","hansen","hansom","hardy","harold","harper","harriman","harrington","harrison","harrod","harry","henry","hart","harte","harvey","hawthorne","haydn","haywood","hazlitt","hearst","helin","a","hemingway","henley","henrietta","henry","herbert","herty","henrietta","hewlett","hicks","hill","hobbes","hobson","hodge","hodgson","holmes","holt","hood","hoover","hope","hopkin","s","horace","horatio","hornby","hosea","house","housman","houston","howard","howell","s","hoyle","hubbard","hudson","huggins","hugh","hugh","hughes","hume","humphr","e","y","huntington","hutt","huxley","ingersoll","irving","isaac","isabel","isaiah","ivan","jack","john","jackson","jacob","james","jane","jasper","jeames","james","jean","jane","jefferson","jenkin","s","jennings","jenny","jane","jeremiah","jeremy","jerome","jerry","jeremiah","jessie","jane","joan","jim","james","jimmy","james","joan","job","joe","josepy","joel","john","johnny","john","johnson","johnston","e","jonah","jonathan","jones","jonson","jordan","joseph","josh","joshua","joshua","joule","joyce","judd","judith","judson","julia","julian","juliana","juliet","julia","julius","katte","catharine","katharine","kathleen","catharine","katrine","catharine","keats","kell","e","y","kellogg","kelsen","kelvin","kennan","kennedy","keppel","keynes","kingsley","kipling","kit","catharine","kitto","christopher","kitty","lamb","lambert","lancelot","landon","larkin","lawrence","lattimore","laurie","lawrence","law","lawrence","lawson","leacock","lee","leigh","leighton","lena","helen","a","leonard","leopold","lew","lewis","lewis","lily","lincoln","lindberg","h","lindsay","lizzie","elizabeth","lloyd","locke","london","longfellow","longman","lou","ie","lewis","louisa","louise","louis","louisa","louise","lowell","lucas","lucia","lucius","lucy","luke","lyly","lynch","lynd","lytton","macadam","macarthur","macaulay","macdonald","macdonald","mackintosh","macmillan","macmillan","macpherson","macpherson","madge","margaret","maggie","margaret","malachi","malan","malory","malthus","maltz","mansfield","marcellus","marcus","marcus","margaret","margery","maria","marion","marjory","margaret","mark","marlowe","marner","marshall","martha","martin","mary","masefield","mat","h","ilda","matthew","maud","mat","h","ilda","maugham","maurice","max","maxwell","may","mary","mccarthy","mcdonald","macdonald","meg","margaret","melville","meredith","micah","michael","michelson","middleton","mike","michael","mill","milne","milton","minnie","wilhelmina","moll","mary","mond","monroe","montgomery","moore","more","morgan","morley","morris","morrison","morse","morton","moses","motley","moulton","murray","nahum","nancy","ann","anna","anne","nathaniei","needham","nehemiah","nell","nelly","eleanor","helen","nelson","newman","newton","nicholas","nichol","s","nick","nicholas","nico","l","nixon","noah","noel","nora","eleanor","norris","north","norton","noyes","obadiah","o","casey","occam","o","connor","oliver","o","neil","onions","orlando","oscar","owen","palmer","pansy","parker","partridge","pater","patience","patrick","paul","peacock","pearson","peg","margaret","peggy","margaret","penn","pepys","perkin","peter","peter","petty","philemon","philip","piers","peter","pigou","pitman","poe","pollitt","polly","mary","pope","pound","powell","price","priestley","pritt","pulitzer","pullan","pullman","quiller","raglan","raleign","ralph","raman","ramsden","raphael","rayleign","raymond","reade","rebecca","reed","reynolds","rhodes","rhys","ricardo","richard","richards","richardson","rob","robert","robbins","robert","robeson","robin","robert","robinson","rockefeller","roger","roland","romeo","roosevelt","rosa","rosalind","rose","rossetti","roy","rudolph","rudolf","rusk","ruskin","russell","ruth","rutherford","sainsbury","sailsbury","sally","sara","salome","sam","samuel","samson","samuel","sander","alexander","sandy","alexander","sapir","sara","h","saroyan","sassoon","saul","sawyer","saxton","scott","scripps","senior","service","shakespeare","sharp","shaw","shelley","sheridan","sherwood","sidney","silas","simon","simpson","sinclair","smedley","smith","smollett","snow","sonmerfield","sophia","sophy","sophia","southey","spencer","spender","spenser","springhall","steele","steinbeck","stella","stephen","stephens","stevenson","stilwell","stone","stowe","strachey","strong","stuart","surrey","susan","susanna","sweet","swift","swinburne","symons","tate","taylor","ted","edward","temple","tennyson","terry","theresa","thackeray","thodore","theresa","thomas","thompson","thomson","thoreau","thorndike","timothy","titus","tobias","toby","tobias","toland","tom","thomas","tomlinson","tommy","thomas","tony","anthony","tours","tout","toynbee","tracy","theresa","trevelyan","trollpoe","truman","turner","tuttle","twain","tyler","ulysses","valentine","van","vaughan","veblen","victor","vincent","violet","virginia","vogt","wagner","walker","walkley","wallace","wallis","walpole","walsh","walter","walton","ward","warner","warren","washington","wat","walter","waters","watt","webb","webster","wells","wesley","wheatley","wheeler","whit","whitehead","whitman","whittier","whyet","wilcox","wild","wilde","wilhelmina","will","william","willard","william","wilmot","t","wilson","windsor","winifred","wodehous","wolf","wollaston","wood","woolf","woolley","wordsworth","wright","wyat","t","wyclif","fe","wyld","e","yale","yeates","yerkes","young","yule","zacharias","zangwill","zechariah","zephaniah","zimmerman"];
	var sGirlNamesUsed = [];
	
	//数据对象
	treeData ={"coder":"controller","filepath":"","classname":"","namespace":"","children":[]};
	
	//为view显示字段而准备的数据对象
	ormTableColumn = {};
	
	//orm 唯一id
	var idForOrm = 1;
	function getIdForOrm(){
		idForOrm = idForOrm + 1;
		return idForOrm;
	}
	
	//树形列表中的checkbox 唯一id
	var idTrCheckbox = 1;
	function getIdTrCheckbox(){
		idTrCheckbox = idTrCheckbox + 1;
		return idTrCheckbox;
	}
	
	//取得一个随机的名字
	function getAName(){
		var nLastNameIndex = Math.floor(Math.random()*arrGirlLastNames.length);
		var nFirstNameIndex = Math.floor(Math.random()*arrFirstNames.length);
		var sALastName = arrGirlLastNames[nLastNameIndex];
		var sAFirstName = arrFirstNames[nFirstNameIndex];
		removeElementByIndex(nLastNameIndex,arrGirlLastNames);
		removeElementByIndex(nFirstNameIndex,arrFirstNames);
		return sAFirstName+sALastName;
	}
	
	//获得node的层级,顶级为0,顶级的子node就是1,孙node就是2,依次类推
	function getLevel(aNode){
		var classNames = aNode.attr("class").split(' ');
	  for(var key in classNames) {
	    if(typeof(classNames[key])=="string" && classNames[key].match("level_")) {
	    	var arrLevel = classNames[key].split('_');
	      return Number(arrLevel[1]);
	    }
	  }
	  return 0; // 前面的代码没有return,则代表node是顶级标签
	}
	
	//调整node的缩进,注意:已经有缩进的会重复缩进,如果要修正,请从//1开始
	function intendNode(aNode){
		var nLevel = getLevel(aNode);
		if( nLevel != 0){
			//1
			aNode.find("td:first-child").prepend('<div class="tr_indent"></div>');
			aNode.find(".tr_indent").css("width" ,16*nLevel+"px" );
		}	
	}
	
	//选中
	function setSelected(aNode){
		if(aNode.hasClass("selected")){
			aNode.removeClass("selected");
			$('.propertys').hide(0);
			// changeBtnStateByTrType(null);
			// getPropertyPage(null);
			return;
		}
		treeTable.find("tr").removeClass("selected");
		aNode.addClass("selected");
		//左侧添加按钮按权限显示
		// changeBtnStateByTrType(aNode);
		//右侧属性栏
		getPropertyPage(aNode);
	}
	
	//属性页面切换
	function getPropertyPage(aNode){
		var sNodeType = getNodeType(aNode);
		//如果是widget的属性页,把属性附表先隐藏
		if(sNodeType == "widget"){
			// widgetOtherPropertyGoBackToStore();
			widgetTypeChange(null);
		}
		if(sNodeType == "verifier"){
			rebuildVerifierProperty(jQuery('#verifier_verifierType').val());
		}
		//处理属性通用页面
		jQuery( ".propertys" ).hide(0);
		var aPropertyPage = jQuery( "#" + getNodeType(aNode) + "_property" );
		aPropertyPage.show(0);
		if(sNodeType == "view"){
			initViewDataExchangeSelect(aNode);
		}
		//得到数据
		var aData = aNode.data("property");
		if(aData != undefined){
			getProperties(aPropertyPage,aData);
		}
	}
	
	//还原属性栏内容
	function getProperties(aPropertyPage,aData){
		//先看看是不是widget类型,如果是widget类型,那么先组合附表单
		if( aData["coder"] == "widget" && aData["widgetType"] != undefined){  //处理select属性附属页面
			widgetTypeChange(aData["widgetType"]);
		}
		//先看看是不是verifier类型,如果是verifier类型,那么先组合附表单
		if(aData["coder"] == "verifier" && aData["verifierType"] != undefined){
			rebuildVerifierProperty(aData["verifierType"]);
		}
		
		//得到属性表单中的widget
		var arrProperty = getPropertyWidget(aPropertyPage);
		//复原widget的值
		jQuery.each(arrProperty, function(i,n){
			var sArgId = jQuery(n).attr("id");
			var sArgName = jQuery(n).attr("id").split("_")[1];
			if(aData!=undefined){
				var sValue = aData[sArgName];
			}
			var aArgWidget = aPropertyPage.find("#"+sArgId);
			if(aArgWidget[0].type=="checkbox" || aArgWidget[0].type=="radio"){
				aArgWidget[0].checked = sValue;
			}else if( aArgWidget[0].type == "hidden" ){
				giveValueToHiddenWidget(aArgWidget,sValue);
			}else if( sArgName!="submit"){
				if(sValue != undefined){
					jQuery(n).val(sValue);
				}else{
					jQuery(n).val(null);
				}
			}
		});
		//对象初始name
		var aObjectName = aPropertyPage.find("input.object_name") ;
		if(aObjectName.length > 0 && aObjectName.val().length == 0){
			aObjectName.val(jQuery("#toolpanel .selected").attr("id"));
		}
		aObjectName.focus();
	}
	
	//返回一个数组,包含propertypage的可提交控件的对象数组,比如input和select控件
	function getPropertyWidget(aPropertyPage){
		return aPropertyPage.find("input,select").not(".nosave");
	}
	
	//widget 的类型(比如;select,checkbox,text等)变化时触发
	function widgetTypeChange(widgetClass){
		var sWidgetClass = "";
		if(widgetClass == null){
			sWidgetClass = jQuery("#widget_widgetType").val();
		}else{
			sWidgetClass = widgetClass;
		}
		var sWidgetPropertyPageId = "#"+ sWidgetClass +'_property';
		widgetOtherPropertyGoBackToStore();
		jQuery(sWidgetPropertyPageId).appendTo(jQuery("#other_property")).show(0);											   
	}
	
	//widget的附属表单隐藏
	function widgetOtherPropertyGoBackToStore(){
		jQuery(".widget_propertys").appendTo(jQuery("#widget_property_store")).hide(0);
	}
	
	//新建node(tr)
	function makeNewNode(aParent,newNodeId,sNewType){
		if(jQuery("#"+newNodeId).length > 0){
			alert("你有一个对象没有命名");
			return false;
		}
		//需要对象额外执行代码时
		var sCheckBoxsForProgram = '';
		if(sNewType == 'view'){
			var nCheckBoxsForProgramId1 = "trCheckbox_1_"+getIdTrCheckbox();
			var nCheckBoxsForProgramId2 = "trCheckbox_2_"+getIdTrCheckbox();
			sCheckBoxsForProgram = '<input id="'+nCheckBoxsForProgramId1+'" class="generationLoadWidgets" type="checkbox" /><label for="'+nCheckBoxsForProgramId1+'">执行前加载数据</label>'
									+'<input id="'+nCheckBoxsForProgramId2+'" class="generationProcessForm" type="checkbox" checked="checked"/><label for="'+nCheckBoxsForProgramId2+'">处理表单提交</label>';
		}else if(sNewType == 'model'){
			var nCheckBoxsForProgramId1 = "trCheckbox_1_"+getIdTrCheckbox();
			var nCheckBoxsForProgramId2 = "trCheckbox_2_"+getIdTrCheckbox();
			sCheckBoxsForProgram = '<input id="'+nCheckBoxsForProgramId1+'" class="generationLoadModel" type="checkbox" /><label for="'+nCheckBoxsForProgramId1+'">执行前从模型加载控件的数据</label>'
									+'<input id="'+nCheckBoxsForProgramId2+'" class="generationSaveModel" type="checkbox" checked="checked" /><label for="'+nCheckBoxsForProgramId2+'">执行后保存模型</label>';
		}
		var sNewNodeHtml = '<tr id="'+ newNodeId +'"><td><span class="'+sNewType+'"></span><b>'+newNodeId+'</b></td><td></td><td>'+sCheckBoxsForProgram+'</td><td></td></tr>';
		if(aParent==null){
			//如果没有父对象,就建立一个顶级的对象
			treeTable.append(sNewNodeHtml);
		}else{
			//如果有父对象,就建立一个子对象
			var arrBrothers = getChildren(aParent);
			if(arrBrothers.length > 0){
				var aLastBrotherNode = $(arrBrothers[arrBrothers.length - 1]);
				var aLastBrotherNodeLevel = getLevel(aLastBrotherNode);
				var aNextTrs = aLastBrotherNode.nextAll('tr');
				if(aNextTrs.length > 0){
					aNextTrs.each(function(i,v){
						if(getLevel($(v)) <= aLastBrotherNodeLevel){
							$(v).before(sNewNodeHtml);
							return false;
						}
					});
				}else{
					aLastBrotherNode.after(sNewNodeHtml);
				}
			}else{
				aParent.after(sNewNodeHtml);
			}
		}
		
		var aNewNode = jQuery("#"+newNodeId);
		//默认数据
		var aNewNodeProperty = {"coder":sNewType,"children":[]};
		//额外的默认数据
		if(sNewType == 'view'){
			aNewNodeProperty['generationLoadWidgets'] = false;
			aNewNodeProperty['generationProcessForm'] = true;
		}
		if(sNewType == 'model'){
			aNewNodeProperty['generationLoadModel'] = false;
			aNewNodeProperty['generationSaveModel'] = true;
		}
		if(sNewType == 'verifier'){
			aNewNodeProperty['max'] = 30;
			aNewNodeProperty['min'] = -1;
		}
		aNewNode.data("property",aNewNodeProperty);
		if(aParent!=null){
			var aParentProperty = aParent.data("property");
			aParentProperty["children"].push(aNewNodeProperty);
			aNewNode.addClass( childClassPre+aParent.attr("id") );
			aNewNode.addClass("level_"+(getLevel(aParent)+1) );
			intendNode(aNewNode);
		}else{
			treeData["children"].push(aNewNodeProperty);
		}
		setSelected(aNewNode);
	}
	
	//获得btn的Type
	function getBtnType(aBtn){
		var btnId = aBtn.attr("id");
		var btnType = btnId.split("_")[1];
		return btnType;
	}
	
	//获得node的type
	function getNodeType(aNode){
		return aNode.find("span").attr("class");
	}
	
	//获得父node
	function getParent(aNode){
		if(!aNode){
			throw 'getParent() 接受了非法的aNode 参数';
			return;
		}
		var arrClasses = aNode.attr("class").split(" ");
		var sParentId = "";
		for(var key in arrClasses){
			if(typeof(arrClasses[key])=="string" && arrClasses[key].match(childClassPre)){
				sParentId = arrClasses[key].split("_")[2];
			}
		}
		if(sParentId == ""){
			return false; //没有父node
		}
		return jQuery("#"+sParentId);
	}
	
	//获得指定类型的父node
	function getParentByType(aNode,sType){
		var aNodeTemp = aNode;
		while( aNodeTemp != "topController" && getNodeType(aNodeTemp) != sType ){
			aNodeTemp = getParent(aNodeTemp);
			if(aNodeTemp == false){
				aNodeTemp = "topController";
			}
		}
		return aNodeTemp;
	}
		
	//获得子node , 返回子node对象数组,如果没有子node,返回false
	function getChildren(aNode){
		var arrChildren = [];
		var sNodeId = aNode.attr("id");
		var sChildrenClass = childClassPre+sNodeId;
		arrChildren = jQuery("."+sChildrenClass);
		if(arrChildren.length <= 0){
			arrChildren = false;
		}
		return arrChildren;
	}
	//从node数组中查找指定类型的node,返回数组,如果没有指定的node,返回false
	function findNodeFormChildren(arrNodes,sType){
		if(arrNodes==false){
			return false;
		}
		var arrSubNode = [];
		$.each(arrNodes,function(i,v){
			if(getNodeType(jQuery(v)) == sType){
				arrSubNode.push(jQuery(v));
			}
		});
		if(arrSubNode.length <= 0){
			arrSubNode = false;
		}
		return arrSubNode;
	}
	
	//删除数组元素
	function removeElementByIndex(dx,arr){
	  if(isNaN(dx)||dx>arr.length){return false;}
	  for(var i=0,n=0;i<arr.length;i++){
		  if(arr[i]!=arr[dx]){
		  	arr[n++]=arr[i];
		  }
	  }
	  arr.length-=1;
	  return arr;
  	}
	
	//转义 . ,初期目的是为了防止用文件名做ID的时候 . 被误读成css选择器的. 
	function escapeId(sOldId){
		var sNewId = sOldId.replace(/\./ig,"-");
		sNewId = sNewId.replace(/\\/ig,'-');
		return sNewId;
	}
	
	//删除node ,包括子node
	function removeNode(aSelected){
		if(aSelected.hasClass('selected')){
			$(".propertys").hide(0);
		}
		var arrChildren = getChildren(aSelected);
		if(arrChildren != false){
			jQuery.each(arrChildren,function(i,n){
				removeNode(jQuery(n));			  
			});
		}
		var aSelectedProperty = aSelected.data("property");
		var aSelectedParentProperty ;
		//删除父node的children中的记录
		var aSelectedParent = getParent(aSelected);
		if(aSelectedParent == false){//如果用户想删除的对象是顶级对象,则删除treedata中的children的数据,即吧treedata当做父对象
			aSelectedParentProperty = treeData;
		}else{
			aSelectedParentProperty = aSelectedParent.data("property");
		}
		for(var key in aSelectedParentProperty["children"]){
			if(aSelectedParentProperty["children"][key] == aSelectedProperty){
				removeElementByIndex(key,aSelectedParentProperty["children"]);
			}
		}
		aSelected.remove();
	}
	
	//当namespace区域被编辑时的行为
	function nameSpaceEdit(){
		var aClassName = jQuery("#className");
		var namespaceSelectValue = jQuery("#namespaceSelect").val();
		//首字母大写
		if(aClassName.val().length > 0){
			aClassName.val(aClassName.val()[0].toUpperCase()+aClassName.val().substr(1));
		}
		if(namespaceSelectValue == 0 || aClassName.val().length == 0){
			jQuery("#namespaceComplete").addClass("noFileName").text("还没有确定命名空间...");
			treeData["filepath"] = "";
			treeData["namespace"] = "";
			treeData["classname"] = "";
			return;
		}else{
			var filepath = namespaceData[namespaceSelectValue]["folder"];
			fileName = filepath+'/'+aClassName.val()+".php";
			jQuery("#namespaceComplete").removeClass("noFileName").text(fileName);
			treeData["filepath"] = fileName;
			treeData["namespace"] = namespaceSelectValue;
			treeData["classname"] = aClassName.val();
			extensionName = namespaceData[namespaceSelectValue]["extension"];
		}
	}
	
	//控制按钮显示或者消失,以前的版本没有参数,但是那样ubuntu下会显示错乱
	function subBtnsDisplay(bDisplay){
		if(bDisplay){
			jQuery("#subToolPanel").css('display','block');
		}else{
			jQuery("#subToolPanel").css('display','none');
		}
		
	}
	function subBtnsPosition(aWantedBy){
		var aSubToolPanel = jQuery("#subToolPanel");
		var nSubToolPanelWidth = aSubToolPanel.width();
		var nNodeWidth  = aWantedBy.width();
		jQuery("#subToolPanel").appendTo(aWantedBy.find("td").last()).css({
			left: ""+(nNodeWidth-nSubToolPanelWidth)+"px"
			, top: aWantedBy.offset().top
			});
	}
	function accessOfBtns(aWantedBy){
		var typeClass = "";
		if(aWantedBy === null){
			jQuery(".subButtons").addClass("sub_btn_disabled");
		}else{
			typeClass = getNodeType(aWantedBy);
		}
		if(typeClass in allowTypes){
			// jQuery(".subButtons").addClass("sub_btn_disabled");
			for(var key in allowTypes[typeClass]){
				jQuery("#subBtn_"+allowTypes[typeClass][key]).removeClass("sub_btn_disabled");
			}
		}
	}
	//相应删除按钮
	function deleteTr(aNodeWantToDel){
		if(!confirm('确实要删除这个对象吗? \n所有的子对象都会被删除!!')){
			return;
		}
		if(aNodeWantToDel.length <= 0){
			return;
		}
		jQuery("#subToolPanel").appendTo(treeTable);
		removeNode(aNodeWantToDel);
		trMouseOut();
		return;
	}
	
	//保存表单
	function saveForm(){
		var aSelected = jQuery(".selected");	
		// var sSubmitBtnId = jQuery(this).attr("id");	
		// var sSubmitType = sSubmitBtnId.split("_")[0];
		var aForm = jQuery(this).parents('.propertys').first();
		var sSubmitType = aForm.attr('id').split('_')[0];
		var arrProperties = getPropertyWidget(jQuery("#"+sSubmitType+"_property"));
		var dataObject = {};
		
		if(aSelected.data("property")!=undefined){
			dataObject=aSelected.data("property");
			//除了children意外,清除所有的数据
			// for(var key in dataObject){
				// if(key != "children" && key!="coder"){
					// delete dataObject[key];
				// }
			// }
		}
		//取值
		jQuery.each( arrProperties , function(i, n){
			var sArgName = jQuery(n).attr("id").split("_")[1];
			var sArgValue = "";
			if(n.type == "checkbox" || n.type == "radio" ){
				if(n.checked){
					sArgValue = n.checked;
				}
			}else if(n.type == "hidden"){
				sArgValue = jQuery(n).data("value");
			}else if(n.id == "model_name"){ //保存model的数据交换关系,之所以插在这里是为了在id确定好以后再处理,以防id混乱
				sArgValue = jQuery(n).val();
				var widgetcolumbmap = jQuery("#model_widgetcolumbmap").data("widgetcolumbmap");
				if(widgetcolumbmap == undefined){
					delete ormTableColumn[sArgValue];
				}
				ormTableColumn[sArgValue] = widgetcolumbmap;
			}else{
				sArgValue = jQuery(n).val();
			}
			if(sArgName!="submit"){
				dataObject[sArgName] = sArgValue;
			}
		});
		//修正对象列表中的ID和text
		// var name = jQuery("#"+sSubmitType+"_property .object_name").val();
		var name = aForm.find('.object_name').val();
		aSelected.find("td b").text(name);
		//aSelected.attr("id",escapeId(name)).find("td b").text(name);
		//数据保存到tr对象
		//aSelected.data("property",dataObject);
	}
	
	
	//保存option数据到widget_options的data中
	function saveOptionsData(){
		var arrOptions = [];
		jQuery("#widget_options_table tbody tr").each(function(i,n){
			var arrAOption = [];
			if(jQuery(n).attr("id") == "modeify_options"){
				return true;
			}
			$.each( jQuery(n).find("td") , function(v,b){
				// 前三个td记录有用的数据,最后一个没有用,前2个是text和value,第3个是是否选中
				if(v < 2){ 
					arrAOption.push(jQuery(b).text());
				}else if(v == 2){
					arrAOption.push(jQuery(b).find("input:checkbox").prop("checked"));
				}
			});
			arrOptions.push(arrAOption);
		});
		jQuery("#widget_options").data("value",arrOptions);
	}
	
	//恢复widget_options的值还有widget_option_table的值
	function rebuildOptionTable(aHiddenWidget,arrValue){
		if(arrValue == undefined){
			return;
		}
		clearOptionsTable(jQuery("#widget_options_table"));
		aHiddenWidget.data("value",arrValue);
		jQuery.each(arrValue,function(i,n){
			var sSelected = "";
			if(n[2]){
				sSelected = 'checked = "checked"';
			}
			jQuery("#widget_options_table #modeify_options").before('<tr><td class="options">'+n[0]+'</td><td class="options">'+n[1]+'</td><td><input type="checkbox" class="nosave" '+sSelected+'/></td><td><a class="del_option" title="点击删除选项" href="#">删</a></td></tr>');
		});
	}
	//清空"#widget_options_table表
	function clearOptionsTable(aOptionsTable){
		aOptionsTable.find('tbody tr[id!="modeify_options"]').remove();
	}
	//处理特殊的widget值,比如input:hidden
	function giveValueToHiddenWidget(aArgWidget,sValue){
		if(aArgWidget[0].id == "widget_options" ){
			rebuildOptionTable(jQuery(aArgWidget[0]),sValue);
		}
		if(aArgWidget[0].id == "model_orm-data" ){
			rebuildOrmProperty();
			getPropertyForOrm(jQuery(aArgWidget[0]),sValue);
		}
		if(aArgWidget[0].id == "view_dataexchange" ){
			// if(dataExchange == undefined){
				// return false;
			// }
			rebuildDataExchangeData(sValue);
		}
	}
	
	
	//恢复verifier表单
	function rebuildVerifierProperty(sType){
		if(sType == "Length"){
			clearVerifierProperty().append('<label for="verifier_min">从</label><input id="verifier_min" type="text" size="3" value="-1"/><label for="verifier_max">到</label><input id="verifier_max" type="text" size="3" value="30"/><br/>');
		}else if(sType == "Number"){
			clearVerifierProperty().append('<label for="verifier_bint">整数 ?</label><input id="verifier_bint" type="checkbox" checked="checked"/><br/>');
		}else{
			clearVerifierProperty();
		}
	}
		
	//清空verifier辅助表单
	function clearVerifierProperty(){
		var property = jQuery("#verifier_more_property");
		property.html("");
		return property;
	}
	
	
	//恢复model的orm表单
	function rebuildOrmProperty(){
		jQuery("#model_orm_div").html('');
		if(jQuery("#model_orm-start").val() != 0){
			addOrmTree(jQuery("#model_orm_div"),jQuery("#model_orm-start").val());
		}
	}
	//添加一层orm关系
	function addOrmTree(target,sOrmTop){
		var sOrm = '<ul>';
		$.each(ormData[sOrmTop]['assoc'],function(i,v){
			sOrm+='<li><b>'+i+'</b></li>';
			$.each(v,function(c,b){
				var id=getIdForOrm();
				sOrm+='<li><input type="checkbox" class="nosave" id="'+b['name']+'|'+id+'" value="'+b['prop']+'"/><label for="'+b['name']+'|'+id+'">'+b['prop']+'('+b['name']+')'+'</label></li>';
			});
		});
		sOrm += '</ul>';
		target.append(sOrm);
	}
	
	
	//重建一层orm关系树数据,同时找出本次遍历的数据表的所有字段,组合成完整的带有orm关系的字段字符串
	//本函数的返回值是由前两者组合而成的数组,组合的目的仅仅是为了返回2个值
	//本函数是递归函数
	function getOrmTreeData(aStart,sLastPre){
		var aOrm = {}; //orm关系
		var arrChecked = aStart.children("li").children("input:checked");
		var aOrmTemp = {};
		var sToColumn = '';
		if(arrChecked.length > 0){
			$.each(arrChecked,function(i,v){
				var sOrmName = getTableName(jQuery(v));
				var sOrmProp = getTableProp(jQuery(v));
				var sWholePre = sLastPre+sOrmProp+".";
				var arrResult =  getOrmTreeData(jQuery(this).nextAll("ul"),sWholePre);
				aOrmTemp[sOrmProp] = arrResult[0];
				sToColumn = arrResult[1];
				$.each( ormData[sOrmName].columns , function(c,b){
					sToColumn = sToColumn+' '+sWholePre+b;
				});
			});
		}else{
			aOrm = aStart.prevAll("input:checked").val();
		}
		return [aOrmTemp,sToColumn];
	}
	//获取orm关系中表的name
	function getTableName(aOrm){
		return aOrm.attr("id").split("|")[0];
	}
	//获取orm关系中表的prop
	function getTableProp(aOrm){
		return aOrm.val();
	}
	//重建用户上一次输入的数据
	function getPropertyForOrm(aArgWidget,Value){
		if(Value == undefined){
			return;
		}
		var arrCheckboxs = [];
		if(aArgWidget.attr("id") == "model_orm-data"){
			aArgWidget = jQuery("#model_orm_div > ul");
		}else{
			aArgWidget = aArgWidget.nextAll("ul");
		}
		arrCheckboxs = aArgWidget.children("li").children("input:checkbox");
		$.each(Value,function(i,v){
			$.each(arrCheckboxs,function(c,d){
				if(jQuery(d).val() == i){
					jQuery(d).attr("checked","checked");
					//恢复表单
					addOrmTree(jQuery(d).parents("li").first(),jQuery(d).attr("id").split("|")[0]);
					//递归
					getPropertyForOrm(jQuery(d),v);
				}
			});
		});
	}
	
	//数据保存
	function saveDataExchangeData(){
		var arrTr = jQuery("#view_model_table tbody > tr");
		var arrValues = [];
		$.each( arrTr ,function(v,n){
			var arrSelect = jQuery(n).find("select");
			var aValue = { "widget" : jQuery(arrSelect[0]).val(), "column":jQuery(arrSelect[1]).val() };
			arrValues.push( aValue );
		});
		jQuery("#view_dataexchange").data("value",arrValues);
	}
	//恢复数据交换表单的数据
	function rebuildDataExchangeData(dataExchange){
		//清空tr
		jQuery("#view_model_table > tbody").html("");
		
		//重建
		if(dataExchange == undefined){
			return false;
		} 
		$.each(dataExchange,function(v,d){
			addNewTrForDataExchange();
			//找到最后2个select分别赋值
			jQuery("#view_model_table").find(".view_dbmap_column").last().val(d.column);
			jQuery("#view_model_table").find(".view_dbmap_widget").last().val(d.widget);
		});
	}
	//根据用户操作新加一行tr
	jQuery("#add_view_model_tr").click(function(){
		addNewTrForDataExchange();
		return false;
	});
	//新添加一行select
	function addNewTrForDataExchange(){
		var sModelId = jQuery("#view_model").val();
		if(sModelId == 0){
			return;
		}
		var newTr = '<tr class="view_dbmap"><td>'
						+'<select class="view_dbmap_widget nosave">'
							+'<option value="0">选择控件...</option>'
						+'</select>'
					+'</td><td>'
						+'<select class="view_dbmap_column nosave">'
							+'<option value="0">选择字段...</option>'
						+'</select>'
					+'</td>'
					+'<td><a href="#" class="del_dbmap">删</a></td>'
				+'</tr>';
		jQuery("#view_model_table").append(newTr);
		//初始化select
		initLastViewWidgetAndColumnSelect(sModelId);
	}
	//初始化数据关系widget和column选项
	function initLastViewWidgetAndColumnSelect(sModelId){
		//column
		
		//有的model没有建立好orm关系
		if(!ormTableColumn[sModelId]) return;
		
		var arrColumnOptions = ormTableColumn[sModelId].split(" ");
		$.each(arrColumnOptions,function(i,v){
			if(v != ""){
				jQuery("#view_model_table").find(".view_dbmap_column").last().append('<option value="'+v+'">'+v+'</option>');
			}
		});
		//widget
		var aView = jQuery(".selected");
		var arrSubNodes=[];
		arrSubNodes = getChildren(aView);
		var arrSubWidgets = [];
		if(arrSubNodes.length > 0){
			arrSubWidgets = findNodeFormChildren(arrSubNodes,"widget");
		}
		$.each(arrSubWidgets,function(c,b){
			var sWidgetId = jQuery(b).attr("id");
			jQuery("#view_model_table").find(".view_dbmap_widget").last().append('<option value="'+sWidgetId+'">'+sWidgetId+'</option>');
		});
	}
	
	//初始化数据交换关系表单中的model select
	function initViewDataExchangeSelect(aNode){
		var aController = getParentByType(aNode,"controller");
		var arrChildren = [];
		var arrSubModel = [];
		if(aController =='topController'){
			arrChildren = jQuery("#toolpanel tbody > tr");
		}else{
			arrChildren = getChildren(aController);
		}
		arrSubModel = findNodeFormChildren(arrChildren,"model");
		//初始化select
		jQuery("#view_model").find("option[value!='0']").remove();
		$.each(arrSubModel,function(v,b){
			var sModelId = jQuery(b).attr("id");
			jQuery("#view_model").append('<option value="'+sModelId+'">'+sModelId+'</option>');
		});
	}
	
	//初始化命名空间
	function initNameSpaceSelect(){
		for(var key in namespaceData){
			jQuery("#namespaceSelect").append("<option value='"+key+"'>"+key+"</option>");
			jQuery("#view_namespace").append("<option value='"+key+"'>"+key+"</option>");
		}
	}
	initNameSpaceSelect();
	
	//初始化controller选项
	function initControllerSelect(){
		for(var key in controllerNames){
			jQuery("#controller_classname").append("<option value='"+controllerNames[key]+"'>"+controllerNames[key]+"</option>");
		}
	}
	initControllerSelect();
	
	//初始化orm关系表
	function initOrmTopSelect(){
		for(var key in ormData){
			jQuery("#model_orm-start").append("<option value='"+key+"'>"+key+"</option>");
		}
	}
	initOrmTopSelect();
	
	//初始化 视图类型 选择
	function initView_classSelect(){
		for(var key in viewNames){
			jQuery("#view_class").append("<option value='"+viewNames[key]+"'>"+viewNames[key]+"</option>");
		}
	}
	initView_classSelect();
	
	
	
	//表格点击后..
	jQuery(treeTableId + " tbody tr").live("click",function(){
		//选中
		setSelected(jQuery(this));
		// $('.propertys').find(':visible').find('.object_name').focus();
	});
	//
	jQuery("#verifier_verifierType").live("change",function(){
		rebuildVerifierProperty(jQuery(this).val());
	});
	//选择orm关系的起点
	jQuery("#model_orm-start").live("change",function(){
		rebuildOrmProperty();
	});
	
	
	//用户请求添加一层orm关系
	jQuery("#model_orm_div").find("input").live("change",function(){
		if(jQuery(this).prop("checked")){
			//添加层次
			addOrmTree(jQuery(this).parents("li").first(),jQuery(this).attr("id").split("|")[0]);
			var aOrmTreeData = getOrmTreeData(jQuery("#model_orm_div > ul"),'');
			jQuery("#model_orm-data").data("value",aOrmTreeData[0]);
			jQuery("#model_widgetcolumbmap").data("widgetcolumbmap",aOrmTreeData[1]) ;
		}else{
			//删除层次
			jQuery(this).nextAll("ul").remove();
			//如果表单中有完整的树结构(至少有一个checkbox被选中)就建立数据给model_orm-data,如果没有,删除以前的数据
			if(jQuery("#model_orm_div").find("input:checked").length > 0){
				var aOrmTreeData = getOrmTreeData(jQuery("#model_orm_div > ul"),'');
				jQuery("#model_orm-data").data("value",aOrmTreeData[0]);
				jQuery("#model_widgetcolumbmap").data("widgetcolumbmap",aOrmTreeData[1]) ;
			}else{
				jQuery("#model_orm-data").removeData("value");
				jQuery("#model_widgetcolumbmap").removeData("widgetcolumbmap") ;
			}
		}
	});
	
	
	//view数据交换
	jQuery("#view_model").change(function(){
		jQuery("#view_model_table tbody > tr").remove();
		addNewTrForDataExchange();
	});
	//删除tr
	jQuery(".del_dbmap").live("click",function(){
		jQuery(this).parents("tr").first().remove();
		saveDataExchangeData();
	});
	//数据保存
	jQuery(".view_dbmap_widget, .view_dbmap_column").live("change",function(){
		saveDataExchangeData();
	});
	
	$("#view_aloneClass").live("change",function(){
		if($(this).prop("checked")){
			$("#view_namespace ,#view_classname").prop("disabled",false);
			if($('#view_classname').val().length == 0 && $('#view_name').val().length > 0){
				$('#view_classname').val( $('#view_name').val() );
				$("#view_classname").val($('#view_name').val()[0].toUpperCase()+$('#view_name').val().substr(1));
			}
		}else{
			$("#view_namespace ,#view_classname").prop("disabled",true);
		}
	});
	$("#view_namespace ,#view_classname").live('change',saveViewExtendClass);
	function saveViewExtendClass(){
		var namespaceSelectValue = $("#view_namespace").val();
		var className = $("#view_classname");
		if(className.val().length > 0){
			$("#view_classname").val(className.val()[0].toUpperCase()+className.val().substr(1));
		}
		if(namespaceSelectValue == 0 || className.val().length < 1){
			$("#view_filepath").val('');
			return;
		}
		var filepath = namespaceData[namespaceSelectValue]["folder"];
		$("#view_filepath").val(filepath+'/'+className.val()+'.php');
	}
	
	//初始化 视图命名控件 选择
	function initView_nameSpaceSelect(){
		for(var key in viewNamespace){
			jQuery("#view_templateFolder").append("<option value='"+viewNamespace[key]+"'>"+viewNamespace[key]+"</option>");
		}
	}
	initView_nameSpaceSelect();
	
	//用ajax发送编译请求
	function generateCode(bDoSave){
		var encoded = $.toJSON(treeData);
		var url = window.location;
		var bCoverExistFile = '0';
		if($('#coverExistFile').prop('checked')){
			bCoverExistFile = '1';
		}
		var data = "&data="+encoded+"&act=generate";
		if(bDoSave){
			data += "&act.generate.save=1&cover="+bCoverExistFile;
		}
		$.ajax({
			type: "POST",
			url: url,
			data: data,
			success: function(msg){
				if(bDoSave){
					jQuery("#preview_div").html("").append(msg);
				}else{
					jQuery("#preview_div").html("").append("<textarea style='border: 1px solid #94BBE2;width:100%;' rows=15 onpropertychange='this.style.posHeight=this.scrollHeight' id=textarea onfocus='textarea.style.posHeight=this.scrollHeight'></textarea>").find('textarea').html(msg);
				}
			}
		});
	}
	
	
	
	//命名空间部分被编辑时触发
	jQuery("#className").change(nameSpaceEdit);
	jQuery("#namespaceSelect").change(nameSpaceEdit);
	
	//视图名称变化时自动生成template
	jQuery("#view_name").keyup(function(){
		// if(extensionName == ""){
			// return;
		// }
		var name = jQuery(this).val();
		if(name.length > 0){
			name = name[0].toUpperCase()+name.substr(1);
		}
		
		jQuery("#view_template").val('view'+name+".template.html");//extensionName + "_" +jQuery(this).val()+".template.html");
	});
	
	//添加按钮功能
	jQuery(".topButtons").click(function(){
		var sNewType = getBtnType(jQuery(this));
		var newNodeName = getAName();
		makeNewNode(null,newNodeName,sNewType);
		return false;
	});
	
	//鼠标浮动在对象tr上方的时候显示subbuttons
	treeTable.find("tbody").find("tr").live("mouseover",trMouseOver);
	function trMouseOver(){
		subBtnsDisplay(true);
		subBtnsPosition(jQuery(this));
		accessOfBtns(jQuery(this));
	}
	treeTable.find("tbody").find("tr").live("mouseout",trMouseOut);
	function trMouseOut(){
		subBtnsDisplay(false);
		accessOfBtns(null);
	}
	
	//添加子对象按钮功能
	jQuery(".subButtons").click(function(){
		if($(this).hasClass('sub_btn_disabled')){
			return false;
		}
		var sNewType = getBtnType(jQuery(this));
		var selectedTr = jQuery(this).parents("tr").first();
		if(sNewType == "delete"){
			deleteTr(selectedTr);
			return false;
		}
		var newNodeName = getAName();
		if(selectedTr.length <= 0){
			//目前没有node,显示所有的btn
			makeNewNode(null,newNodeName,sNewType);
			return false;
		}
		makeNewNode(selectedTr,newNodeName,sNewType);
		return false;
	});
	
	//widget 类型选择
	jQuery("#widget_widgetType").live("change",function(){
		widgetTypeChange(null);												   
	});
	
	//添加optoions
	jQuery("#add_option").click(function(){
		jQuery(this).parents("tr").before('<tr><td class="options"></td><td class="options"></td><td><input type="checkbox" class="nosave"/></td><td><a class="del_option" title="点击删除选项" href="#">删</a></td></tr>');
		return false;
	});
	
	//可编辑表格
	jQuery("#widget_options_table .options").live("click" , function(){
		var aTd = jQuery(this);
		var sTdText = aTd.text();
		aTd.text("").append('<input type="text" value="'+sTdText+'"/>');
		var aNewInput = aTd.find("input");
		aNewInput.focus();
		aNewInput.live("focusout",function(){
			var sNewValue = aNewInput.val();
			aTd.text(sNewValue);
			saveOptionsData();
		});
	});
	//删除可编辑表格的行
	jQuery("#widget_options_table .del_option").live("click",function(){
		jQuery(this).parents("tr").remove();
		saveOptionsData();
	});
	//select的options数据的保存行为通过3个行为触发,1.是编辑表格后触发,2.是点击"选中"checkbox后触发,3.是删除时触发 可以搜索函数名saveOptionsData找到所有的触发点 
	//这里处理"选中"checkbox的触发情况
	jQuery("#widget_options_table td input:checkbox").live("click",function(){
		saveOptionsData();
	});
	
	//只生成代码
	jQuery("#generate_code").click(function(){
		generateCode(false);
	});
	//生成代码并保存
	jQuery("#save_code").click(function(){
		generateCode(true);
	});
	
	//对象树中checkbox的点击事件
	treeTable.find('input:checkbox').live('click',function(e){
		var aParentTr = $(this).parents('tr').first();
		if(getNodeType(aParentTr) == 'view'){
			var generationLoadWidgets = 'generationLoadWidgets';
			var generationProcessForm = 'generationProcessForm';
			var generationLoadModel = 'generationLoadModel';
			var generationSaveModel = 'generationSaveModel';
			
			var data = aParentTr.data('property');
			if(data['model'] != 0){
				if( this.checked && $(this).attr('class') == generationLoadWidgets){
					if(this.checked){
						$('#'+data['model']).find('.'+generationLoadModel).prop('checked' , true );
						$('#'+data['model']).data('property')[generationLoadModel] = true;
					}
				}else if( this.checked && $(this).attr('class') == generationProcessForm ){
					$('#'+data['model']).find('.'+generationSaveModel).prop('checked' , this.checked );
					$('#'+data['model']).data('property')[generationSaveModel] = this.checked;
				}
			}
		}
		aParentTr.data('property')[$(this).attr('class')] = this.checked;
		e.stopPropagation();//停止冒泡
	});
	
	//属性提交property
	jQuery("#controller_property input,#controller_property select").live("focusout",saveForm);
	jQuery("#view_property input,#view_property select").live("focusout",saveForm);
	jQuery("#widget_property input,#widget_property select").live("focusout",saveForm);
	jQuery("#verifier_property input,#verifier_property select").live("focusout",saveForm);
	jQuery("#model_property input,#model_property select").live("change focusout",saveForm);
	
});