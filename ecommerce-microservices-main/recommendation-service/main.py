import os
import pandas as pd
from fastapi import FastAPI, HTTPException
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import requests

app = FastAPI(title="E-Commerce AI Recommendation Service")

PRODUCT_SERVICE_URL = os.getenv("PRODUCT_SERVICE_URL", "http://product-service:8082")

def fetch_all_products():
    try:
        # Fetching a larger page of products for recommendation context
        response = requests.get(f"{PRODUCT_SERVICE_URL}/api/products?size=100")
        response.raise_for_status()
        data = response.json()
        return data.get("content", [])
    except Exception as e:
        print(f"Error fetching products: {e}")
        return []

@app.get("/api/recommendations/{product_id}")
async def get_recommendations(product_id: int):
    products = fetch_all_products()
    if not products:
        raise HTTPException(status_code=503, detail="Product Service unavailable")

    df = pd.DataFrame(products)
    
    if product_id not in df['id'].values:
        # If product not in our current fetch, return default (first few)
        return products[:5]

    # Combine relevant features for recommendation
    df['content'] = df['name'] + " " + df['category'] + " " + df['description'].fillna('')
    
    tfidf = TfidfVectorizer(stop_words='english')
    tfidf_matrix = tfidf.fit_transform(df['content'])
    
    cosine_sim = cosine_similarity(tfidf_matrix, tfidf_matrix)
    
    idx = df.index[df['id'] == product_id].tolist()[0]
    sim_scores = list(enumerate(cosine_sim[idx]))
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
    
    # Get top 5 similar products (excluding itself)
    sim_scores = [s for s in sim_scores if df.iloc[s[0]]['id'] != product_id]
    product_indices = [i[0] for i in sim_scores[:5]]
    
    return df.iloc[product_indices].to_dict('records')

@app.get("/health")
async def health():
    return {"status": "up"}
