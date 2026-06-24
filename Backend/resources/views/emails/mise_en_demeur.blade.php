<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>KITEA - Mise En Demeure Officielle</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f6f8; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f4f6f8; padding: 40px 0;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(122, 28, 28, 0.08); border: 1px solid #eef2f5;">

                    <tr>
                        <td style="background-color: #7a1c1c; padding: 35px 40px; text-align: center;">
                            <img src="{{ $message->embed(public_path('images/download.png')) }}" alt="KITEA" style="height: 45px; width: auto; margin-bottom: 15px; display: inline-block;">
                            
                            <div style="display: block; background-color: rgba(255,255,255,0.15); color: #ffffff; margin-top: 5px; padding: 6px 16px; font-size: 11px; text-transform: uppercase; font-weight: 700; letter-spacing: 1.5px; border-radius: 20px; display: inline-block;">
                                Notification Officielle - Contentieux Logistique
                            </div>
                        </td>
                    </tr>

                    <tr>
                        <td style="padding: 40px;">
                            <h2 style="color: #7a1c1c; margin-top: 0; font-size: 20px; font-weight: 600; margin-bottom: 20px;">À l'attention de {{ $commande->client->nom_complet }},</h2>

                            <p style="color: #566573; font-size: 15px; line-height: 1.6; margin-bottom: 30px;">
                                Sauf erreur de nos services logistiques, les marchandises relatives à votre commande <strong style="color: #7a1c1c;">#{{ $commande->id_commande }}</strong> demeurent non réclamées au sein de notre infrastructure au-delà du délai limite contractuel de **60 jours**.
                            </p>

                            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #fff5f5; border-left: 4px solid #cc0000; margin-bottom: 35px; border-radius: 4px;">
                                <tr>
                                    <td style="padding: 20px;">
                                        <span style="color: #cc0000; font-size: 15px; font-weight: 700; display: block; margin-bottom: 6px;">⚖️ Application de Pénalités Forfaitaires</span>
                                        <span style="color: #7f4f4f; font-size: 14px; line-height: 1.5; display: block;">
                                            En application des conditions générales de vente KITEA, le dépassement du délai de garde de 60 jours entraîne la facturation immédiate d'une **indemnité d'encombrement égale à 10%** de la valeur totale TTC de la commande.
                                        </span>
                                    </td>
                                </tr>
                            </table>

                            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border: 1px solid #eef2f5; border-radius: 8px; margin-bottom: 30px; overflow: hidden;">
                                <tr style="background-color: #fdf8f8;">
                                    <td colspan="2" style="padding: 16px 20px; border-bottom: 1px solid #eef2f5; font-weight: 700; color: #7a1c1c; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Ajustement de Clôture Financière</td>
                                </tr>
                                <tr>
                                    <td style="padding: 14px 20px; font-size: 14px; color: #7f8c8d; border-bottom: 1px solid #eef2f5;">Montant Initial Marchandise</td>
                                    <td style="padding: 14px 20px; font-size: 14px; color: #2c3e50; text-align: right; border-bottom: 1px solid #eef2f5;">{{ number_format($commande->montant_ttc, 2, ',', ' ') }} MAD</td>
                                </tr>
                                <tr>
                                    <td style="padding: 14px 20px; font-size: 14px; color: #cc0000; font-weight: 500; border-bottom: 1px solid #eef2f5;">Frais de Garde Appliqués (10%)</td>
                                    <td style="padding: 14px 20px; font-size: 14px; color: #cc0000; font-weight: 700; text-align: right; border-bottom: 1px solid #eef2f5;">+ {{ number_format($commande->montant_ttc * 0.10, 2, ',', ' ') }} MAD</td>
                                </tr>
                                <tr style="background-color: #f8fafc;">
                                    <td style="padding: 16px 20px; font-size: 14px; color: #0f2a4a; font-weight: 700;">Solde à Régulariser au Retrait</td>
                                    <td style="padding: 16px 20px; font-size: 17px; color: #0f2a4a; font-weight: 700; text-align: right;">{{ number_format($commande->montant_ttc * 1.10, 2, ',', ' ') }} MAD</td>
                                </tr>
                            </table>

                            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 25px;">
                                
                                <tr>
                                    <td align="center">
                                        <a href="mailto:logistique@kitea.ma?subject=Régularisation Commande #{{ $commande->id_commande }}" style="display: inline-block; background-color: #0f2a4a; color: #ffffff; text-decoration: none; padding: 12px 25px; font-weight: 600; font-size: 14px; border-radius: 8px;">
                                            Contacter le Service Clientèle KITEA
                                        </a>
                                    </td>
                                </tr>
                            </table>

                            <p style="color: #7f8c8d; font-size: 13px; line-height: 1.6; margin-bottom: 0; text-align: center; font-style: italic;">
                                Un document officiel au format PDF détaillant cette mise en demeure est téléchargeable via le bouton ci-dessus. Nous vous prions de libérer l'espace occupé dans les plus brefs délais.
                            </p>
                        </td>
                    </tr>

                    <tr>
                        <td style="background-color: #f8fafc; padding: 30px 40px; border-top: 1px solid #eef2f5; text-align: center;">
                            <p style="margin: 0; color: #95a5a6; font-size: 12px; line-height: 1.6;">
                                © 2026 KITEA Maroc. Notification légale de mise en demeure logistique.<br>
                                Si vous avez retiré vos marchandises au cours des dernières 24 heures, veuillez ne pas tenir compte de cet avis.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>