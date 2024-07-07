import requests
from bs4 import BeautifulSoup
import pandas as pd
import json
import boto3
import os
from dotenv import load_dotenv

def extract_table_data(table):
    caption = table.find('caption')
    table_title = caption.text.strip() if caption else 'No Title'
    
    headers = [header.text.strip() for header in table.find_all('th')]
    
    tbody = table.find('tbody')
    if tbody:
        rows = tbody.find_all('tr')
    else:
        rows = table.find_all('tr')
    
    table_data = []
    max_columns = max(len(headers), max(len(row.find_all(['th', 'td'])) for row in rows if row.find_all(['th', 'td'])))
    
    for row in rows:
        cells = row.find_all(['th', 'td'])
        if cells:
            cell_data = [cell.text.strip() for cell in cells]
            if len(cell_data) < max_columns:
                cell_data += [''] * (max_columns - len(cell_data))
            table_data.append(cell_data)
    
    if not headers:
        headers = [f"Column {i+1}" for i in range(max_columns)]
    elif len(headers) < max_columns:
        headers += [''] * (max_columns - len(headers))
    
    return table_title, pd.DataFrame(table_data, columns=headers)

def scrape_baseball_leaders():
    url = 'https://www.baseball-reference.com/leagues/MLB-leaders.shtml'
    response = requests.get(url)
    soup = BeautifulSoup(response.content, 'html.parser')
    
    leaderboards = {
        'Batting': 'all_leaderboard_batting',
        'Pitching': 'all_leaderboard_pitching',
        'Fielding': 'all_leaderboard_fielding'
    }
    
    data = {}
    for category, div_id in leaderboards.items():
        div = soup.find('div', class_='leaderboard_wrapper', id=div_id)
        if not div:
            continue
        
        tables = div.find_all('table')
        data[category] = []
        
        for table in tables:
            table_title, table_df = extract_table_data(table)
            data[category].append({
                'title': table_title,
                'data': table_df.to_dict(orient='records')
            })
    
    json_file_path = '/tmp/baseball_leaders.json'
    with open(json_file_path, 'w') as f:
        json.dump(data, f, indent=4)
    
    load_dotenv('C:/Users/smith/source/repos/website/website-app/.env')
    s3 = boto3.client('s3', 
                      aws_access_key_id=os.getenv('REACT_APP_AWS_ACCESS_KEY_ID'),
                      aws_secret_access_key=os.getenv('REACT_APP_AWS_SECRET_ACCESS_KEY'),
                      region_name=os.getenv('REACT_APP_AWS_REGION'))
    
    bucket_name = 'websiteapp-storage-fdb68492737c0-dev'
    s3_key = 'Sports_Stats/baseball_leaders.json'
    s3.upload_file(json_file_path, bucket_name, s3_key)
    print(f"File uploaded to s3://{bucket_name}/{s3_key}")

if __name__ == '__main__':
    data = scrape_baseball_leaders()
    display_baseball_leaders(data)
