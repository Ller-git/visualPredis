<?php

/*
 * 执行原生redis客户端命令
 * 
 * This file is part of the Predis package.
 *
 * (c) Daniele Alessandri <suppakilla@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Predis\Command;

/**
 * @link http://redis.io/commands/hgetall
 * @author Daniele Alessandri <suppakilla@gmail.com>
 */
class VisualPredis extends PrefixableCommand
{
    /**
     * {@inheritdoc}
     */
    public function getId()
    {
        dump('commandId');
    }

    /**
     * {@inheritdoc}
     */
    public function parseResponse($data)
    {
        // $result = array();
        // dump($data);
        // for ($i = 0; $i < count($data); $i++) {
        //     $result[$data[$i]] = $data[++$i];
        // }

        // return $result;
        return $data;
    }
}
