<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="UTF-8">
    <title>Mise en Demeure - KITEA</title>
    <style>
        body {
            font-family: 'Helvetica', 'Arial', sans-serif;
            color: #333;
            line-height: 1.5;
            font-size: 14px;
        }

        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #0056b3;
            padding-bottom: 10px;
        }

        .logo {
            font-size: 28px;
            font-weight: bold;
            color: #0056b3;
            letter-spacing: 2px;
        }

        .doc-title {
            text-align: center;
            font-size: 20px;
            font-weight: bold;
            color: #d9534f;
            margin-bottom: 30px;
            text-transform: uppercase;
        }

        .info-section {
            margin-bottom: 20px;
        }

        .info-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }

        .info-table td {
            padding: 5px;
            vertical-align: top;
        }

        .content {
            margin-bottom: 30px;
            text-align: justify;
        }

        .order-details {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
        }

        .order-details th,
        .order-details td {
            border: 1px solid #ddd;
            padding: 10px;
            text-align: left;
        }

        .order-details th {
            background-color: #f5f5f5;
        }

        .footer {
            margin-top: 50px;
            text-align: center;
            font-size: 11px;
            color: #777;
            border-top: 1px solid #ddd;
            padding-top: 10px;
        }
    </style>
</head>

<body>

    <div class="header">
        <div class="logo">KITEA</div>
        <p style="margin: 5px 0; font-size: 12px; color: #555;">Service Logistique & Contentieux</p>
    </div>

    <div class="doc-title">
        Mise en Demeure pour Retrait de Marchandise
    </div>

    <table class="info-table">
        <tr>
            <td style="width: 50%;">
                <strong>Émetteur :</strong><br>
                KITEA Entrepot Central<br>
                Casablanca, Maroc
            </td>
            <td style="width: 50%; text-align: right;">
                <strong>Destinataire :</strong><br>
                @php
                $clientData = json_decode($commande->client, true);
                @endphp

                @if(is_array($clientData))
                {{ $clientData['nom_complet'] }}<br>
                Tél : {{ $clientData['telephone'] }}<br>
                Tél : {{ $clientData['email'] }}<br>
                @else
                {{ $commande->client }}<br>
                @endif
                Date : {{ \Carbon\Carbon::now()->format('d/m/Y') }}<br>
                Réf Commande : #{{ $commande->id_commande }}
            </td>
        </tr>
    </table>

    <div class="content">
        <p>Madame, Monsieur,</p>
        <p>Sauf erreur ou omission de notre part, notre service logistique constate que votre commande référencée ci-dessous est restée entreposée dans nos locaux au-delà des délais contractuels accordés, et ce malgré nos précédentes notifications.</p>
        <p>Conformément aux conditions générales de stockage de KITEA, le dépassement du délai de garde de 60 jours entraîne l'application d'une pénalité financière de <strong>10% du montant global TTC</strong> de la commande au titre de frais d'entreposage.</p>
    </div>

    <table class="order-details">
        <thead>
            <tr>
                <th>Référence Commande</th>
                <th>Date d'Achat</th>
                <th>Montant Initial TTC</th>
                <th>Pénalité de Stockage (10%)</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>#{{ $commande->id_commande }}</td>
                <td>{{ \Carbon\Carbon::parse($commande->date_paiment)->format('d/m/Y') }}</td>
                <td>{{ number_format($commande->montant_ttc, 2, ',', ' ') }} MAD</td>
                <td>{{ number_format($commande->montant_ttc * 0.10, 2, ',', ' ') }} MAD</td>
            </tr>
        </tbody>
    </table>

    <div class="content">
        <p>Nous vous mettons par la présente en demeure de procéder au règlement des frais associés et d'organiser le retrait définitif de vos articles sous un délai maximum de 15 jours à compter de la réception de ce document.</p>
        <p>À défaut de retrait dans ce délai, nous nous verrons dans l'obligation d'annuler définitivement ladite commande, avec application des retenues financières contractuelles.</p>
        <p>Veuillez agréer, Madame, Monsieur, l'expression de nos salutations distinguées.</p>
    </div>

    <div style="margin-top: 40px; text-align: right; padding-right: 20px;">
        <strong>La Direction Logistique KITEA</strong>
    </div>

    <div class="footer">
        KITEA S.A. - Document officiel généré automatiquement - Pour toute contestation, veuillez contacter le service client.
    </div>

</body>

</html>