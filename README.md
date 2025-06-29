# **Mini-TODO 🗒️**

## 📌 Présentation rapide

Deux micro-services `Node.js/Express` (**Utilisateurs** et **Tâches**) déployés sur **Kubernetes**, chacun avec sa base PostgreSQL, derrière une gateway Nginx Ingress.

| **Service**    | Port interne | Image Docker                          |
|----------------|--------------|----------------------------------------|
| user-service   | 3000         | `fatianbilal/user-service:1.0`         |
| task-service   | 3001         | `fatianbilal/task-service:1.0`         |

---

## 🚀 Lancer le projet en 2 commandes

```bash
# Cloner et se placer dans le dossier
git clone https://github.com/bilalfatian/mini-todo.git && cd mini-todo

# Tout déployer dans le namespace "mini-todo"
kubectl create ns mini-todo
kubectl apply -f user-service/k8s/ -f task-service/k8s/ -f gateway/k8s/ -n mini-todo
```

> **Pas de DNS ?** Utiliser le port-forward :

```bash
kubectl -n mini-todo port-forward svc/user-service 8000:80 &
kubectl -n mini-todo port-forward svc/task-service 8001:80 &
```

---

## 🧪 Tester rapidement

```bash
# Créer un utilisateur
curl -X POST http://localhost:8000/users \
     -H "Content-Type: application/json" \
     -d '{"name":"Alice","email":"alice@example.com"}'

# Créer une tâche pour l'utilisateur id 1
curl -X POST http://localhost:8001/tasks \
     -H "Content-Type: application/json" \
     -d '{"title":"Découvrir K8s","userId":1}'
```

---

## 📎 Endpoints utiles

| **Méthode** | **URI**      | **Action**                                       |
|-------------|--------------|--------------------------------------------------|
| GET         | `/users`     | Liste des utilisateurs                          |
| POST        | `/users`     | Créer un utilisateur                            |
| GET         | `/tasks`     | Liste des tâches                                |
| POST        | `/tasks`     | Créer une tâche (`title`, `userId` dans le body) |

---

## 🛠️ Stack technique

- **Node.js 18 + Express**
- **PostgreSQL 15** (un pod par service)
- **Docker / Kubernetes 1.30 (Minikube)**
- **Nginx Ingress Controller**

---

<div align="center">

_Made with ❤️ by Bilal Fatian_  
**Licence MIT**

</div>
