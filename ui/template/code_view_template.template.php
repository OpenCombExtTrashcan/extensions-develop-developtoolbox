{* 显示 当前视图 的消息队列 }
{='<'}msgqueue for="$theView" /{='>'}<nl />

<if "$arrData['isForm']">
{='<'}form method="post"{='>'}<nl />
</if>
<foreach "$theCoder->childrenIterator('widget')" for="$arrWidget"><clear />
<if "$arrData['isForm']">	</if><div>{=$arrWidget['title']}: {='<'}widget id="{=$arrWidget['id']}" /{='>'}</div><nl /><clear />
</foreach>
<if "$arrData['isForm']">
{='<'}/form{='>'}
</if>