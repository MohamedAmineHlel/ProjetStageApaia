from flask import Flask, request, jsonify
from flask_cors import CORS
from flask import send_file
import speech_recognition as sr
import io
import random
import string
from pydub import AudioSegment
import os
from datetime import datetime
import json
from pymongo import MongoClient
from werkzeug.security import generate_password_hash, check_password_hash
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from Generated_IA import generateIA 
from bson.objectid import ObjectId
import pdfkit
from generatePDF import create_pdf 
# Connect to MongoDB
client = MongoClient('mongodb+srv://amine123:azsq%402626@cluster0.ihj3uci.mongodb.net/AI_medicale?retryWrites=true&w=majority')
db = client['AI_medicale']
patients_collection = db['patients']
admins_collection = db['admins'] 

# Initialize the Flask application
app = Flask(__name__)
CORS(app)

# Configure pydub to use ffmpeg and ffprobe
ffmpeg_path = "C:\\Users\\MSI\\Downloads\\Compressed\\ffmpeg-n7.0-latest-win64-gpl-shared-7.0\\bin\\ffmpeg.exe"
ffprobe_path = "C:\\Users\\MSI\\Downloads\\Compressed\\ffmpeg-n7.0-latest-win64-gpl-shared-7.0\\bin\\ffprobe.exe"

os.environ["PATH"] += os.pathsep + os.path.dirname(ffmpeg_path)
os.environ["PATH"] += os.pathsep + os.path.dirname(ffprobe_path)

AudioSegment.converter = ffmpeg_path
AudioSegment.ffprobe = ffprobe_path

def convert_to_wav(file_path):
    try:
        audio = AudioSegment.from_file(file_path, format="3gp")
        print("wost il function",file_path)
        wav_path = file_path.replace('.3gp', '.wav')
        audio.export(wav_path, format="wav")
        return wav_path
    except Exception as e:
        print(f"Error during conversion: {e}")
        raise

def ensure_directory_exists(directory):
    if not os.path.exists(directory):
        os.makedirs(directory)

def save_audio_file(file, directory, patient_name, date_str):
    filename = f"{patient_name}_{date_str}.3gp"
    file_path = os.path.join(directory, filename)
    file.save(file_path)
    return file_path

def save_transcription_to_json(text, directory, patient_name, date_str):
    filename = f"{patient_name}_{date_str}.json"
    file_path = os.path.join(directory, filename)
    with open(file_path, 'w') as f:
        json.dump({"transcription": text}, f, ensure_ascii=False, indent=4)
    print(f"Transcription saved to {file_path}")

def send_welcome_email(email, name):
    sender_email = "57amine6@gmail.com"
    sender_password = "htqz rgku tjnw tgmn"
    receiver_email = email

    message = MIMEMultipart("alternative")
    message["Subject"] = "Welcome to AI Medical App"
    message["From"] = sender_email
    message["To"] = receiver_email

    # Email content
    text = f"Hello {name},\n\nThank you for signing up as an Medecin in our AI Medical application. We're glad to have you on board."
    html = f"""\
    <html>
      <body>
        <p>Hello {name},<br><br>
           Thank you for signing up as an Medecin in our AI Medical application. We're glad to have you on board.
        </p>
      </body>
    </html>
    """

    part1 = MIMEText(text, "plain")
    part2 = MIMEText(html, "html")

    message.attach(part1)
    message.attach(part2)

    try:
        server = smtplib.SMTP("smtp.gmail.com", 587)
        server.starttls()
        server.login(sender_email, sender_password)
        server.sendmail(sender_email, receiver_email, message.as_string())
        server.quit()
        print(f"Email sent to {email}")
    except Exception as e:
        print(f"Failed to send email: {e}")

def save_transcription_to_json(text, directory, patient_name, date_str):
    filename = f"{patient_name}_{date_str}.json"
    file_path = os.path.join(directory, filename)
    with open(file_path, 'w') as f:
        json.dump({"transcription": text}, f, ensure_ascii=False, indent=4)
    print(f"Transcription saved to {file_path}")
    return file_path  # Ensure the path is returned


