# Système de Gestion de Laboratoire et de Traçabilité des Échantillons (Lab Management System)

Une application complète (Full-Stack) conçue pour la gestion d'un laboratoire, permettant de suivre la traçabilité des échantillons avec précision. Développé par Ibrahim-FARAJ.

## 🛠️ Stack Technique

### Frontend (Interface Utilisateur)
- **Vite & React** (Applications rapides)
- **React Router** pour la navigation
- **Tailwind CSS** pour le design et l'interface
- **Lucide React** & **Heroicons** pour les icônes
- **Axios** pour les requêtes HTTP

### Backend (API)
- **Node.js** & **Express**
- **MySQL2** pour la communication avec la base de données
- **JSON Web Tokens (JWT)** pour l'authentification et les sessions
- **Bcrypt** pour le hachage sécurisé des mots de passe
- **Cors** & **Dotenv**

### Base de données
- **MySQL** avec des scripts d'initialisation fournis (`schema.sql` et `seed.sql`).

---

## 🚀 Installation & Lancement

Prérequis :
- **Node.js** (v18+ recommandé)
- **MySQL** (serveur actif en local ou distant)

### 1. Configuration de la base de données

1. Assurez-vous que votre serveur MySQL est en cours d'exécution.
2. Créez la base de données et les tables associées en exécutant les scripts SQL situés dans le dossier `database/` :
   - Importez d'abord le fichier `schema.sql` pour créer les tables.
   - (Optionnel) Importez le fichier `seed.sql` pour insérer des données de test.

### 2. Lancement du Backend (API)

1. Ouvrez un terminal dans le dossier `backend/`.
2. Installez les dépendances :
   ```bash
   npm install
   ```
3. Configurez les variables d'environnement en créant un fichier `.env` à la racine de `backend/` et paramétrez vos accès à la base de données ainsi que la clé secrète JWT.
4. Lancez le serveur de développement :
   ```bash
   npm run dev
   ```
Le backend démarrera en général sur le port spécifié ou `http://localhost:5000` ou `3000`.

### 3. Lancement du Frontend

1. Ouvrez un nouveau terminal dans le dossier `frontend/`.
2. Installez les dépendances :
   ```bash
   npm install
   ```
3. Lancez l'application React avec Vite :
   ```bash
   npm run dev
   ```
L'interface sera accessible par défaut sur `http://localhost:5173`.

---

## 🔒 Sécurité

L'application intègre un système d'authentification robuste grâce à **JWT** et au hachage des mots de passe par **Bcrypt**, garantissant que les données du laboratoire, des utilisateurs et des échantillons demeurent sécurisées et confidentielles.
