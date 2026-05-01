# DZ Pharma Data

Application de recherche de médicaments en Algérie avec interface web.

## Fonctionnalités

- Recherche de médicaments par nom, DCI, générique ou laboratoire
- Affichage des informations complètes : prix, forme, dosage, conditionnement, etc.
- Images des médicaments avec agrandissement au clic
- Liens vers la page Pharmnet et la notice
- Extraction automatique des données depuis pharmnet-dz.com

## Structure du projet

```
DZ-Pharma-Data-master/
├── data/
│   ├── meds.json       # Données des médicaments
│   └── links.json      # Liens des médicaments
├── scripts/
│   ├── common.py       # Fonctions utilitaires JSON
│   ├── links.py        # Extraction des liens
│   ├── med.py          # Extraction des infos médicaments
│   ├── lab.py          # Extraction des infos laboratoires
│   └── direct_extractor.py  # Extraction directe complète
├── converssion/
│   └── convert.py      # Conversion de format JSON
├── index.html          # Interface de recherche
├── main.py             # Script principal
├── start_server.bat    # Lancer le serveur web
├── scrape_meds.bat     # Lancer l'extraction
└── convert.bat         # Convertir JSON
```

## Installation

1. Installer Python 3.x
2. Installer les dépendances :
```bash
pip install requests beautifulsoup4 lxml
```

## Utilisation

### Interface Web

1. Double-cliquer sur `start_server.bat`
2. Ouvrir http://127.0.0.1:8000 dans le navigateur

### Extraction des données

**Option 1 : Script complet**
```bash
python main.py
```

**Option 2 : Extraction directe (plus rapide)**
```bash
python scripts/direct_extractor.py
```

**Option 3 : Utiliser les fichiers batch**
- `scrape_meds.bat` - Lance l'extraction

### Conversion JSON

Pour formater un fichier JSON :
```bash
python converssion\convert.py
```

## Format des données

### Médicament
```json
{
    "name": "NOM COMPLET",
    "link": "https://pharmnet-dz.com/...",
    "img": "https://pharmnet-dz.com/...",
    "notice": "https://pharmnet-dz.com/...",
    "lab": {
        "name": "NOM DU LABORATOIRE",
        "link": "https://pharmnet-dz.com/...",
        "address": "ADRESSE",
        "tel": "TÉLÉPHONE",
        "web": "SITE WEB"
    },
    "class": {
        "pharmacological": "CLASSE PHARMACOLOGIQUE",
        "therapeutic": "CLASSE THÉRAPEUTIQUE"
    },
    "generic": "DCI/GÉNÉRIQUE",
    "commercialisation": true,
    "refundable": true,
    "list": "Liste I",
    "country": "ALGÉRIE",
    "commercial_name": "NOM COMMERCIAL",
    "reference_rate": "PRIX",
    "ppa": "PRIX PPA",
    "registration": "NUMÉRO D'ENREGISTREMENT",
    "dci": "CODE DCI",
    "form": "FORME GALÉNIQUE",
    "dosage": "DOSAGE",
    "conditionnement": "CONDITIONNEMENT"
}
```

## Captures d'écran

L'interface permet de :
- Rechercher en temps réel
- Voir l'image du médicament
- Cliquer pour agrandir l'image
- Accéder à la page Pharmnet
- Consulter la notice

## Dépendances

- Python 3.x
- requests
- beautifulsoup4
- lxml

## Licence

Usage personnel et éducatif.
