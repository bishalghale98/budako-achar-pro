<?php

namespace App\Notifications;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewCustomerWelcomeNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        private readonly string $plainPassword,
    ) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(User $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Welcome to Buda Ko Achar')
            ->line('Your account has been created successfully.')
            ->line('Email: ' . $notifiable->email)
            ->line('Password: ' . $this->plainPassword)
            ->action('Login', url('/login'))
            ->line('For security, we recommend changing your password after logging in.');
    }
}
