<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>KITEA - Notification Importante</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f6f8; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f4f6f8; padding: 20px 0;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
                    
                    <tr>
                        <td style="background-color: #7a1c1c; padding: 30px; text-align: center;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600; letter-spacing: 1px;">KITEA</h1>
                            <p style="color: #ffcccc; margin: 5px 0 0 0; font-size: 11px; text-transform: uppercase; font-weight: bold; letter-spacing: 2px;">Notification Officielle - Mise en Demeure</p>
                        </td>
                    </tr>

                    <tr>
                        <td style="padding: 40px 35px;">
                            <h2 style="color: #7a1c1c; margin-top: 0; font-size: 20px; font-weight: 600;">À l'attention de {{ $commande->client->nom_complet }},</h2>
                            
                            <p style="color: #555555; font-size: 15px; line-height: 1.6; margin-bottom: 25px;">
                                Sauf erreur de nos services, vos articles liés à la commande <strong style="color: #7a1c1c;">#{{ $commande->id_commande }}</strong> demeurent stockés au sein de nos infrastructures logistiques au-delà du seuil contractuel maximum autorisé de 60 jours.
                            </p>

                            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #fff5f5; border-left: 4px solid #cc0000; margin-bottom: 30px; border-radius: 4px;">
                                <tr>
                                    <td style="padding: 20px;">
                                        <strong style="color: #cc0000; font-size: 15px; display: block; margin-bottom: 5px;">⚖️ Application Immédiate de Frais de Retard</strong>
                                        <span style="color: #774444; font-size: 14px; line-height: 1.5;">
                                            En vertu de nos conditions générales de vente, le dépassement du délai de 60 jours entraîne l'application immédiate d'une <strong>pénalité forfaitaire de stockage s'élevant à 10%</strong> du montant global TTC de votre commande.
                                        </span>
                                    </td>
                                </tr>
                            </table>

                            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border: 1px solid #eef2f5; border-radius: 6px; margin-bottom: 30px;">
                                <tr style="background-color: #fdf8f8;">
                                    <td colspan="2" style="padding: 15px; border-bottom: 1px solid #eef2f5; font-weight: bold; color: #7a1c1c; font-size: 14px;">Ajustement Financier de Clôture</td>
                                </tr>
                                <tr>
                                    <td style="padding: 12px 15px; font-size: 14px; color: #777777; border-bottom: 1px solid #eef2f5;">Montant Initial Commande :</td>
                                    <td style="padding: 12px 15px; font-size: 14px; color: #333333; text-align: right; border-bottom: 1px solid #eef2f5;">{{ number_format($commande->montant_ttc, 2, ',', ' ') }} MAD</td>
                                </tr>
                                <tr>
                                    <td style="padding: 12px 15px; font-size: 14px; color: #cc0000; border-bottom: 1px solid #eef2f5; font-weight: 500;">Pénalité de Stockage (10%) :</td>
                                    <td style="padding: 12px 15px; font-size: 14px; color: #cc0000; font-weight: bold; text-align: right; border-bottom: 1px solid #eef2f5;">+ {{ number_format($commande->montant_ttc * 0.10, 2, ',', ' ') }} MAD</td>
                                </tr>
                                <tr style="background-color: #f8fafc;">
                                    <td style="padding: 15px; font-size: 14px; color: #333333; font-weight: bold;">Nouveau Total Restant :</td>
                                    <td style="padding: 15px; font-size: 16px; color: #0f2a4a; font-weight: bold; text-align: right;">{{ number_format($commande->montant_ttc * 1.10, 2, ',', ' ') }} MAD</td>
                                </tr>
                            </table>

                            <p style="color: #555555; font-size: 14px; line-height: 1.6; margin-bottom: 0;">
                                Afin de stopper l'accumulation d'éventuels frais supplémentaires ou de faire l'objet de procédures administratives de libération d'espace, nous vous enjoignons de régulariser cette situation auprès de nos entrepôts.
                            </p>
                        </td>
                    </tr>

                    <tr>
                        <td style="background-color: #f8fafc; padding: 25px 35px; border-top: 1px solid #eef2f5; text-align: center;">
                            <p style="margin: 0; color: #999999; font-size: 12px; line-height: 1.5;">
                                © 2026 KITEA Maroc. Avis de mise en demeure logistique officiel.<br>
                                Si vous venez d'effectuer la collecte de vos articles, merci d'ignorer cette alerte.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>