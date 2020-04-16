<?php
/**
 * 核心文件
 */
require './core/errorCode.class.php';
require './core/llerError.class.php';
require './core/router.class.php';

// 原来我写到了方法里面，但是当绿色通道的时候不执行那个方法，所以session保存没有成功。
session_start();


// 打印函数
function dd () {
	echo "<pre>";
	var_dump(func_get_args());
	echo "</pre>";
}


// 输出json
function response($data) {
	header('Content-Type:application/json;charset=utf-8');
	echo json_encode($data, JSON_UNESCAPED_SLASHES);
	exit(0);
}

// 异常处理函数
function exceptionHandler ($exception) {
	// 我不知道为什么错误也会被异常捕获到
	if ($exception instanceof error) {
		dd(['message' => $exception->getMessage(), 'file' => $exception->getFile(), 'line' => $exception->getLine()]);
	} else {
		if ($exception instanceof LlerError) {
			$result['code'] = $exception->getCode();
			$result['message'] = $exception->getMessage();
			response($result);
		} else {
			$code = $exception->getCode();
			if ($code == 10061) {
				$result['code'] = $code;
				$result['message'] = 'redis后台未启动，建议服务端redis-server启动服务或者在更多里面切换服务。';
				include './class/service.class.php';
				$result['data'] = (new Service)->get();
				// $result['message'] = iconv("gb2312//IGNORE", "utf-8", $message);
				response($result);
			}

			// 打印错误方便调试
			dd($exception);
		}
	}
}
set_exception_handler('exceptionHandler');

$router = new Router();
$router->run();