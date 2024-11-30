import pandas as pd
import numpy as np
from sklearn.preprocessing import OneHotEncoder, LabelEncoder
from sklearn.impute import SimpleImputer
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, accuracy_score, confusion_matrix
from imblearn.over_sampling import SMOTE

class LeadScorer:
    def __init__(self):
        self.model = None
        self.label_encoders = {}
        self.onehot_encoder = None
        self.feature_names = [
            'name_length',
            'email_domain_type',
            'company_name_length',
            'has_company',
            'has_email'
        ]
        
    def _preprocess_features(self, data):
        """Extract and preprocess features from lead data"""
        features = []
        
        # Name features
        name = data.get('name', '')
        features.append(len(name) if name else 0)  # name length
        
        # Email features
        email = data.get('email', '')
        if email:
            domain = email.split('@')[-1] if '@' in email else ''
            # Check if business domain
            is_business = 1 if any(ext in domain for ext in ['.com', '.org', '.net', '.io', '.co']) else 0
        else:
            is_business = 0
        features.append(is_business)
        
        # Company features
        company = data.get('company', '')
        features.append(len(company) if company else 0)  # company name length
        features.append(1 if company else 0)  # has company
        
        # Contact info completeness
        features.append(1 if email else 0)  # has email
        
        return np.array(features).reshape(1, -1)
    
    def train(self, training_data):
        """Train the model on historical data"""
        # Convert training data to features
        X = []
        y = []
        
        for lead in training_data:
            X.append(self._preprocess_features(lead))
            y.append(lead.get('converted', 0))  # 1 if converted, 0 if not
            
        X = np.vstack(X)
        y = np.array(y)
        
        # Train random forest classifier
        self.model = RandomForestClassifier(n_estimators=100, random_state=42)
        self.model.fit(X, y)
    
    def predict_score(self, lead_data):
        """Predict conversion probability for a new lead"""
        if not self.model:
            raise ValueError("Model not trained. Call train() first.")
            
        # Preprocess features
        X = self._preprocess_features(lead_data)
        
        # Get probability of conversion
        proba = self.model.predict_proba(X)[0][1]  # probability of class 1 (converted)
        
        return proba
        
    def batch_predict(self, leads_data):
        """Predict conversion probabilities for multiple leads"""
        return [self.predict_score(lead) for lead in leads_data]
