{= "<?php\r\n" }
namespace {=$arrData['namespace']} ;

{? ob_flush() }{? $theCoder->generateClassesUse($aUsedClasses,$theDevice) }

class {=$arrData['classname']} extends Controller
{
	/**
	 * 控制器初始化函数
	 * 构建所有的model,view,controller对象
	 */
	protected function init()
	{
		{? $aIter=$theCoder->childrenIterator('model'); }<clear />
		<if "$aIter->valid()"><clear />
		// ---------------------------------------------
		// 创建模型<clear />
		<foreach for="$aIter" item='arrChild'><nl />
		{? ob_flush() }{? \oc\ext\developtoolbox\coder\mvc\Model::createInstance(array($arrChild))->generate($theOutputDevPool,$theDevice)}<clear />
		</foreach><nl /><clear />
		</if><clear />
		
		{? $aIter=$theCoder->childrenIterator('view'); }<clear />
		<if "$aIter->valid()"><nl />
		// ---------------------------------------------
		// 创建视图<clear />
		<foreach for="$aIter" item='arrView'><nl /><clear />
		{? $arrView['belongsController']='1' }<clear />
		{? ob_flush() }{? \oc\ext\developtoolbox\coder\mvc\View::createInstance(array($arrView))->generate($theOutputDevPool,$theDevice)}<clear />
		<if "$arrView['model']"><nl />
		$this->{=$arrView['name']}->setModel($this->{=$arrView['model']}) ;<clear />
		</if><clear />
		</foreach><nl /><clear />
		</if><clear />
		
		{? $aIter=$theCoder->childrenIterator('controller'); }<clear />
		<if "$aIter->valid()"><nl />
		// create child controllers -------------<clear />
			<foreach for="$aIter" item='arrChild'><nl />
		$this->add( $this->{=$arrChild['name']} = new {=$arrChild['classname']}() ) ;<clear />
			</foreach><clear />
		</if><clear />
<nl />	}

	/**
	 * 执行控制器
	 */
	public function process()
	{<nl /><clear />
		{* 生成视图执行代码 }<clear />
		<foreach for="$theCoder->childrenIterator('model')" item='arrModel'><clear />
		{? ob_flush() }{? $theCoder->generateProcessingCodeForLoadModel($arrModel,$theDevice) }<nl /><clear />
		</foreach><clear />
		
		{* 生成视图执行代码 }<clear />
		<foreach for="$theCoder->childrenIterator('view')" item='arrView'><clear />
			{* 生成视图窗体数据加载的代码 }<clear />
			<if "$arrView['generationLoadWidgets']"><nl />
		// 为视图的窗体加载初始数据
		$this->{=$arrView['name']}->exchangeData(DataExchanger::MODEL_TO_WIDGET) ; 	// 数据交换：从模型到视图窗体

			</if><clear />
			<if "$arrView['generationProcessForm']"><nl />
		// ------------------------------------------
		// 处理表单视图({=$arrView['name']})的提交
		if( $this->{=$arrView['name']}->isSubmit() )
		{do{
			// 从控制器的参数中加载数据到视图的窗体中
			$this->{=$arrView['name']}->loadWidgets() ;
			
			// 校验视图窗体中的数据
			if( !$this->{=$arrView['name']}->verifyWidgets() )
			{
				break ;
			}
			
			// 数据交换：从视图窗体到模型
			$this->{=$arrView['name']}->exchangeData(DataExchanger::WIDGET_TO_MODEL) ;
			
			// 其他操作
			// todo ... ...

			<if "$arrView['model']"><clear />
			// 保存模型：
			if( $this->{=$arrView['model']}->save() )
			{
				$this->messageQueue()->create(Message::success,"记录已经保存成功。") ;	
				
				$this->{=$arrView['model']}->hideForm() ; // 隐藏表单
			}
			else
			{
				$this->messageQueue()->create(Message::error,"在保存记录时遇到了错误。") ;
			}
			</if>
			
		}while(1) ; }
		// 处理表单结束
		// ------------------------------------------<nl /><clear />
			</if><clear />
		</foreach>
	}<clear />
	{? $aIter=$theCoder->childrenIterator(array('view','model','controller')) ; }<clear />
	<if "$aIter->valid()"><nl /><nl />
	// -------------------------------------------
	// 申明控制器中所拥有的mvc对象属性
	// 对php来说申明属性并不是必须的。但是IDE能够根据显式申明，提供自动补全功能(某些高级的IDE甚至可以识别javadoc格式内的类型定义)。<nl /><clear />
	<foreach for="$aIter" item="arrChild" idx="nIdx"><if "$nIdx>0"><nl /></if>
	/**
	 * @var {=\oc\ext\developtoolbox\coder\AbstractCoder::create($arrChild)->detectClass()}<nl />
	 */
	public ${=$arrChild['name']} ;<nl /><clear />
	</foreach>
	// -------------------------------------------
	</if><nl />
}

{= '?>' }