@app.route('/transcribe', methods=['POST'])
def transcribe():
    if 'audio' not in request.files:
        return jsonify({"error": "No audio file provided"}), 400

    audio_file = request.files['audio']
    name = request.form.get('name')
    surname = request.form.get('surname')
    day = request.form.get('day')
    month = request.form.get('month')
    year = request.form.get('year')
    weight = request.form.get('weight')
    sex = request.form.get('sex')
    medical_history = request.form.get('medicalHistory')

    print(f"Received file: {audio_file.filename}")
    print(f"Patient Details: {name} {surname}, {day}/{month}/{year}, Weight: {weight}, Sex: {sex}, Medical History: {medical_history}")

    directory = 'consultation'
    ensure_directory_exists(directory)

    date_str = datetime.now().strftime("%Y%m%d_%H%M%S")  # Format the date and time for unique filenames

    try:
        # Save the original audio file with a unique name
        file_path = save_audio_file(audio_file, directory, f"{name}_{surname}", date_str)
        print("ddddd",file_path)
        # Convert saved audio file to wav
        wav_path = convert_to_wav(file_path)
        print("audio path",wav_path)
        # Process WAV file
        recognizer = sr.Recognizer()
        with sr.AudioFile(wav_path) as source:
            audio_data = recognizer.record(source)
            text = recognizer.recognize_google(audio_data, language="en-US")
        
        # Save transcription to JSON file with a unique name
        #json_file_path = save_transcription_to_json(text, directory, f"{name}_{surname}", date_str)
        json_file_path = save_transcription_to_json(text, directory, f"{name}_{surname}", date_str)

        # Use the generateIA function to summarize the transcription
        print("my path",json_file_path)
        # generated_summary = generateIA(json_file_path)
        generated_summary="Ms. Barhoumi reports persistent feelings of worry and unease, especially at work. She experiences occasional heart palpitations and has trouble concentrating. She also mentions difficulty sleeping and a decreased appetite. A relaxation therapy plan has been suggested, along with scheduling weekly counseling sessions. She has been advised to maintain a journal to track her thoughts and emotions."
        # Save patient details and transcription to MongoDB
        patient_record = {
            'name': name,
            'surname': surname,
            'birthdate': f"{year}-{month.zfill(2)}-{day.zfill(2)}",
            'weight': weight,
            'sex': sex,
            'medicalHistory': medical_history,
            'audioFilePath': file_path,
            'transcription': generated_summary,
            'recordDate': datetime.now()
        }

        # Insert patient record into MongoDB
        result = patients_collection.insert_one(patient_record)
        print(f"Inserted ID: {result.inserted_id}")

        
        
        # Return the transcription and summary as a response
        return jsonify({"transcription": generated_summary, "medical_summary": generated_summary})
    except sr.UnknownValueError:
        return jsonify({"error": "Google Speech Recognition could not understand audio"}), 400
    except sr.RequestError as e:
        return jsonify({"error": f"Could not request results from Google Speech Recognition service; {e}"}), 500
    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500

