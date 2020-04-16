<?php
/**
 * redis服务
 */
class Service
{
	/**
	 * 获取我都有那个配置项
	 * @return [type] [description]
	 */
	public function get()
	{
		$config = include './config.php';	
		$result = array();
		foreach ($config as $key => $value) {
			array_push($result, $value['name']);
		}
		return $result;
	}


	/**
	 * 切换服务配置
	 * @return [type] [description]
	 */
	public function switch($request)
	{
		$config = include './config.php';	// 所有配置项
		$index = $request['index'];		// 配置项的索引

		$temporary = $config[0];
		$config[0] = $config[$index];
		$config[$index] = $temporary;

		$this->set($config);
	}


	/**
	 * 接收数组，把这个数组放到配置文件里面
	 */
	public function set($arr)
	{
		$data = '<?php'.PHP_EOL.'return'."\t".var_export($arr, true).';';
		file_put_contents('config.php', $data);
	}


	/**
	 * 向配置文件添加一个新的
	 */
	public function add($request)
	{
		// http://localhost/predis/back/index.php/test/add/name/one/host/127/port/1234/password/123456
		// 别名name, 服务器host, 端口port，密码password, 是否长连接persistent
		$config = include './config.php';
		$new = array(
			'name'=>$request['name'], 
			'host'=>$request['host'],
			'port'=>$request['port'],
			'password'=>$request['password']
		);
		array_push($config, $new);
		$this->set($config);
		return ['message'=>'添加配置成功', 'code'=>666];
	}



	// -------------------------------------下面暂时不打算用的----------------------------------------
	/**
	 * 暂时删除配置不可以用
	 * @return [type] [description]
	 */
	private function _del($request)
	{
		// http://localhost/predis/back/index.php/test/del/index/0
		$config = include './config.php';		// 获取配置文件内容
		$index = $request['index'];				// 接收index参数，数组从零开始啊

		if (!isset($config[$index])) {
			response(['message'=>'配置项不存在', 'code'=>1234]);
		}
		dd($index, $config);

		array_splice($config, $index, 1);		// 删除某个数组
		$this->set($config);
	}


	/**
	 * 恢复默认配置
	 * @return [type] [description]
	 */
	public function init()
	{
		$config = include './inital.php';
		file_put_contents('./config.php', $config);
	}
}