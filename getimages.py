import csv
import requests
import zipfile
import io
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def fetch_image(url):
    try:
        response = requests.get(url)
        response.raise_for_status()
        return response.content
    except requests.RequestException as e:
        logging.error(f"Error fetching image from {url}: {e}")
        return None

def create_zip_from_csv(csv_path, zip_path):
    with open(csv_path, 'r') as csv_file:
        csv_reader = csv.DictReader(csv_file)
        zip_buffer = io.BytesIO()
        with zipfile.ZipFile(zip_buffer, 'a', zipfile.ZIP_DEFLATED, False) as zip_file:
            for row in csv_reader:
                code = row['code']
                url = f"https://cdn.airnavradar.com/airlines/sq/{code}.png"
                image_data = fetch_image(url)
                if image_data:
                    zip_file.writestr(f"{code}.png", image_data)
                    logging.info(f"Added image for code: {code}")
        with open(zip_path, 'wb') as f:
            f.write(zip_buffer.getvalue())
        logging.info("ZIP file created successfully.")

if __name__ == "__main__":
    create_zip_from_csv('airlines.csv', 'airline_images.zip')