@app.route('/transcribeUpdate', methods=['POST'])
def transcribe_update():
    try:
        if 'audio' not in request.files:
            return jsonify({"error": "No audio file provided"}), 400

        audio_file = request.files['audio']
        name = request.form.get('name')
        surname = request.form.get('surname')
        day = request.form.get('day')
        month = request.form.get('month')
        year = request.form.get('year')
        weight = request.form.get('weight')
        sex = request.form.get('sex')
        medical_history = request.form.get('medicalHistory')

        print(f"Received file: {audio_file.filename}")
        print(f"Patient Details: {name} {surname}, {day}/{month}/{year}, Weight: {weight}, Sex: {sex}, Medical History: {medical_history}")

        directory = 'consultation'
        ensure_directory_exists(directory)

        date_str = datetime.now().strftime("%Y%m%d_%H%M%S")  # Format the date and time for unique filenames

        # Save the original audio file with a unique name
        file_path = save_audio_file(audio_file, directory, f"{name}_{surname}", date_str)

        # Convert saved audio file to wav
        wav_path = convert_to_wav(file_path)
        print("audio path", wav_path)

        # Process WAV file
        recognizer = sr.Recognizer()
        with sr.AudioFile(wav_path) as source:
            audio_data = recognizer.record(source)
            text = recognizer.recognize_google(audio_data, language="en-US")

        # Retrieve existing patient record
        patient_record = patients_collection.find_one({'name': name, 'surname': surname})

        if not patient_record:
            return jsonify({"error": "Patient not found"}), 404

        # Concatenate new transcription with the existing one
        old_transcription = patient_record.get('transcription', '')
        new_transcription = f"{old_transcription}\n{text}"

        # Save the updated transcription to a JSON file
        json_file_path = save_transcription_to_json(new_transcription, directory, f"{name}_{surname}", date_str)

        # Generate summary (using the AI generation function or hardcoded for now)
        generated_summary = "Generated summary after concatenation."

        # Update patient details in MongoDB
        updated_record = {
            'name': name,
            'surname': surname,
            'birthdate': f"{year}-{month.zfill(2)}-{day.zfill(2)}",
            'weight': weight,
            'sex': sex,
            'medicalHistory': medical_history,
            'audioFilePath': file_path,
            'transcription': new_transcription,
            'recordDate': datetime.now()
        }

        # Update the patient's record in the database
        result = patients_collection.update_one(
            {'_id': patient_record['_id']},  # Find the patient by their unique ID
            {'$set': updated_record}  # Update the record
        )

        if result.modified_count > 0:
            print(f"Updated patient record ID: {patient_record['_id']}")
            return jsonify({"transcription": new_transcription, "medical_summary": generated_summary})
        else:
            return jsonify({"error": "Failed to update patient record"}), 500

    except sr.UnknownValueError:
        return jsonify({"error": "Google Speech Recognition could not understand audio"}), 400
    except sr.RequestError as e:
        return jsonify({"error": f"Could not request results from Google Speech Recognition service; {e}"}), 500
    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500

#get all patients
@app.route('/patients', methods=['GET'])
def get_patients():
    patients = patients_collection.find()
    patients_list = []

    for patient in patients:
        patient_info = {
            'id': str(patient['_id']), 
            'name': patient['name'],
            'surname': patient['surname'],
            'birthdate': patient['birthdate'],
            'weight': patient['weight'],
            'sex': patient['sex'],
            'medicalHistory': patient['medicalHistory'],
            'transcription': patient['transcription'],
            'recordDate': patient['recordDate'].strftime("%Y-%m-%d %H:%M:%S"),
            'audioFilePath': f"http://192.168.1.20:5000/audio/{os.path.basename(patient['audioFilePath'])}"  # Add audio file URL
        }
        patients_list.append(patient_info)

    return jsonify(patients_list), 200

#update patient
@app.route('/patients/<patient_id>', methods=['PUT'])
def update_patient(patient_id):
    data = request.json

    # Extract fields to update
    name = data.get('name')
    surname = data.get('surname')
    birthdate = data.get('birthdate')
    weight = data.get('weight')
    sex = data.get('sex')
    medical_history = data.get('medicalHistory')
    transcription = data.get('transcription')  # if you want to update transcription as well

    # Build the update fields dynamically
    update_fields = {}
    if name: update_fields['name'] = name
    if surname: update_fields['surname'] = surname
    if birthdate: update_fields['birthdate'] = birthdate
    if weight: update_fields['weight'] = weight
    if sex: update_fields['sex'] = sex
    if medical_history: update_fields['medicalHistory'] = medical_history
    if transcription: update_fields['transcription'] = transcription

    if not update_fields:
        return jsonify({"error": "No fields to update provided"}), 400

    try:
        # Update patient information in MongoDB
        result = patients_collection.update_one(
            {'_id': patient_id}, 
            {'$set': update_fields}
        )

        if result.matched_count == 0:
            return jsonify({"error": "Patient not found"}), 404
        
        return jsonify({"message": "Patient information updated successfully"}), 200
    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500


