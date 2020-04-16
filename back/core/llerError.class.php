<?php
/**
 * 自定错误处理类
 */
class LlerError extends Exception
{
	public function __construct($arr, Throwable $previous = null)
	{
		$code = $arr[0];
		$message = $arr[1];
		
		// message必须要在code前面否则就会出错。
		parent::__construct($message, $code, $previous);
	}
}