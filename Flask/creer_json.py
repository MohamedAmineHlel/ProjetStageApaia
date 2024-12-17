import json
def text_to_json1(text):
    donnees = {
    "transcription": text
}
    chemin_fichier_json = 'consultation.json'

    with open(chemin_fichier_json, 'w', encoding='utf-8') as file:
        json.dump(donnees, file, ensure_ascii=False, indent=4)

    print(f"Le fichier JSON a été créé avec succès à l'emplacement : {chemin_fichier_json}")


def text_to_json(text):
    data = {
        "transcription": text
    }
    with open('transcription.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=4)