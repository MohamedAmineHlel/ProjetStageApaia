import json
import re
import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
import spacy

# Télécharger les ressources nécessaires si ce n'est pas déjà fait
nltk.download('punkt')
nltk.download('stopwords')

# Charger les stop words français
stop_words = set(stopwords.words('french'))

# Charger le modèle spaCy français
nlp = spacy.load('fr_core_news_md')

def nettoyer_texte(texte):
    texte = re.sub(r'[^\w\s]', '', texte)  # Supprime les caractères spéciaux
    texte = texte.lower()  # Convertit en minuscule
    return texte

def tokeniser_texte(texte):
    return word_tokenize(texte, language='french')

def supprimer_stop_words(tokens):
    return [mot for mot in tokens if mot not in stop_words]

def appliquer_lemmatisation(tokens):
    doc = nlp(" ".join(tokens))
    return [token.lemma_ for token in doc]

def extraire_entites_nommees(texte):
    doc = nlp(texte)
    entites = [(ent.text, ent.label_) for ent in doc.ents]
    return entites

def traiter_json(fichier_json):
    # Lire le fichier JSON
    with open(fichier_json, 'r', encoding='utf-8') as file:
        data = json.load(file)

    # Extraire le texte de la transcription
    texte = data.get('transcription', '')

    # Pipeline de prétraitement
    texte_nettoye = nettoyer_texte(texte)
    tokens = tokeniser_texte(texte_nettoye)
    tokens_sans_stop_words = supprimer_stop_words(tokens)
    tokens_lemmatise = appliquer_lemmatisation(tokens_sans_stop_words)

    # Extraction des entités nommées
    entites = extraire_entites_nommees(" ".join(tokens_lemmatise))

    return {
        "Texte nettoyé": texte_nettoye,
        "Tokens": tokens,
        "Tokens sans stop words": tokens_sans_stop_words,
        "Tokens lemmatisés": tokens_lemmatise,
        "Entités nommées": entites
    }

# Exemple d'utilisation
resultats = traiter_json('consultation.json')
for cle, valeur in resultats.items():
    print(f"{cle}: {valeur}")
