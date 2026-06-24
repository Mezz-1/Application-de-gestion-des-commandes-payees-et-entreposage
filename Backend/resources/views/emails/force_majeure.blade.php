<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>KITEA - Notification de Force Majeure</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f6f8; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f4f6f8; padding: 40px 0;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(15, 42, 74, 0.05); border: 1px solid #eef2f5;">
                    
                    <!-- En-tête Identitaire Proche du J+30 -->
                    <tr>
                        <td style="background-color: #0f2a4a; padding: 35px 40px; text-align: center;">
                           <!-- Logo KITEA identique au flux J+30 -->
                           <img src="{{ $message->embed(public_path('images/download.png')) }}" alt="KITEA" style="height: 45px; width: auto; margin-bottom: 15px; display: inline-block;">
                           
                           <!-- Badge de Statut Administratif Stylisé -->
                           <div style="display: block; background-color: rgba(43, 108, 176, 0.2); color: #2b6cb0; margin-top: 5px; padding: 6px 16px; font-size: 11px; text-transform: uppercase; font-weight: 700; letter-spacing: 1.5px; border-radius: 20px; display: inline-block;">
                               ⚠️ Statut : Dossier Temporairement Gelé
                           </div>
                        </td>
                    </tr>

                    <!-- Contenu Principal -->
                    <tr>
                        <td style="padding: 40px;">
                            <h2 style="color: #0f2a4a; margin-top: 0; font-size: 20px; font-weight: 600; margin-bottom: 20px;">Bonjour {{ $commande->client->nom_complet }},</h2>

                            <p style="color: #566573; font-size: 15px; line-height: 1.6; margin-bottom: 30px;">
                                Nous vous informons que suite à la déclaration d'un cas de <strong style="color: #2b6cb0;">Force Majeure</strong> reconnu par notre administration logistique, le traitement réglementaire ainsi que le décompte des délais de garde de votre commande ont été suspendus.
                            </p>

                            <!-- Bloc d'Alerte : Gel des Pénalités -->
                            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f0f7ff; border-left: 4px solid #2b6cb0; margin-bottom: 35px; border-radius: 4px;">
                                <tr>
                                    <td style="padding: 20px;">
                                        <span style="color: #2b6cb0; font-size: 15px; font-weight: 700; display: block; margin-bottom: 6px;">Protection de votre Dossier</span>
                                        <span style="color: #4a5568; font-size: 14px; line-height: 1.5; display: block;">
                                            Pendant toute la durée de cette franchise exceptionnelle, <strong>aucun frais d'encombrement ni pénalité financière</strong> ne sera appliqué à votre dossier. Le compteur de vos jours de garde en entrepôt est officiellement figé.
                                        </span>
                                    </td>
                                </tr>
                            </table>

                            <!-- Détails Synchronisés avec l'ERP -->
                            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border: 1px solid #eef2f5; border-radius: 8px; margin-bottom: 30px; overflow: hidden;">
                                <tr style="background-color: #f8fafc;">
                                    <td colspan="2" style="padding: 16px 20px; border-bottom: 1px solid #eef2f5; font-weight: 700; color: #0f2a4a; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Récapitulatif du Dossier</td>
                                </tr>
                                <tr>
                                    <td style="padding: 14px 20px; font-size: 14px; color: #7f8c8d; border-bottom: 1px solid #eef2f5;">Référence Commande</td>
                                    <td style="padding: 14px 20px; font-size: 14px; color: #2c3e50; font-weight: 700; text-align: right; border-bottom: 1px solid #eef2f5;">#{{ $commande->id_commande }}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 14px 20px; font-size: 14px; color: #7f8c8d; border-bottom: 1px solid #eef2f5;">Statut Actuel</td>
                                    <td style="padding: 14px 20px; font-size: 13px; color: #2b6cb0; font-weight: 700; text-align: right; border-bottom: 1px solid #eef2f5;">Cas de Force Majeure</td>
                                </tr>
                                <tr style="background-color: #f8fafc;">
                                    <td style="padding: 16px 20px; font-size: 14px; color: #0f2a4a; font-weight: 700;">Valeur Commande (TTC)</td>
                                    <td style="padding: 16px 20px; font-size: 16px; color: #0f2a4a; font-weight: 700; text-align: right;">{{ number_format($commande->montant_ttc, 2, ',', ' ') }} MAD</td>
                                </tr>
                            </table>

                            <!-- Bouton d'Action Logistique -->
                            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 30px;">
                                <tr>
                                    <td align="center">
                                        <a href="mailto:logistique@kitea.ma?subject=Suivi Force Majeure - Commande #{{ $commande->id_commande }}" style="display: inline-block; background-color: #0f2a4a; color: #ffffff; text-decoration: none; padding: 14px 30px; font-weight: 700; font-size: 15px; border-radius: 8px;">
                                            Contacter le Service Logistique KITEA
                                        </a>
                                    </td>
                                </tr>
                            </table>

                            <p style="color: #7f8c8d; font-size: 14px; line-height: 1.6; margin-bottom: 0; text-align: center; font-style: italic;">
                                Nos équipes logistiques prendront directement contact avec vous dès la levée de cette situation exceptionnelle pour organiser l'expédition ou le retrait sécurisé de vos marchandises.
                            </p>
                        </td>
                    </tr>

                    <!-- Pied de page -->
                    <tr>
                        <td style="background-color: #f8fafc; padding: 30px 40px; border-top: 1px solid #eef2f5; text-align: center;">
                            <p style="margin: 0; color: #95a5a6; font-size: 12px; line-height: 1.6;">
                                © 2026 KITEA Maroc. Tous droits réservés.<br>
                                Cet email est une notification automatique de suivi d'entreposage.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>