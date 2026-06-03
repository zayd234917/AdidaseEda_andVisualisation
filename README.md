# Adidas BI - Analyse et Visualisation des Ventes

Ce projet est une solution complète d'intelligence d'affaires (BI) permettant d'extraire, de transformer et de charger des données de ventes Adidas à partir d'un fichier Excel vers une base de données relationnelle, puis de les visualiser via un tableau de bord interactif et moderne.

## 🚀 Architecture du Projet

Le projet repose sur trois piliers technologiques :

1.  **Pipeline ETL (Python)** : Automatise l'extraction des données depuis `Data/dataset.xlsx`, leur nettoyage (transformation), et leur chargement dans une base de données PostgreSQL en respectant un schéma en étoile (Star Schema).
2.  **API Backend (FastAPI)** : Une API performante qui expose les données et les calculs analytiques (KPIs, agrégations) via des points de terminaison sécurisés.
3.  **Tableau de Bord Frontend (React)** : Une interface utilisateur riche et réactive construite avec TypeScript, Recharts pour les visualisations, et un système de navigation multi-pages.

## 📁 Structure des Dossiers

- `Data/` : Contient le jeu de données source `dataset.xlsx`.
- `ETL/` : Logique Python pour l'extraction, la transformation et le chargement.
- `Sql/` : Scripts SQL pour la création des tables et des vues analytiques.
- `Dashboard/` :
    - `backend/` : Serveur API FastAPI et intégration SQLAlchemy.
    - `frontend/` : Application React (Vite) avec une architecture modulaire par composants.

## 🛠️ Installation et Utilisation

### 1. Prérequis
- Python 3.10+
- Node.js (dernière version LTS)
- Une instance PostgreSQL

### 2. Configuration de l'environnement
Configurez votre accès à la base de données en créant un fichier `.env` à la racine du projet :
```env
DATABASE_URL=postgresql://votre_utilisateur:votre_mot_de_passe@localhost:5432/nom_de_votre_db
```

### 3. Exécution du Pipeline ETL
Pour initialiser la base de données et charger les données Excel :
```bash
python run_etl.py
```

### 4. Lancement du Backend (API)
```bash
cd Dashboard/backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### 5. Lancement du Frontend (Tableau de Bord)
```bash
cd Dashboard/frontend
npm install
npm run dev
```

## 📊 Fonctionnalités du Tableau de Bord

Le dashboard est divisé en sections spécialisées pour une analyse approfondie :

- **Vue d'Ensemble (Overview)** : Résumé des indicateurs clés (CA total, profit, unités vendues) et répartition des méthodes de vente.
- **Analyse Régionale** : Visualisation des performances par territoire et classement des villes les plus rentables.
- **Performance Produits** : Comparaison détaillée du chiffre d'affaires et du profit par ligne de produits Adidas.
- **Tendances** : Analyse temporelle des ventes pour identifier les cycles de croissance mensuels.

## 🧰 Technologies Utilisées

- **Data** : Pandas, SQLAlchemy, PostgreSQL.
- **Backend** : FastAPI, Pydantic, Python.
- **Frontend** : React 19, TypeScript, Recharts, Lucide-react, React Router.
