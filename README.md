# Bâti'Parti - SAÉ 4.01

## Description

Application web de gestion de chantiers développée pour l'entreprise de construction de maisons individuelles **Bâti'Parti**.

Ce projet a été réalisé dans le cadre de la **SAÉ 4.01 : Développement d'une application**. Il permet de centralisé le suivi complet d'une construction.

## Information Technique
* **Framework :** Next.js (React)
* **Langage :** JavaScript
* **Base de données :** PostgreSQL
* **Environnement :** Node.js

## Fonctionnalités Clés

### 1. Gestion Commerciale
* Création de dossiers clients et création d'un dossiers pour un chantier.
* Sélection parmi les modèles de maisons du catalogue (ex: Basique 1, etc.).

### 2. Personnalisation du Chantier
* Gestion des étapes "réservées" par le clients.
* Ajout de suppléments ou réductions sur les étapes (ex: ajout d'un évier).

### 3. Suivi de Chantier
* Planification des dates théoriques et réelles des travaux.
* Affectation des artisans sous-traitants qualifiés pour chaque étape.

### 4. Facturation
* Déclenchement automatique des appels de fonds selon l'avancement :
    * **20%** au démarrage.
    * **50%** après la couverture.
    * **100%** à la fin des travaux.

##  Installation et Démarrage

1.  **Cloner le dépôt.**

2.  **Installer les dépendances :**
    ```bash
    npm install
    ```
3.  **Configuration BDD :**
    Renseignez vos identifiants de base de données dans le .env.exemple

4.  **Importer les données de votre base :**
    ```bash
    npx prisma db pull
    npx prisma generate
    ```   

5.  **Lancer le serveur :**
    ```bash
    npm run build
    npm run start
    ```
    Ouvrez [http://localhost:3000](http://localhost:3000) pour voir l'application.


6.  **Pour se login**
    En Commercial :
        login: coupatb
        mdp: coupatb
    
    En Maitre d'Oeuvre :
        login: blancm
        mdp: blancm
    
    En Administrateur :
        login: admin
        mdp: admin

##  Auteurs
* Doisy Noa (doisyn)
* Coupat Baptiste (coupatb)
* Scanu Esteban (scanue)
* Rachidi Adem (rachidia)
* Tajer Ilyess (frilo)
