<?php
class Select
{
	/**
	 * 这个键是否存在
	 * @return [type] [description]
	 */
	public function exist($request)
	{
		$redis = $request['redis'];
		$key = $request['key'];
		$result = $redis->exists($key);
		response($result);

	}


	/**
	 * 详细信息
	 * @param  [type] $request [description]
	 * @return [type]          [description]
	 */
	public function info($request)
	{
		$redis = $request['redis'];
		$response = $redis->info();
		array_pop($response);
		response($response);
	}


	/**
	 * 查看数据库信息
	 * @param  [type] $request [description]
	 * @return [type]          [description]
	 */
	public function database($request)
	{
		$redis = $request['redis'];
		$db_num =  $redis->config('get','databases');
		$keyspace = $redis->info('Keyspace');
		$response = array();
		for ($i=0; $i<$db_num['databases']; $i++) { 
			$name = 'db'.$i;
			$response[$name] = $keyspace['Keyspace'][$name] ?? array('keys'=>0,'expires'=>0,'avg_ttl'=>0);
		}
		
		return ['Keyspace'=>$response];
	}


	/**
	 * 键名分组
	 * @param  [type] $keys [description]
	 * @return [type]       [description]
	 */
	protected function group($keys, $redis)
	{
		$group_key = array();
		foreach ($keys as $val) {
			$indexs = explode(':', $val);		// 分组之后的单个索引
			$transfer = &$group_key;			// 代表当前操作的数组的变量

			// 判断是否需要进行分组
			if ($indexs > 1) {
				$current_key = $indexs[0];	// 给当前操作的给一个默认key
				$len = count($indexs);		// 为了组装key，但是又不能影响循环次数，提前获取长度。
				array_push($indexs, '');	// 让它的长度始终要比真正的多一，要不组装key就会报错
				for ($i=0; $i < $len; $i++) { 
					if (!isset($transfer[$indexs[$i]])) {
						$transfer[$indexs[$i]] = array();
					}
					$transfer = &$transfer[$indexs[$i]];
					$transfer['type'] = $redis->type($current_key);
					$transfer = &$transfer['child'];
					// 组装当前操作的key
					$current_key = $current_key.':'.$indexs[$i+1];
				}
			} else {
				$transfer['type'] = $redis->type($indexs[count($index)-1]);
			}
		}
		
		return $group_key;
	}


	/**
	 * 获取当前数据库的所有键
	 * @param  [type] $request [description]
	 * @return [type]          [description]
	 */
	public function all($request)
	{
		$redis = $request['redis'];
		$key = $redis->keys('*');
		sort($key);
		$response = $this->group($key, $redis);
		response($response);
	}


	/**
	 * 匹配符合规则的所有键
	 * @param  [type] $request [description]
	 * @return [type]          [description]
	 */
	public function matched($request)
	{
		$redis = $request['redis'];
		$matched = $request['matched'];

		$key = $redis->keys($matched);

		$response = $this->group($key, $redis);
		response($response);
	}


	/**
	 * 键的信息
	 * 键的类型，生存时间，长度
	 * @return [type] [description]
	 */
	public function keyInfo($request)
	{
		// $limit, $pages, $key
		$redis = $request['redis'];

		$type = strtolower($redis->type($request['key']));

		// 因为response方法里面会停止程序，故不用break跳出循环了
		switch ($type) {
			case 'string':
				response($this->stringInfo($request));
			case 'hash':
				response($this->hashInfo($request));
			case 'list':
				response($this->listInfo($request));
			case 'set':
				response($this->setInfo($request));
			case 'zset':
				response($this->zsetInfo($request));
			default:
				throw new LlerError(errorCode::UNDEFINED_KEYTYPE);			
		}
	}


	/**
	 * 字符串类型的信息
	 * @return [type] [description]
	 */
	private function stringInfo($request)
	{
		$redis = $request['redis'];
		$key = $request['key'];

		$result['type'] = 'string';
		$result['length'] = $redis->strlen($key);
		$result['ttl'] = $redis->TTL($key);
		$result['val'] = $redis->get($key);
		
		return $result; 
	}


