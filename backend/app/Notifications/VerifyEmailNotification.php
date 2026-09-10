<?php

namespace App\Notifications;

use Illuminate\Auth\Notifications\VerifyEmail as VerifyEmailNotification;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class VerifyEmail extends Notification implements ShouldQueue
{
    use Queueable;

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $verificationUrl = \Illuminate\Support\Facades\URL::temporarySignedRoute(
            'verification.verify',
            now()->addMinutes(60),
            ['id' => $notifiable->id, 'hash' => sha1($notifiable->getEmailForVerification())]
        );

        return (new MailMessage)
            ->subject('Verify Email Address')
            ->line('Please verify your email address by clicking the button below.')
            ->action('Verify Email', $verificationUrl)
            ->line('This verification link will expire in 60 minutes.')
            ->line('If you did not create an account, no further action is required.');
    }
}
