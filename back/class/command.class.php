<?php
class Command
{	
	/**
	 * 执行命令
	 * @param  [type] $request [description]
	 * @return [type]          [description]
	 */
	public function execute($request)
	{
		$json = $request['JSON'];
		$redis = $request['redis'];
		$commands = explode("\n", trim($json));	// 获取网站输入的命令，利用换行分割多条命令
		$arguments = array();	
		$result = array();		// 保存执行命令的结果

		// 分析命令
		foreach ($commands as $val) {
			$data = explode(' ', trim($val));
			foreach ($data as $value) {
				if ($value != '') {
					$arguments[$val][]=$value;
				}
			}
		}

		$info = 0;	// 保存执行了多少条语句
		// 执行命令
		foreach ($arguments as $key => $value) {
			$commandId = $arguments[$key][0];
			array_shift($arguments[$key]);
			try{
				$YN = $redis->redis($commandId, ...$arguments[$key]);
				$result[$key] = $YN;
			}catch(Throwable $Throwable) {
				$info = $info + 1;
				$result[$key] = '请检查该语句';
			}
		}

		response(['message'=>'命令已执行完毕', 'code'=>666, 'data'=>$result]);
	}

	/**
	 * 导出, 只能get方式访问，其实post也可以但是axios它都是发送的json数据，所以他不可以
	 * http://localhost/predis/back/index.php/command/export/matched/*v,k
	 * @return [type] [description]
	 */
	public function export($request)
	{
		$redis = $request['redis'];		// redis实例

		$matched = explode(',', trim($request['matched']));	// 分析所有的匹配条件

		// 查找到符合规则的key
		$keys = array();
		foreach ($matched as $matched2) {
			if ($matched2 != '') {
				$data = $redis->keys(trim($matched2));
				// array_push($keys, $data);
				$keys = array_merge($keys, $data);
			}
		}

		// 去掉重复的key
		array_unique($keys);
		$file_content = '';			// 用于写入文件
		foreach ($keys as $outputKey) {
			$type = strtolower($redis->type($outputKey));
			switch($type) {
				case 'hash':
					$values = $redis->hGetAll($outputKey);
				    foreach ($values as $k => $v) {
				      $file_content .= 'HSET '.addslashes($outputKey).' '.addslashes($k).' '.addslashes($v).' '.PHP_EOL;
				    }
				break;
				case 'list':
					$size = $redis->lLen($outputKey);
				    for ($i = 0; $i < $size; ++$i) {
				      $file_content .= 'RPUSH '.addslashes($outputKey).' '.addslashes($redis->lIndex($outputKey, $i)).' '.PHP_EOL;
				    }
					break;
				case 'set':
					$values = $redis->sMembers($outputKey);
				    foreach ($values as $v) {
				      $file_content .= 'SADD '.addslashes($outputKey).' '.addslashes($v).' '.PHP_EOL;
				    }
					break;
				case 'zset':
					$values = $redis->zRange($outputKey, 0, -1);
				    foreach ($values as $v) {
				    	$s = $redis->zScore($outputKey, $v);
				    	$file_content .= 'ZADD '.addslashes($outputKey).' '.$s.' '.addslashes($v).' '.PHP_EOL;
			    	}
					break;
				case 'string':
					$file_content .= 'SET '.addslashes($outputKey).' '.addslashes($redis->get($outputKey)).''.PHP_EOL;
					break;
				default:
					$file_content .= '这个键不存在';
					break;		
			}
		}

		 
		// 发送文件头部
		header("Content-type: application/json");
		header("Content-Disposition: attachment;filename=database.json");
		header("Content-Transfer-Encoding: binary");
		header('Pragma: no-cache');
		header('Expires: 0');
		// 发送文件内容
		set_time_limit(0);
		echo $file_content;
	}


	/**
	 * [import description]
	 * @return [type] [description]
	 */
	public function import($request)
	{
		$redis = $request['redis'];
		$file = $_FILES['import']['tmp_name'];
		$request['JSON'] = file_get_contents($file);

		$this->execute($request);
	}
}