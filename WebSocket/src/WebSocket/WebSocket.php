<?php

namespace App\WebSocket;


use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;


class WebSocket implements MessageComponentInterface
{
  protected \SplObjectStorage $clients;

  public function __construct()
  {
    $this->clients = new \SplObjectStorage;
  }

  public function onOpen(ConnectionInterface $conn): void
  {
    $this->clients->attach($conn);
  }

  public function onMessage(ConnectionInterface $from, $msg): void
  {
    $data = json_decode($msg, true);

    $type = $data['type'];

    if ($type === 'getcomment') {
      foreach ($this->clients as $client) {
        if ($client !== $from) {
          $client->send(json_encode([
            'type' => "getcomment",
          ]));
        }
      }
    }

    if ($type === 'getrewiev') {
      foreach ($this->clients as $client) {
        if ($client !== $from) {
          $client->send(json_encode([
            'type' => "getrewiev",
          ]));
        }
      }
    }
  }


  public function onClose(ConnectionInterface $conn): void
  {
    $this->clients->detach($conn);
  }

  public function onError(ConnectionInterface $conn, \Exception $e): void
  {
    echo "Error: {$e->getMessage()}\n";
    $conn->close();
  }
}
