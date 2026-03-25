# Bâti'Parti - SAÉ 4.01

# Table des matières

- [Description](#description)
- [Information Technique](#information-technique)
- [Fonctionnalités Clés](#fonctionnalités-clés)
    - [1. Gestion Commerciale](#1-gestion-commerciale)
    - [2. Personnalisation du Chantier](#2-personnalisation-du-chantier)
    - [3. Suivi de Chantier](#3-suivi-de-chantier)
    - [4. Facturation](#4-facturation)
- [Installation et Démarrage en Local](#installation-et-démarrage-en-local)
- [Installation et Déployement sur vercel](#installation-et-déployement-sur-vercel)
- [Auteurs](#auteurs)


## Description

Application web de gestion de chantiers développée pour l'entreprise de construction de maisons individuelles **Bâti'Parti**.

Ce projet a été réalisé dans le cadre de la **SAÉ 4.01 : Développement d'une application**. Il permet de centralisé le suivi complet d'une construction.

Il est disponible en production à cette URL : [sae.baptiste-coupat.fr](https://sae.baptiste-coupat.fr)

## Information Technique
* **Framework :** Next.js (React)
* **Langage :** JavaScript
* **Base de données :** PostgreSQL
* **Environnement :** Node.js
* **Déployée sur :** Vercel

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

##  Installation et Démarrage en Local

1.  **Cloner le dépôt.**

2.  **Installer les dépendances :**
    ```bash
    npm install
    ```
3.  **Configuration BDD :**

    À l'aide du fichier ```jeu_de_donnees.sql```, importez les données dans votre base de données en exécutant la commande suivante :
    ```bash
    psql nom_base < jeu_de_donnees.sql
    ```
    Renseignez vos identifiants de base de données dans le ```.env.exemple``` et renommer le en ```.env```

4.  **Importer les données depuis votre base de données :**
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

    - En Commercial :
        - login: coupatb
        - mdp: coupatb
    
    - En Maitre d'Oeuvre :
        - login: blancm
        - mdp: blancm
    
    - En Administrateur :
        - login: admin
        - mdp: admin

##  Installation et Déployement sur vercel

1.  **Fork le dépôt.**

2.  **Créer un compte sur [neon](https://neon.com/) :**
    
    Faire ensuite : 
    - New Project
    - Copier ensuite la string qui s'affiche (penser à faire afficher le mot de passe)
    - qui ressemble à :

     - ```postgresql://user:password@ep-xxx.eu-west-1.aws.neon.tech/dbname?sslmode=require```
    - exécuter ensuite sur un terminal : 
    ```bash
    psql "URL_De_Neon" < jeu_de_donnees.sql
    ```

3.  **Déployer sur vercel :**

    - Aller sur [vercel.com](https://vercel.com) et se créer un compte avec GitHub ou GitLab.
    - Cliquer sur Add New Project puis importer le dépot du projet.
    - Dans **Environment Variables**, ajouter un à un:
        ```
        DATABASE_URL = Votre URL Neon
        JWT_SECRET   = 3d1c8286e341ee472d3a0c1d7f7fa23e9eb12e08395bb64a92f29fa19a009a1f
        SECURE_COOKIE = true
        ```
    - Dans les options de **Build**, modifier le champ ```Build Command``` et mettre : 
    ```
    npx prisma generate && npm run build
    ```
    - Cliquer sur **Deploy** → Vercel build et va donner une URL du style `sae-xxx.vercel.app`


4.  **Ajouter un domaine personnel sur Vercel :**
    
    - Aller sur l'onglet **Domains** puis cliquer sur **Add**, ensuite écrire le domaine que vous possedez
    - Vercel va donner un enregistrement DNS à créer sur le site qui gère votre domaine (dans notre cas [infomaniak](infomaniak.com))
    - Exemple : 
    ```
    Type  : CNAME
    Nom   : sae
    Valeur: cname.vercel-dns.com

    ```

5.  **C'est fait :**

    Ouvrez l'URL de votre domaine ou bien celle donné par vercel pour voir l'application.


6.  **Pour se login**

    - En Commercial :
        - login: coupatb
        - mdp: coupatb
    
    - En Maitre d'Oeuvre :
        - login: blancm
        - mdp: blancm
    
    - En Administrateur :
        - login: admin
        - mdp: admin

##  Auteurs
* Doisy Noa (doisyn)
* Coupat Baptiste (coupatb)
* Scanu Esteban (scanue)
* Rachidi Adem (rachidia)
* Tajer Ilyess (frilo)
