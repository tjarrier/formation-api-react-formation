<?php

namespace App\Events;

use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTCreatedEvent;

class JwtCreatedSubscriber {
    public function updateJwtData(JWTCreatedEvent $event) {
        // 1. Récupérer l'utilisateur pour avoir son firstname et son lastname
        $user = $event->getUser();
        // 2. Enrichir les data pour quelles contiennent ces données
        $data = $event->getData();
        $data['firstname'] = $user->getFirstname();
        $data['lastname'] = $user->getLastname();
        $event->setData($data);
    }
}