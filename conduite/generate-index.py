#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
GENERATE-INDEX.PY
Script pour générer l'index de recherche des pages
"""

import os
import json
import sys

# Configurer UTF-8 pour Windows
if sys.platform == 'win32':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

# Liste des spécialités (dossiers)
specialties = [
    'cardiologie', 'endocrinologie', 'dermatologie', 'urologie', 
    'infectiologie', 'ophtalmologie', 'medecine-interne', 'pneumologie',
    'gastrologie', 'gynecologie', 'pediatrie', 'hematologie', 
    'orl', 'rhumatologie', 'ecg', 'neurologie', 'autres',
    'medicaments-urgence', 'urgence', 'ordonnances', 'cat-consultation', 
    'reanimation', 'URG-de-Garde'
]

# Obtenir le répertoire du script
base_dir = os.path.dirname(os.path.abspath(__file__))

pages = []

print('\n--- Scan des dossiers ---\n')

for specialty in specialties:
    dir_path = os.path.join(base_dir, specialty)
    
    if os.path.exists(dir_path):
        files = os.listdir(dir_path)
        
        for file in files:
            if file.endswith('.html') and file != 'index.html':
                # Formater le titre: hyphen -> espace, capitalize
                title = file.replace('.html', '').replace('-', ' ').title()
                
                pages.append({
                    'title': title,
                    'path': f'{specialty}/{file}',
                    'specialty': specialty
                })

# Trier alphabétiquement
pages.sort(key=lambda x: x['title'])

# Écrire dans le fichier JSON
with open(os.path.join(base_dir, 'pages-index.json'), 'w', encoding='utf-8') as f:
    json.dump(pages, f, indent=2, ensure_ascii=False)

print(f'Index genere: {len(pages)} pages\n')

# Afficher un résumé par spécialité
count_by_specialty = {}
for p in pages:
    count_by_specialty[p['specialty']] = count_by_specialty.get(p['specialty'], 0) + 1

print('Resume par specialite:')
for spec, count in count_by_specialty.items():
    print(f'   {spec}: {count} pages')

print('\nPour mettre a jour: python generate-index.py\n')