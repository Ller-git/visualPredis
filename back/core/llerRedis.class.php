<?php
/**
 * predis 连接redis
 */
class LlerRedis
{
	/**
	 * 连接redis服务，并选择当前数据库
	 * @return [type] [description]
	 */
	static public function connect()
	{
		include './predis/Autoloader.php';
		Predis\Autoloader::register();

		/* 连接redis服务器 */
		$config = include './config.php';
		$redis = new Predis\Client($config[0]);	

		/* 保存当前操作的数据库索引 */
		if(isset($_SESSION['ller_redis_db'])) {
			$redis->select($_SESSION['ller_redis_db']);
		} else {
			dd($_SESSION['ller_redis_db']);
			$_SESSION['ller_redis_db'] = 0;
			$redis->select($_SESSION['ller_redis_db']);
		}

		return $redis;
	}
}