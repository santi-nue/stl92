import csv
import requests
import zipfile
import io

# Open the CSV file
with open('airlines.csv', 'r') as csv_file:
    csv_reader = csv.DictReader(csv_file)
    
    # Create a ZIP file in memory
    zip_buffer = io.BytesIO()
    with zipfile.ZipFile(zip_buffer, 'a', zipfile.ZIP_DEFLATED, False) as zip_file:
        for row in csv_reader:
            code = row['code']
            url = f"https://cdn.airnavradar.com/airlines/sq/{code}.png" 
            
            try:
                response = requests.get(url)
                response.raise_for_status()  # Raise an exception for HTTP errors
                
                # If no errors, add the image to the ZIP file
                image_data = io.BytesIO(response.content)
                zip_file.writestr(f"{code}.png", image_data.getvalue())
                print(f"Added image for code: {code}")
            except requests.RequestException as e:
                print(f"Error fetching image for code {code}: {e}")

    # Save the ZIP file
    with open('airline_images.zip', 'wb') as f:
        f.write(zip_buffer.getvalue())

print("ZIP file created successfully.")
