from gtts import gTTS
import os

# Define the script without labels
script = """Bonjour, Mme Smith. Comment vous sentez-vous aujourd'hui ?

Bonjour. Je me sens un peu mal ces derniers temps.

Je suis désolé d'entendre cela. Pouvez-vous décrire vos symptômes pour moi ?

Oui, j'ai eu un mal de tête persistant ces derniers jours. Ça commence le matin et parfois ça dure toute la journée.

Je vois. Ressentez-vous d'autres symptômes, comme des nausées ou des vertiges ?

Oui, je me sens un peu nauséeuse, et de temps en temps j'ai des vertiges.

Avez-vous remarqué si quelque chose en particulier déclenche ces maux de tête ou les aggrave ?

Ils semblent s'aggraver lorsque je travaille sur l'ordinateur pendant de longues périodes.

D'accord. Avez-vous essayé de prendre des médicaments pour les maux de tête ?

Oui, j'ai pris des analgésiques en vente libre, mais ils ne procurent qu'un soulagement temporaire.

Et vos habitudes de sommeil ? Dormez-vous bien ?

Pas vraiment. J'ai du mal à m'endormir, et je me réveille fatiguée.

D'accord. Avez-vous des antécédents de migraines ou d'autres maux de tête chroniques dans votre famille ?

Ma mère avait des migraines, mais je n'en ai jamais eues.

Merci pour ces informations. D'après ce que vous m'avez dit, il semble que vous pourriez souffrir de maux de tête de tension, probablement aggravés par le temps passé devant un écran et le manque de sommeil. Je vous recommande d'essayer de réduire votre temps d'écran, surtout le soir, et de voir si cela aide. Je vais également prescrire un analgésique léger qui devrait être plus efficace. Si vos symptômes persistent, nous devrons peut-être effectuer des tests supplémentaires. Cela vous convient-il ?

Oui, ça me convient. Merci.

De rien. Prenez soin de vous, et nous ferons un suivi dans une semaine pour voir comment vous allez.

Merci. Je vous verrai la semaine prochaine.

Passez une bonne journée, Mme Smith.
"""

# Create TTS object
tts = gTTS(text=script, lang='fr', slow=False)

# Save to a wav file
tts.save("doctor_patient_conver.wav")

print("Audio file saved as doctor_patient_conversation.wav")
