<?php
require './class/expire.trait.php';

class Update
{
	use Expire;		// 由于可能很多类都需要设置键的生存时间，所以采用了trait的方式复用。


	/**
	 * 切换数据库
	 * @param  [type] $request [description]
	 * @return [type]          [description]
	 */
	public function switchDB($request)
	{
		// 这里不用使用redis改变啊，因为前台每次请求后台都会重新选择数据库，我这里只需要修改session就行了
		$_SESSION['ller_redis_db'] = $request['index'];		// 每次执行连接都相当于重新连接，用session保存下来

		response(['message'=>'请求数据库成功', 'code'=>666, 'data'=>$_SESSION['ller_redis_db']]);
	}


	/**
	 * 字符串
	 * @return [type] [description]
	 */
	public function string()
	{
		// string没有修改，它的新增就可以作为修改
	}


	/**
	 * 哈希
	 * @return [type] [description]
	 */
	public function hash($request)
	{
		// json_params{key: '', expire: -1, field:'', value: ''}
		$redis = $request['redis'];
		$json = json_decode($request['JSON'], true);
		
		// 它采取的是覆盖，如果说已经有了这个字段，它仍然会修改值，不过由于已经存在字段，会返回false
		$result = $redis->hset($json['key'], $json['field'], $json['value']);
		$this->expire($request);
		
		response(['message'=>'Saved', 'code'=>666]);
	}


	/**
	 * 列表, 类似队列, 这个必须有修改方法。
	 * @return [type] [description]
	 */
	public function list($request)
	{
		// json_params{key: '', expire: -1, index: '', vaule: ''}
		$redis = $request['redis'];
		$json = json_decode($request['JSON'], true);
		$result = $redis->lSet($json['key'], $json['index'], $json['value']);
		$this->expire($request);
		response(['message'=>'Saved', 'code'=>666]);
	}


	/**
	 * 集合
	 * @param [type] $request [description]
	 */
	public function set($request)
	{
		// set没有修改，只有删除和新增
	}


	/**
	 * 有序集合
	 * @param [type] $request [description]
	 */
	public function zset($request)
	{
		// 1. json_params{key: '', expire: -1, score: '', member: ''}
		$redis = $request['redis'];
		$json = json_decode($request['JSON'], true);

		// 2. 修改数据
		$result = $redis->zadd($json['key'], $json['score'], $json['member']);

		// 3. 生存时间
		$this->expire($request);

		// 4. 响应结果
		response(['message'=>'Saved', 'code'=>666]);
	}
}