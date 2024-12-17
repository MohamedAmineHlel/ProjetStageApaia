import os
import pdfkit
from generatePDF import create_pdf 

PDF_OUTPUT_DIR = 'generated_pdfs'
if not os.path.exists(PDF_OUTPUT_DIR):
    os.makedirs(PDF_OUTPUT_DIR)

def generate_pdft():
    try:
        # Extract data from the incoming JSON
        name ="Walla Barhoumi"
        surname = ""
        day = "4"
        month = "9"
        year = "1999"
        weight = "60"
        sex = "Female"
        medicalHistory = "Anxiety"
        transcription ="Ms. Barhoumi reports persistent feelings of worry and unease, especially at work. She experiences occasional heart palpitations and has trouble concentrating. She also mentions difficulty sleeping and a decreased appetite. A relaxation therapy plan has been suggested, along with scheduling weekly counseling sessions. She has been advised to maintain a journal to track her thoughts and emotions."

        # Create the HTML for the PDF content with improved design and in English
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
        pdf_filename = f"{name}_{surname}_medical_report.pdf"
        pdf_filepath = os.path.join(PDF_OUTPUT_DIR, pdf_filename)

        # Generate PDF from HTML using pdfkit
        pdfkit.from_string(html_content, pdf_filepath)

        # Return the URL to the generated PDF


    except Exception as e:
        print(f"Error generating PDF: {e}")
       
generate_pdft()