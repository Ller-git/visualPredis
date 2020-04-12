<?php
class Delete
{
	/**
	 * 删除字符串，不仅字符串，比如说整个哈希也要删除
	 * @return [type] [description]
	 */
	public function string($request)
	{
		$redis = $request['redis'];
		$result = $redis->del($request['key']);
		response(['message'=>'Deleted', 'code'=>666]);
	}


	/**
	 * 删除哈希
	 * @return [type] [description]
	 */
	public function hash($request)
	{
		$redis = $request['redis'];
		
		// 如果这个字段不存在，那么我就当成删除这一个整个键
		if (!isset($request['field'])) {
			$this->string($request);
		}
		
		$result = $redis->hdel($request['key'], $request['field']);
		response(['message'=>'Deleted', 'code'=>666]);
	}


	/**
	 * 删除列表
	 * @return [type] [description]
	 */
	public function list($request)
	{
		$redis = $request['redis'];

		// 如果这个字段不存在，那么我就当成删除这一个整个键
		if (!isset($request['index'])) {
			$this->string($request);
		}

		// lrem(key，从左边第几个开始或者右边第几个开始数，是值不是索引)
		// phpredisadmin，由于这个值是被删除的，所以先给一个任意值，确保存在，然后根据值删除。由于重新给了它一个随机值，所以也不怕有重复的，但是怎么说，万一撞上了咋办。$value = str_rand(69);$redis->lSet($_GET['key'], $_GET['index'], $value);
		// 我想先根据索引查找这个值，然后lrem(key, 索引，值)删除，这样是不是要比上面的那个搜索范围小，不过由于命令行全部都是10/xef之类的东西，没法看汉字所以不了了之。		
		$value = rand(69);
		$redis->lSet($request['key'], $request['index'], $value);
		$result = $redis->lRem($request['key'], 1, $value);
		response(['message'=>'Deleted', 'code'=>666]);
	}


	/**
	 * 删除集合
	 */
	public function set($request)
	{
		$redis = $request['redis'];

		// 如果这个字段不存在，那么我就当成删除这一个整个键
		if (!isset($request['value'])) {
			$this->string($request);
		}

		$result = $redis->sRem($request['key'], $request['value']);
		response(['message'=>'Deleted', 'code'=>666]);
	}


	/**
	 * 删除有序集合
	 * @return [type] [description]
	 */
	public function zset($request)
	{
		$redis = $request['redis'];

		// 如果这个字段不存在，那么我就当成删除这一个整个键
		if (!isset($request['member'])) {
			$this->string($request);
		}
		
		// 我也不知道是score的值还是member的值，待实验
		$result = $redis->zRem($request['key'], $request['member']);
		response(['message'=>'Deleted', 'code'=>666]);
	}
}
