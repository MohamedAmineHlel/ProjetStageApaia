import torch
from transformers import AutoModelForSeq2SeqLM, AutoTokenizer
import json
def generateIA(pathToJson):

    # Load the model and tokenizer
    model_name = "Mahalingam/DistilBart-Med-Summary"
    tokenizer = AutoTokenizer.from_pretrained(model_name)
    model = AutoModelForSeq2SeqLM.from_pretrained(model_name)

    # Read the transcription from a JSON file
    json_file_path = pathToJson

    # Load the JSON file
    with open(json_file_path, "r") as file:
        data = json.load(file)

    # Extract the transcription text
    transcription = data["transcription"]
    # Prepare the input for the model
    inputs = tokenizer(transcription, return_tensors="pt", truncation=True, padding="longest")

    # Generate the summary
    outputs = model.generate(inputs["input_ids"], max_length=600, num_beams=4, early_stopping=True)

    # Decode and print the summary, explicitly setting clean_up_tokenization_spaces
    generated_summary = tokenizer.decode(outputs[0], skip_special_tokens=True, clean_up_tokenization_spaces=True)

    print("Generated Summary:")
    print(generated_summary)
    return generated_summary

