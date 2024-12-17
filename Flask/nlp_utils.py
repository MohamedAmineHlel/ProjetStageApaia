#https://colab.research.google.com/drive/1b6EiQKS_2nC8tA_g30yTqTJjGvbELkEe#scrollTo=6z1rDtdS3HWc&line=4&uniqifier=1
import spacy
import language_tool_python

# Load the English language model in spaCy
nlp = spacy.load("en_core_web_sm")

# Initialize LanguageTool for English using the API
tool = language_tool_python.LanguageToolPublicAPI('en')

def correct_text(text):
    # Use spaCy for NLP processing (optional, depending on needs)
    doc = nlp(text)
    
    # Use LanguageTool to correct grammar and spelling
    matches = tool.check(text)
    corrected_text = language_tool_python.utils.correct(text, matches)
    
    return corrected_text

# Test the function with an incorrect English sentence
print(correct_text("Helo madam, how are yu doing?"))
