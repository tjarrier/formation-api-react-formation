<?php

namespace App\Events;

use DateTime;
use App\Entity\Invoice;
use App\Repository\InvoiceRepository;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use ApiPlatform\Core\EventListener\EventPriorities;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

class InvoiceChronoSubscriber implements EventSubscriberInterface {
    /**
     * @var Security
     */
    private $security;

    /**
     * @var InvoiceRepository
     */
    private $repository;

    public function __construct(Security $security, InvoiceRepository $repository) {
        $this->security = $security;
        $this->repository = $repository;
    }

    public static function getSubscribedEvents() {
        return [
            KernelEvents::VIEW => ["setChronoForInvoice", EventPriorities::PRE_VALIDATE]
        ];
    }

    public function setChronoForInvoice(ViewEvent $event) {
        $invoice = $event->getControllerResult();
        $method = $event->getRequest()->getMethod();
        if($invoice instanceof Invoice && $method === 'POST') {
            $user = $this->security->getUser();
            $nextChrono = $this->repository->findNextChrono($user);
            $invoice->setChrono($nextChrono);

            // TODO : à déplacer dans une class dédié
            if(empty($invoice->getSentAt())) {
                $invoice->setSentAt(new DateTime());
            }
        }
    }
}