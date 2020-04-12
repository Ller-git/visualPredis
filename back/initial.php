<?php
	return [
		[
			'name' => 'localhost:6379', 		//别名
			'host' => 'localhost',			//服务器地址
			'port' => '6379',				//端口
			'password' => 123456,			//密码，有则输入，无不用修改
			'persistent' => false 			//长连接
		],
		[
			'name' => 'localhost6389', 		//别名
			'host' => 'localhost',			//服务器地址
			'port' => '6389',				//端口
			'password' => 123456,			//密码，有则输入，无不用修改
			'persistent' => true 			//长连接
		]
	];