	/**
	 * 哈希串类型的信息
	 * @return [type] [description]
	 */
	private function hashInfo($request)
	{
		$redis = $request['redis'];						//predis类的实例
		$key = $request['key'];							//要操作的键
		$limit = isset($request['limit']) ? $request['limit'] : 100; 	// 默认每页100
		$page = isset($request['page']) ? $request['page'] : 0; 	// 默认初始页面为0

		$result['type'] = 'hash';					
		$result['length'] = $redis->hlen($key);					// hash长度
		/**
		 * ceil(3.1415926) 进一取整，	floor(4.3) 向下取整，仍然为float类型
		 * round()四舍五入				intval()向下取整，变为int类型
		 */
		$result['pages'] = ceil($result['length'] / $limit);	//总页数
		if ($page > $result['pages'] || $page < 0) {
			$page = 0;
		}
		$result['page'] = $page;								//当前页码

		$result['ttl'] = $redis->TTL($key);
		$allVal = $redis->hGetAll($key);
		/**
		 * 碰见过每次赋值之后的数组顺序不一样，所以在没有搞清楚之前根据键排序，对于帮助页面显示也是有顺序的
		 * ksort()升序，krsort()降序，关联数组的键
		 * asort()升序，arsort()降序，关联数组的值
		 * sort()升序，rsort()降序，下标数组对值的排序
		 */
		ksort($allVal);

		/**
		 * array_splice从数组中移除元素，并用新元素取代它
		 * array_slice() 函数在数组中根据条件取出一段值，并返回。
		 * array_slice()第三个参数为是否保留原来的键值。
		 */
		$start = $page * $limit;
		$result['val'] = array_slice($allVal, $start, $limit, true);

		return $result;
	}


	/**
	 * 列表类型的信息
	 * @return [type] [description]
	 */
	private function listInfo($request)
	{
		$redis = $request['redis'];
		$key = $request['key'];
		$limit = isset($request['limit']) ? $request['limit'] : 100; 	// 默认每页100
		$page = isset($request['page']) ? $request['page'] : 0; 	// 默认初始页面为0

		$result['type'] = 'list';
		$result['length'] = $redis->llen($key);
		$result['ttl'] = $redis->TTL($key);

		$result['pages'] = ceil($result['length'] / $limit);	//总页数
		if ($page > $result['pages'] || $page < 0) {
			$page = 0;
		}
		$result['page'] = $page;

		$start = $page * $limit;
		$stop = $start + $limit - 1;
		
		// 取出数据放在临时变量里面
		$temp = $redis->lrange($key, $start, $stop);

		// 循环临时变量重新给值定义下标
		foreach ($temp as $key => $value) {
			$index = $start+$key;
			$result['val'][$index] = $value;
		}

		return $result;
	}


	/**
	 * 集合串类型的信息
	 * @return [type] [description]
	 */
	private function setInfo($request)
	{
		$redis = $request['redis'];
		$key = $request['key'];
		$limit = isset($request['limit']) ? $request['limit'] : 100; 	// 默认每页100
		$page = isset($request['page']) ? $request['page'] : 0; 	// 默认初始页面为0

		$result['type'] = 'set';
		$result['length'] = $redis->scard($key);
		$result['ttl'] = $redis->TTL($key);
		$result['pages'] = ceil($result['length'] / $limit);	//总页数
		if ($page > $result['pages'] || $page < 0) {
			$page = 0;
		}
		$result['page'] = $page;

		$allVal = $redis->smembers($key);
		asort($allVal);

		$start = $limit * $page;

		$result['val'] = array_slice($allVal, $start, $limit);
		return $result;
	}


	/**
	 * 有序集合类型的信息
	 * @return [type] [description]
	 */
	private function zsetInfo($request)
	{
		$redis = $request['redis'];
		$key = $request['key'];
		$limit = isset($request['limit']) ? $request['limit'] : 100; 	// 默认每页100
		$page = isset($request['page']) ? $request['page'] : 0; 	// 默认初始页面为0

		$result['type'] = 'zset';
		$result['length'] = $redis->zcard($key);
		$result['ttl'] = $redis->TTL($key);
		$result['pages'] = ceil($result['length'] / $limit);	//总页数
		if ($page > $result['pages'] || $page < 0) {
			$page = 0;
		}
		$result['page'] = $page;
		
		$start = $limit * $page;

		// 在数据库当中是如何存储的，并不知道，但是predis取数据是按照{score: value, score2: value}并非[[score, value], [score2, value]]取数据的，所以zrange()取出来的数据是按照score为索引的，所以在这里先取出来全部数据，进行排序。没想到zrangebyscore也是根据score为索引取数据的，而不是一个数组里面有关联数组，而是关联数组里面
		// zrange刚开始由于取数组无法取到score的值，只能获取到member的值，所以我用zrangebyscore，zrangebyscore无法获取全部值，也就是说（0， -1）是无法使用的，他只能（0， 你的最大索引范围），由于有序列表并非像是列表索引固定的，1，2，3，它可能是 122，196，256这样的方式存储的，同时它也不是[[score, value], [score2, value]]存在的，所以最终还是选择了zrange
		$allVal = $redis->zrange($key, 0, -1, 'withscores');

		// array_slice(数组，开始位置，取几个，是否保留原来键名，默认不保存)
		$result['val'] = array_slice($allVal, $start, $limit);
		return $result;
	}
}