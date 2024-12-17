# generatePDF.py
from fpdf import FPDF
import os

PDF_OUTPUT_DIR = "generated_pdfs"  # Make sure this directory exists

# Create a function to generate the PDF
def create_pdf(name, surname, day, month, year, weight, sex, medicalHistory, transcription):
    # Create an instance of FPDF
    pdf = FPDF()
    
    # Add a page
    pdf.add_page()
    
    # Define the font (Arial, size 16)
    pdf.set_font("Arial", size=16)

    # Add content to the PDF
    pdf.cell(200, 10, txt="Medical Report", ln=True, align="C")
    pdf.cell(200, 10, txt=f"Name & Surname: {name} {surname}", ln=True, align="L")
    pdf.cell(200, 10, txt=f"Date of Birth: {day}/{month}/{year}", ln=True, align="L")
    pdf.cell(200, 10, txt=f"Weight: {weight}", ln=True, align="L")
    pdf.cell(200, 10, txt=f"Sex: {sex}", ln=True, align="L")
    pdf.cell(200, 10, txt=f"Medical History: {medicalHistory}", ln=True, align="L")
    pdf.cell(200, 10, txt="Medical Summary:", ln=True, align="L")
    pdf.multi_cell(0, 10, txt=transcription)  # Use multi_cell for wrapping text
    
    # Ensure the output directory exists
    os.makedirs(PDF_OUTPUT_DIR, exist_ok=True)

    # Define PDF file path
    pdf_filename = f"{name}_{surname}_result.pdf"
    pdf_filepath = os.path.join(PDF_OUTPUT_DIR, pdf_filename)

    # Save the PDF
    pdf.output(pdf_filepath)
    
    return pdf_filepath
