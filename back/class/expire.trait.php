<?php
trait Expire
{
	// 设置键的存在时间
	public function expire($request)
	{
		$redis = $request['redis'];
		$json = json_decode($request['JSON'], true);
		$ttl = $json['expire'];
		$key = $json['key'];

		if($ttl == -1){
			$result = $redis->persist($key);
		}else{
			$result = $redis->expire($key, $ttl);;
		}
		return $result;
	}
}