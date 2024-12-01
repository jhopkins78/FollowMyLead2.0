from lead_scoring import LeadScorer
import json
import os
from flask import current_app

class LeadScoringService:
    _instance = None
    _model = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(LeadScoringService, cls).__new__(cls)
            cls._instance._model = LeadScorer()
            # Try to load training data and train model
            try:
                with open('mock_data.json', 'r') as f:
                    training_data = json.load(f)
                    cls._instance._model.train(training_data)
            except Exception as e:
                # Log warning without using current_app
                print(f"Could not train lead scoring model: {str(e)}")
        return cls._instance
    
    def score_lead(self, lead_data):
        """Calculate a lead score based on available data"""
        try:
            # If model is trained, use it for prediction
            if self._model and hasattr(self._model, 'model') and self._model.model is not None:
                score = self._model.predict_score(lead_data)
                if current_app:  # Only log if within application context
                    current_app.logger.info(f"ML model score for lead: {score}")
                return score
            
            # Fallback to rule-based scoring if model not trained
            score = 0.0
            
            # Email scoring
            email = lead_data.get('email', '').lower()
            if email:
                score += 0.3
                # Bonus for business email domains
                business_domains = ['com', 'org', 'net', 'io', 'co']
                if any(email.endswith('.' + domain) for domain in business_domains):
                    score += 0.1
            
            # Company scoring
            company = lead_data.get('company', '').lower()
            if company:
                score += 0.3
                # Bonus for technology or innovation related terms
                tech_terms = ['tech', 'solutions', 'digital', 'software', 'innovations', 'systems']
                if any(term in company for term in tech_terms):
                    score += 0.1
            
            # Name scoring
            name = lead_data.get('name', '')
            if name:
                score += 0.2
            
            if current_app:  # Only log if within application context
                current_app.logger.info(f"Rule-based score for lead: {score}")
            return min(max(score, 0.0), 1.0)
            
        except Exception as e:
            if current_app:  # Only log if within application context
                current_app.logger.error(f"Error calculating lead score: {str(e)}")
            return 0.0  # Return minimum score on error
    
    def batch_score_leads(self, leads_data):
        """Score multiple leads at once"""
        return [self.score_lead(lead) for lead in leads_data]
