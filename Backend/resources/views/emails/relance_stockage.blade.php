<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>KITEA - Notification de Stockage</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f6f8; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f4f6f8; padding: 20px 0;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
                    
                    <tr>
                        <td style="background-color: #0f2a4a; padding: 30px; text-align: center;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600; letter-spacing: 1px;">KITEA</h1>
                            <p style="color: #f39c12; margin: 5px 0 0 0; font-size: 12px; text-transform: uppercase; font-weight: bold; letter-spacing: 2px;">Service Logistique & Clientèle</p>
                        </td>
                    </tr>

                    <tr>
                        <td style="padding: 40px 35px;">
                            <h2 style="color: #0f2a4a; margin-top: 0; font-size: 20px; font-weight: 600;">Bonjour {{ $commande->client->nom_complet }},</h2>
                            
                            <p style="color: #555555; font-size: 15px; line-height: 1.6; margin-bottom: 25px;">
                                Nous vous informons que les articles de votre commande <strong style="color: #0f2a4a;">#{{ $commande->id_commande }}</strong> sont actuellement mis à votre disposition dans notre entrepôt central suite à votre achat réglé le <strong>{{ \Carbon\Carbon::parse($commande->date_paiement)->format('d/m/Y') }}</strong>.
                            </p>

                            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #fffaf0; border-left: 4px solid #f39c12; margin-bottom: 30px; border-radius: 4px;">
                                <tr>
                                    <td style="padding: 20px;">
                                        <strong style="color: #b76e00; font-size: 15px; display: block; margin-bottom: 5px;">⚠️ Rappel Relatif aux Délais de Stockage</strong>
                                        <span style="color: #665544; font-size: 14px; line-height: 1.5;">
                                            Conformément aux conditions d'achat KITEA, le stockage gratuit est garanti pendant une période de <strong>30 jours</strong>. Ce délai étant désormais dépassé, nous vous invitons à planifier le retrait ou la livraison de vos biens avant le cap des 60 jours afin d'éviter l'application réglementaire d'une <strong>pénalité de stockage de 10%</strong>.
                                        </span>
                                    </td>
                                </tr>
                            </table>

                            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border: 1px solid #eef2f5; border-radius: 6px; margin-bottom: 30px;">
                                <tr style="background-color: #f8fafc;">
                                    <td colspan="2" style="padding: 15px; border-bottom: 1px solid #eef2f5; font-weight: bold; color: #0f2a4a; font-size: 14px;">Récapitulatif de la Commande</td>
                                </tr>
                                <tr>
                                    <td style="padding: 12px 15px; font-size: 14px; color: #777777; border-bottom: 1px solid #eef2f5;">Référence :</td>
                                    <td style="padding: 12px 15px; font-size: 14px; color: #333333; font-weight: bold; text-align: right; border-bottom: 1px solid #eef2f5;">#{{ $commande->id_commande }}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 12px 15px; font-size: 14px; color: #777777;">Montant Global TTC :</td>
                                    <td style="padding: 12px 15px; font-size: 14px; color: #0f2a4a; font-weight: bold; text-align: right;">{{ number_format($commande->montant_ttc, 2, ',', ' ') }} MAD</td>
                                </tr>
                            </table>

                            <p style="color: #555555; font-size: 14px; line-height: 1.6; margin-bottom: 0;">
                                Nos équipes se tiennent à votre entière disposition pour coordonner votre livraison via notre service client ou directement depuis votre espace en ligne.
                            </p>
                        </td>
                    </tr>

                    <tr>
                        <td style="background-color: #f8fafc; padding: 25px 35px; border-top: 1px solid #eef2f5; text-align: center;">
                            <p style="margin: 0; color: #999999; font-size: 12px; line-height: 1.5;">
                                © 2026 KITEA Maroc. Tous droits réservés.<br>
                                Ce message est une notification automatique concernant l'état logistique de votre commande.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>