# Delete patient
@app.route('/patients/<patient_id>', methods=['DELETE'])
def delete_patient(patient_id):
    try:
        # Ensure patient_id is a valid ObjectId
        if not ObjectId.is_valid(patient_id):
            return jsonify({"error": "Invalid patient ID"}), 400
        
        # Attempt to delete the patient
        result = patients_collection.delete_one({'_id': ObjectId(patient_id)})

        if result.deleted_count == 0:
            return jsonify({"error": "Patient not found"}), 404

        return jsonify({"message": "Patient deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500



# Find the patient by ID
@app.route('/patient/<patient_id>', methods=['GET'])
def get_patient(patient_id):
    # Find the patient by ID in the MongoDB collection
    patient = patients_collection.find_one({'_id': ObjectId(patient_id)})
    
    if patient:
        patient_info = {
            'id': str(patient['_id']),  # Convert ObjectId to string
            'name': patient['name'],
            'surname': patient['surname'],
            'birthdate': patient['birthdate'],
            'weight': patient['weight'],
            'sex': patient['sex'],
            'medicalHistory': patient['medicalHistory'],
            'transcription': patient['transcription'],
            'recordDate': patient['recordDate'].strftime("%Y-%m-%d %H:%M:%S"),
            'audioFilePath': f"http://192.168.1.20:5000/{os.path.basename(patient['audioFilePath'])}"  # Audio file URL
        }
        print(patient_info)
        return jsonify(patient_info), 200
    else:
        return jsonify({'error': 'Patient not found'}), 404
    
@app.route('/audio/<filename>', methods=['GET'])
def get_audio(filename):
    directory = 'consultation'
    file_path = os.path.join(directory, filename)
    try:
        return send_file(file_path, mimetype="audio/wav")
    except Exception as e:
        return jsonify({"error": f"Could not retrieve audio file: {str(e)}"}), 404



@app.route('/')
def hello_world():
    return 'Hello World!'



@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    name = data.get('name')
    surname = data.get('surname')
    email = data.get('email')
    specialty = data.get('specialty')
    password = data.get('password')
    birthdate = data.get('birthdate')

    if not all([name, surname, email, specialty, password, birthdate]):
        return jsonify({"error": "All fields are required"}), 400

    existing_admin = admins_collection.find_one({'email': email})
    if existing_admin:
        return jsonify({"error": "Admin with this email already exists"}), 400

    # Use the 'pbkdf2:sha256' method for hashing passwords
    hashed_password = generate_password_hash(password, method='pbkdf2:sha256')
    admin_record = {
        'name': name,
        'surname': surname,
        'email': email,
        'specialty': specialty,
        'password': hashed_password,
        'birthdate': birthdate,
        'createdAt': datetime.now()
    }

    admins_collection.insert_one(admin_record)

    # Send a welcome email
    send_welcome_email(email, name)

    return jsonify({"message": "Admin account created successfully"}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    if not all([email, password]):
        return jsonify({"error": "Email and password are required"}), 400

    admin = admins_collection.find_one({'email': email})
    if not admin:
        return jsonify({"error": "Admin not found"}), 404

    if not check_password_hash(admin['password'], password):
        return jsonify({"error": "Incorrect password"}), 401

    return jsonify({"message": "Logged in successfully", "admin": {"name": admin['name'], "surname": admin['surname'], "email": admin['email'], "specialty": admin['specialty'], "birthdate": admin['birthdate']}}), 200

# Set the output directory for PDFs
PDF_OUTPUT_DIR = 'generated_pdfs'
if not os.path.exists(PDF_OUTPUT_DIR):
    os.makedirs(PDF_OUTPUT_DIR)

@app.route('/generate-pdft', methods=['POST'])
def generate_pdft():
    try:
        # Extract data from the incoming JSON
        data = request.get_json()
        name = data.get('name')
        surname = data.get('surname')
        day = data.get('day')
        month = data.get('month')
        year = data.get('year')
        weight = data.get('weight')
        sex = data.get('sex')
        medicalHistory = data.get('medicalHistory')
        transcription = data.get('transcription')

        # Create the HTML for the PDF content
        html_content = f"""
        <html>
        <head>
            <title>Medical Report</title>
            <style>
                body {{
                    font-family: Arial, sans-serif;
                    margin: 40px;
                    color: #333;
                }}
                h1 {{
                    text-align: center;
                    color: #2c3e50;
                }}
                p {{
                    line-height: 1.6;
                }}
                .container {{
                    border: 1px solid #ddd;
                    padding: 20px;
                    border-radius: 10px;
                    background-color: #f9f9f9;
                }}
                .header {{
                    text-align: center;
                    margin-bottom: 20px;
                }}
                .label {{
                    font-weight: bold;
                    color: #34495e;
                }}
                pre {{
                    background-color: #ecf0f1;
                    padding: 10px;
                    border-radius: 5px;
                    font-family: monospace;
                }}
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Medical Report</h1>
                <p><span class="label">Name & Surname:</span> {name} {surname}</p>
                <p><span class="label">Date of Birth:</span> {day}/{month}/{year}</p>
                <p><span class="label">Weight:</span> {weight} kg</p>
                <p><span class="label">Sex:</span> {sex}</p>
                <p><span class="label">Medical History:</span> {medicalHistory}</p>
                <p><span class="label">Medical Summary:</span></p>
                <pre>{transcription}</pre>
            </div>
        </body>
        </html>
        """


        # Define PDF file path
        pdf_filename = f"{name}_{surname}_result.pdf"
        pdf_filepath = os.path.join(PDF_OUTPUT_DIR, pdf_filename)

        # Generate PDF from HTML using pdfkit
        pdfkit.from_string(html_content, pdf_filepath)

        # Return the URL to the generated PDF
        return jsonify({"pdf_url": f"/generated_pdfs/{pdf_filename}"})

    except Exception as e:
        print(f"Error generating PDF: {e}")
        return jsonify({"error": "Failed to generate PDF"}), 500


@app.route('/generate-pdf', methods=['POST'])
def generate_pdf():
    try:
        # Extract data from the incoming JSON
        data = request.get_json()
        name = data.get('name')
        surname = data.get('surname')
        day = data.get('day')
        month = data.get('month')
        year = data.get('year')
        weight = data.get('weight')
        sex = data.get('sex')
        medicalHistory = data.get('medicalHistory')
        transcription = data.get('transcription')

        # Create the PDF and get the file path
        pdf_filepath = create_pdf(name, surname, day, month, year, weight, sex, medicalHistory, transcription)

        # Return the URL to the generated PDF
        return jsonify({"pdf_url": f"/generated_pdfs/{os.path.basename(pdf_filepath)}"})

    except Exception as e:
        print(f"Error generating PDF: {e}")
        return jsonify({"error": "Failed to generate PDF"}), 500



@app.route('/generated_pdfs/<filename>', methods=['GET'])
def download_pdf(filename):
    # Serve the generated PDF file
    pdf_path = os.path.join(PDF_OUTPUT_DIR, filename)
    if os.path.exists(pdf_path):
        return send_file(pdf_path)
    else:
        return jsonify({"error": "File not found"}), 404

# Fonction pour générer un mot de passe aléatoire
def generate_random_password(length=8):
    characters = string.ascii_letters + string.digits + string.punctuation
    return ''.join(random.choice(characters) for i in range(length))

# Fonction pour envoyer un email
def send_reset_email(email, new_password):
    sender_email = "57amine6@gmail.com"
    sender_password = "htqz rgku tjnw tgmn"
    subject = "Réinitialisation de votre mot de passe"
    body = f"Votre nouveau mot de passe est : {new_password}\nVeuillez le changer après la connexion."

    msg = MIMEText(body)
    msg['Subject'] = subject
    msg['From'] = sender_email
    msg['To'] = email

    try:
        with smtplib.SMTP('smtp.gmail.com', 587) as server:
            server.starttls()
            server.login(sender_email, sender_password)
            server.sendmail(sender_email, email, msg.as_string())
    except Exception as e:
        print(f"Failed to send email: {e}")
        raise


@app.route('/forgot-password', methods=['POST'])
def forgot_password():
    data = request.json
    email = data.get('email')

    if not email:
        return jsonify({"error": "Email is required"}), 400

    admin = admins_collection.find_one({'email': email})
    if not admin:
        return jsonify({"error": "Admin with this email not found"}), 404

    # Générer un nouveau mot de passe
    new_password = generate_random_password()

    # Hasher le nouveau mot de passe
    hashed_password = generate_password_hash(new_password, method='pbkdf2:sha256')

    # Mettre à jour le mot de passe dans la base de données
    admins_collection.update_one({'email': email}, {'$set': {'password': hashed_password}})

    # Envoyer l'email avec le nouveau mot de passe
    try:
        send_reset_email(email, new_password)
        return jsonify({"message": "A new password has been sent to your email address"}), 200
    except Exception as e:
        return jsonify({"error": "Failed to send the email"}), 500
    

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
