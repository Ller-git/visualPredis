<?php
/**
 * 请求处理，路由文件
 */
class Router
{	 
	/**
	 * 开始奔跑
	 * @return [type] [description]
	 */
	public function run()
	{
		if (isset($_SERVER['PATH_INFO'])) {

			/* 初步整理PATH_INFO */
			$pathinfo = $_SERVER['PATH_INFO'];
			$pathinfo = explode('/', $pathinfo);
			array_shift($pathinfo);
			$class = $pathinfo[0];		// 请求类
			array_shift($pathinfo);
			$function = $pathinfo[0];	// 请求方法
			array_shift($pathinfo);


			/* 设置请求参数 */
			if ($_SERVER['REQUEST_METHOD'] == 'GET') {
				// 本来打算pathinfo模式来着，不过axios的pathinfo嗯，跟我想的不一样只能这样了
				$params = $_GET;

				for ($i=0; $i<count($pathinfo); $i+=2) { 
					$params[$pathinfo[$i]] = isset($pathinfo[$i+1]) ?$pathinfo[$i+1] : '';
				}
			} elseif ($_SERVER['REQUEST_METHOD'] == 'POST') {
				$params = $_POST;

				// 还有一个需要接收json字符串之类的东西, 解析我就不解析了, 因为并非每次都用的上.
				$params['JSON'] = isset($GLOBALS['HTTP_RAW_POST_DATA']) ? $GLOBALS['HTTP_RAW_POST_DATA'] : file_get_contents('php://input');
			} else {
				throw new LlerError(errorCode::UNDEFINED_ACTION);
			}


			/* 绿色通道吧，服务如果未启动需要切换服务，这个时候我们就不能添加redis服务实例 */
			include './core/llerRedis.class.php';
			if (!isset($params['redis_config'])) {
				$params['redis'] = LlerRedis::connect();
			}


			/* 文件是否存在 */
			$full_path = './class/'.$class.'.class.php';
			if (!file_exists($full_path)) {
				throw new LlerError(errorCode::FILE_NONEXISTS);
			}
			include $full_path;


			/* 类是否存在，万一类名和文件名不一致 */
			if (!class_exists($class)) {
				throw new LlerError(errorCode::CLASS_NONEXISTS);
			}
			$runClass = new $class();


			/* 类当中是否存在这个方法 */
			if (!method_exists($runClass, $function)) {
				throw new LlerError(errorCode::FUNCTION_NONEXISTS);
			}
			$data = $runClass->$function($params);


			/* 将return的数据，json格式打印出来 */
			if ($data != '') {
				response($data);
			}
		} else {
			throw new LlerError(errorCode::UNDEFINED_PATHINFO);
		}
	}
}