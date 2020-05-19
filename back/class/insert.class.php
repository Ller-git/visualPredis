<?php
include realpath('./class/expire.trait.php');

class Insert
{
	use Expire;

	/**
	 * 判断这个参数是否为空，为空返回empty
	 * @return [type] [description]
	 */
	public function empty($name)
	{
		if ($name == '') {
			$name = '<empty>';
		}
		return $name;
	}

	/**
	 * 字符串
	 * @param  [type] $request [description]
	 * @return [type]          [description]
	 */
	public function string($request)
	{
		$redis = $request['redis'];
		$json = json_decode($request['JSON'], true);

		// 字段一旦为空，那么就给他赋值empty
		$json['key'] = $this->empty($json['key']);

		$result = $redis->set($json['key'], $json['value']);
		$this->expire($request);

		response(['message'=>'Saved', 'code'=>666]);
	} 


	/**
	 * 哈希
	 * @param  [type] $request [description]
	 * @return [type]          [description]
	 */
	public function hash($request)
	{
		// 1. 收集需要的参数，json_params: {key: 'key', expire: -1, hash: [{field: '', value: ''}]}
		$redis = $request['redis'];
		$json = json_decode($request['JSON'], true);	//解析传递的json字符串
		$hash = array();								// 将要存储的哈希字段和哈希值
		$json['key'] = $this->empty($json['key']);		// 字段一旦为空，那么就给他赋值empty

		// 2. 负责添加数据
		foreach ($json['hash'] as $key => $value) {
			// 哈希字段名不能为空字符串
			$value['field'] = $this->empty($value['field']);
			$hash[$value['field']] = $value['value'];
		}
		$result = $redis->hmset($json['key'], $hash);

		// 3. 生存时间修改
		$this->expire($request);

		// 4. 响应数据
		response(['message'=>'Saved', 'code'=>666]);

	}


	/**
	 * 列表
	 * @param  [type] $request [description]
	 * @return [type]          [description]
	 */
	public function list($request)
	{
		// 1. json_params: {key: 'key', expire: -1, methods: 'left', list: [{value: ''}, {value: ''}] }	
		$redis = $request['redis'];
		$json = json_decode($request['JSON'], true);
		$methods = isset($json['methods']) ? $json['methods'] : 'right';	// 默认从后面添加。判别left or right
		$json['key'] = $this->empty($json['key']);						// 字段一旦为空，那么就给他赋值empty
		$result = array();												//用来保存多个队列的结果

		// 2. 向列表添加数据。队列就是只能一个一个添加
		if ($methods == 'left') {
			foreach ($json['list'] as $key => $value) {
				$value['value'] = $this->empty($value['value']);
				$result[$key] = $redis->lpush($json['key'], $value['value']);
			}
		} else {
			foreach ($json['list'] as $key => $value) {
				// 2020.04.06 操作的时候有一个列表类型无法正常使用。
				// 键名：list1536， rpush无法使用，redis-manager与redis命令行都无法正常执行命令，其它键名一切正常
				$value['value'] = $this->empty($value['value']);
				$result[$key] = $redis->rpush($json['key'], $value['value']);
			}
		}

		// 3. 改正时间
		$this->expire($request);

		// 4. 返回结果
		response(['message'=>'Saved', 'code'=>666]);

	}


	/**
	 * 集合
	 * @param [type] $request [description]
	 */
	public function set($request)
	{
		// 1. json_params: {key: 键, set: [{value: ''}]}	
		$redis = $request['redis'];
		$json = json_decode($request['JSON'], true);
		$set = array();

		// 2. 添加数据
		foreach ($json['set'] as $key => $value) {
			$value['value'] = $this->empty($value['value']);
			array_push($set, $value['value']);
		}
		$result = $redis->sadd($json['key'], $set);

		// 3. 生存时间修改
		$this->expire($request);

		// 4. 响应数据
		response(['message'=>'Saved', 'code'=>666]);
	}


	/**
	 * 有序集合
	 * @param  [type] $request [description]
	 * @return [type]          [description]
	 */
	public function zset($request)
	{
		//1. json_params: {key: 'key', expire: -1, zset: [{member: 100, score: 117010410}]}
		$redis = $request['redis'];
		$json = json_decode($request['JSON'], true);	//解析传递的json字符串
		$zset = array();	// 将要存储的哈希字段和哈希值

		// 2. 数据的添加
		foreach ($json['zset'] as $key => $value) {
			$value['member'] = $this->empty($value['member']);
			$zset[$value['member']] = $value['score'];
		}
		$result = $redis->zadd($json['key'], $zset);
		
		// 3. 生存时间修改
		$this->expire($request);

		// 4. 响应数据
		response(['message'=>'Saved', 'code'=>666]);
	}
}