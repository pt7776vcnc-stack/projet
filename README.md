# RelancePro (MVP)

RelancePro est un mini SaaS pour gérer vos clients, factures et relances automatiques en français.

## Fonctionnalités

- Auth email/mot de passe via Supabase
- CRUD Clients & Factures
- Relances automatiques (J+1, J+7, J+14 modifiables)
- Envoi d’emails via Resend (modèle poli en français)
- Historique complet des relances envoyées
- Multi-tenant : toutes les données sont liées à l’utilisateur
- Règles : anti-spam (1 relance / 24h), pas de relance si facture PAYÉE, pause relances

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS
- Supabase Auth + Postgres
- Prisma ORM
- Resend pour l’envoi d’emails

## Prérequis

- Node.js 18+
- Un projet Supabase (Auth + Postgres)
- Un compte Resend

## Installation

```bash
npm install
```

## Configuration des variables d’environnement

Créez un fichier `.env` à la racine avec :

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...

# Prisma (URL Postgres Supabase)
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE

# Resend
RESEND_API_KEY=...
RESEND_FROM="RelancePro <bonjour@votre-domaine.fr>"
```

## Base de données

Générez le client Prisma puis lancez une migration :

```bash
npm run prisma:generate
npm run prisma:migrate
```

## Lancer en local

```bash
npm run dev
```

Le site sera disponible sur `http://localhost:3000`.

## Relances automatiques

La route `POST /api/reminders/run` envoie les relances automatiques selon vos règles.
Vous pouvez la déclencher via un cron (ex: Supabase Edge Functions, CronHub, etc.) en étant connecté.

## Notes

- Le bouton “Envoyer une relance” est disponible sur chaque facture.
- L’historique complet est visible dans l’onglet **Relances**.
