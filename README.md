# TP1 — Application CRUD Full Stack (WSL2 Ubuntu)

**Stack :** React (Vite) · FastAPI (Python) · PostgreSQL

```
tp1-crud-produits/
├── backend/        # API REST FastAPI + SQLAlchemy
│   ├── app/        # main.py, models.py, schemas.py, crud.py, database.py
│   ├── tests/      # tests pytest (CRUD complet)
│   ├── .env        # configuration (URL PostgreSQL, CORS)
│   └── requirements.txt
├── frontend/       # Interface React (Vite)
│   └── src/        # App.jsx, api.js, App.css, main.jsx
└── scripts/        # scripts d'installation, de lancement et de test
```

## Architecture
`React (localhost:5173)  ──HTTP/JSON──►  FastAPI (localhost:8000)  ──SQL──►  PostgreSQL (localhost:5432)`

## API REST
| Opération | Méthode | URL | Code retour |
|---|---|---|---|
| Ajouter | POST | `/products` | 201 |
| Lister | GET | `/products` | 200 |
| Consulter | GET | `/products/{id}` | 200 / 404 |
| Modifier | PUT | `/products/{id}` | 200 / 404 |
| Supprimer | DELETE | `/products/{id}` | 204 / 404 |

Documentation interactive : http://localhost:8000/docs

---

## Exécution étape par étape (dans le terminal Ubuntu WSL2)

> Important : placez le projet dans le système de fichiers Linux (ex. `~/`), **pas** dans `/mnt/c/...`.

### Étape 0 — Décompresser et entrer dans le dossier
```bash
cd ~
unzip /mnt/c/Users/<VOTRE_NOM>/Downloads/tp1-crud-produits.zip
cd tp1-crud-produits
chmod +x scripts/*.sh
```

### Étape 1 — Installer les paquets système (PostgreSQL, Python venv…)
```bash
./scripts/01_install_systeme.sh
```

### Étape 2 — Installer Node.js (si `node -v` ne répond pas)
```bash
./scripts/02_install_node.sh
source ~/.bashrc
node -v
```

### Étape 3 — Démarrer PostgreSQL et créer la base
```bash
./scripts/03_setup_db.sh
```
Vous devez voir `tp1_db | tp1_user`.

### Étape 4 — Installer le backend
```bash
./scripts/04_setup_backend.sh
```

### Étape 5 — Installer le frontend
```bash
./scripts/05_setup_frontend.sh
```

### Étape 6 — Lancer le backend (Terminal 1)
```bash
./scripts/run_backend.sh
```
Ouvrez http://localhost:8000/docs pour vérifier. La table `products` est créée automatiquement.

### Étape 7 — Lancer le frontend (Terminal 2)
```bash
./scripts/run_frontend.sh
```
Ouvrez **http://localhost:5173** dans votre navigateur Windows (WSL2 redirige localhost automatiquement).

### Étape 8 — Tester les opérations CRUD

**a) Depuis l'interface :** ajoutez un produit → il apparaît dans la liste → « Voir » → « Modifier » → « Supprimer ».

**b) Tests automatiques pytest** (backend lancé ou non, PostgreSQL démarré) :
```bash
./scripts/test_pytest.sh
```

**c) Test manuel avec curl** (backend lancé, Terminal 3) :
```bash
./scripts/test_curl.sh
```

### Étape 9 — Vérifier que les données sont réellement en base
```bash
PGPASSWORD=tp1_password psql -h localhost -U tp1_user -d tp1_db -c "SELECT * FROM products;"
```
Ajoutez un produit dans l'interface, relancez cette commande : la ligne apparaît.
Redémarrez le backend : les données sont toujours là (persistance).

---

## Dépannage
| Problème | Solution |
|---|---|
| `connection refused` PostgreSQL | `sudo service postgresql start` (à refaire après chaque redémarrage de WSL) |
| `Impossible de joindre l'API` dans le navigateur | Vérifier que le backend tourne sur le port 8000 et que `frontend/.env` contient `VITE_API_URL=http://localhost:8000` |
| Erreur CORS | Vérifier `CORS_ORIGINS` dans `backend/.env` (`http://localhost:5173`) |
| `npm: command not found` | `source ~/.bashrc` ou refaire l'étape 2 |
| Port déjà utilisé | `sudo lsof -i :8000` puis `kill <PID>` |
| Erreur d'authentification psql | Relancer `./scripts/03_setup_db.sh` |
