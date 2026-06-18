<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Queue\SerializesModels;
use Barryvdh\DomPDF\Facade\Pdf;

class MiseEnDemeureStockage extends Mailable
{
    use Queueable, SerializesModels;

    public $commande;

    /**
     * Create a new message instance.
     */
    public function __construct(\App\Models\Commande $commande)
    {
        $this->commande = $commande;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: ' KITEA - Notification Officielle : Application de pénalités de stockage #' . $this->commande->id_commande,
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.mise_en_demeur',
        );
    }

    /**
     * Get the attachments for the message.
     */
    public function attachments(): array
    {
        // Automatically compile the legal PDF template on-the-fly using the shared view
        $pdf = Pdf::loadView('pdf.mise_en_demeure', ['commande' => $this->commande]);
        $pdf->setPaper('A4', 'portrait');

        return [
            Attachment::fromData(fn () => $pdf->output(), 'KITEA_Mise_En_Demeure_Commande_' . $this->commande->id . '.pdf')
                ->withMime('application/pdf'),
        ];
    }
}