<?php
/**
 * 定义常用异常信息，抛出异常，便于整理信息。
 */
class ErrorCode
{
	const UNDEFINED_ACTION = [1000, '不允许GET,POST以外的请求方法'];
	const UNDEFINED_PATHINFO = [1001, 'PATH_INFO为空'];
	const FILE_NONEXISTS = [1002, '访问的文件不存在'];
	const CLASS_NONEXISTS = [1003, '访问的类不存在'];
	const FUNCTION_NONEXISTS = [1004, '访问的方法不存在'];
	const UNDEFINED_KEYTYPE = [1005, '未定义的键的类型，或不在当前操作的数据库'];

	const UNKNOWN_ERROR = [1500, '未知错误'];
}