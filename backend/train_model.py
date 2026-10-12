"""
Training Script for Fake News Detection Model
Uses TF-IDF Vectorization and Multinomial Naive Bayes Classifier.
Saves model.pkl, tfidf_vectorizer.pkl, and lightweight model_weights.json.
"""

import os
import json
import joblib
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score

from nlp_pipeline import clean_text

# High-quality benchmark training dataset covering multiple news domains:
# Labels: 0 = REAL, 1 = FAKE
TRAINING_DATA = [
    # REAL NEWS SAMPLES
    ("NASA's James Webb Space Telescope has captured deep-field images of the earliest known galaxies formed shortly after the Big Bang, astronomers confirmed in a peer-reviewed study published in Nature.", 0),
    ("The Federal Reserve announced a 25 basis point reduction in the benchmark interest rate, citing cooling inflation metrics and stable employment data.", 0),
    ("World Health Organization officials reported a steady decline in global mpox transmission following targeted vaccination campaigns and coordinated surveillance.", 0),
    ("The European Union passed landmark legislation establishing comprehensive safety guidelines and transparency mandates for artificial intelligence applications.", 0),
    ("Reuters reported that international climate negotiators reached a preliminary agreement on loss and damage funding at the United Nations summit.", 0),
    ("Clinical trials conducted across twelve university hospitals revealed that the newly developed mRNA vaccine reduced pancreatic cancer recurrence by 44 percent.", 0),
    ("The Bureau of Labor Statistics reported that nonfarm payroll employment rose by 175,000 last month, with the unemployment rate holding steady at 3.9 percent.", 0),
    ("Japan's space agency successfully landed its SLIM spacecraft on the lunar surface, achieving unprecedented pinpoint accuracy according to telemetry telemetry data.", 0),
    ("The Supreme Court issued a 6-3 ruling interpreting statutory authority under administrative law, clarifying executive agency regulatory jurisdiction.", 0),
    ("A bipartisan group of senators introduced legislation aimed at bolstering cybersecurity standards across critical national infrastructure facilities.", 0),
    ("According to the Associated Press, archaeological excavations in Egypt uncovered an ancient tomb complex dating back to the Fifth Dynasty containing intact hieroglyphic inscriptions.", 0),
    ("A peer-reviewed paper in Science demonstrated that global ocean currents are absorbing significant thermal energy, moderating regional atmospheric temperatures.", 0),
    ("The International Monetary Fund upgraded its global economic growth forecast to 3.2 percent, citing resilient consumer spending and easing supply bottlenecks.", 0),
    ("Medical researchers at Johns Hopkins University demonstrated that regular aerobic exercise substantially reduces cellular markers of neurodegenerative disorders.", 0),
    ("The National Oceanic and Atmospheric Administration deployed high-resolution oceanic buoys to monitor tectonic shift and early tsunami warning systems.", 0),
    ("Major tech consortium announced new interoperability standards for quantum encryption algorithms approved by the National Institute of Standards and Technology.", 0),
    ("The Department of Transportation authorized federal grant funding to replace aging railway bridges and modernize municipal transit lines across eight states.", 0),
    ("Agricultural scientists developed drought-resistant hybrid wheat cultivars capable of maintaining yields under extreme temperature variations.", 0),
    ("The World Bank published its annual development report highlighting significant gains in global extreme poverty reduction over the preceding decade.", 0),
    ("A joint investigation by the BBC and independent forensic analysts verified satellite imagery documenting environmental degradation in the Amazon basin.", 0),

    # FAKE / FABRICATED / DISINFORMATION SAMPLES
    ("SHOCKING: Secret government laboratory caught spraying mind-control chemicals in commercial airliner contrails to hypnotize citizens! Mainstream media covering it up!", 1),
    ("MIRACLE CURE: Drinking raw boiled lemon and baking soda completely eliminates all stage four cancers in 48 hours, Big Pharma doctors desperately try to hide this truth!", 1),
    ("BREAKING: Alien spacecraft secretly recovered by clandestine military deep state under the Pentagon, world leaders signing secret planetary surrender treaty!", 1),
    ("BOMBSHELL REVELATION: Drinking tap water turns your bloodstream magnetic due to secret nanotechnology injected by globalist billionaires! Share before it gets deleted!", 1),
    ("UNBELIEVABLE: 5G mobile towers are secretly transmitting microwave radiation designed to alter human DNA and depopulate cities worldwide!", 1),
    ("EXPOSED: Top secret documents prove that world leaders are replaced by cloned androids controlled by ancient subterranean shadow syndicates!", 1),
    ("URGENT ALERT: Government announces total confiscation of all private bank accounts starting tomorrow midnight! Convert your money to unregulated crypto right now!", 1),
    ("SHOCKING DISCOVERY: Scientists confirm the moon is hollow and artificially manufactured by prehistoric reptilian civilizations!", 1),
    ("VIRAL TRUTH: Putting sliced onions in your socks overnight extracts 100 percent of viral pathogens and cures influenza instantly!", 1),
    ("BREAKING NEWS: Supreme Court secretly abolishes all federal elections and appoints an unelected military junta to rule indefinitely! Mainstream press is silenced!", 1),
    ("DOCTORS STUNNED: One spoonful of this bizarre kitchen spice burns 30 pounds of belly fat in 3 days while you sleep with zero diet or exercise!", 1),
    ("EXPOSED: Secret microchips detected inside supermarket barcode stickers to track your grocery purchases and transmit personal thoughts!", 1),
    ("TERRIFYING REPORT: Drinking coffee is a secret plot engineered by foreign spies to lower public intelligence and sabotage national defenses!", 1),
    ("CONFIDENTIAL LEAK: NASA admits the earth is completely enclosed inside a crystalline dome and space exploration was staged in a Hollywood warehouse!", 1),
    ("YOU WON'T BELIEVE THIS: Ancient Tibetan monk reveals hidden spiritual chant that instantly manifest millions of dollars in your bank account!", 1),
    ("MAINSTREAM MEDIA IS LYING: Massive underground nuclear detonation secretly occurred beneath the Atlantic Ocean causing mysterious tides!", 1),
    ("DEADLY CONSPIRACY: Everyday household microwaves emit cosmic dark matter rays that infect your family with incurable phantom illnesses!", 1),
    ("SECRET COVER-UP: Global elite caught drinking synthetic youth serum derived from endangered ocean creatures on private luxury submarine!", 1),
    ("BOMBSHELL: New smartphone update allows military satellites to read your private subconscious memories even when your phone is turned off!", 1),
    ("SHOCKING SCANDAL: Renowned scientists admit all gravity laws are completely fabricated to conceal perpetual free energy machines!", 1)
]

def train_and_save():
    print("Starting ML Model and NLP Pipeline Training...")
    
    texts = [clean_text(item[0]) for item in TRAINING_DATA]
    labels = [item[1] for item in TRAINING_DATA]

    # Split for validation
    X_train, X_val, y_train, y_val = train_test_split(
        texts, labels, test_size=0.25, random_state=42, stratify=labels
    )

    # Initialize TF-IDF Vectorizer
    vectorizer = TfidfVectorizer(
        max_features=2500,
        ngram_range=(1, 2),
        sublinear_tf=True
    )

    X_train_vec = vectorizer.fit_transform(X_train)
    X_val_vec = vectorizer.transform(X_val)

    # Train Multinomial Naive Bayes
    clf = MultinomialNB(alpha=0.1)
    clf.fit(X_train_vec, y_train)

    # Evaluate
    val_preds = clf.predict(X_val_vec)
    acc = accuracy_score(y_val, val_preds)
    print(f"Validation Accuracy: {acc * 100:.2f}%")
    print("\nClassification Report:\n", classification_report(y_val, val_preds, target_names=["REAL", "FAKE"]))

    # Save Scikit-Learn .pkl artifacts
    output_dir = os.path.dirname(os.path.abspath(__file__))
    model_path = os.path.join(output_dir, "model.pkl")
    vectorizer_path = os.path.join(output_dir, "tfidf_vectorizer.pkl")

    joblib.dump(clf, model_path)
    joblib.dump(vectorizer, vectorizer_path)
    print(f"Saved model to {model_path}")
    print(f"Saved vectorizer to {vectorizer_path}")

    # Export portable JSON weights for isomorphic inference in Next.js backend
    weights_path = os.path.join(output_dir, "model_weights.json")
    vocab = vectorizer.vocabulary_
    idf = vectorizer.idf_.tolist()
    feature_log_prob = clf.feature_log_prob_.tolist()
    class_log_prior = clf.class_log_prior_.tolist()
    classes = [int(c) for c in clf.classes_]

    model_weights_data = {
        "vocabulary": {k: int(v) for k, v in vocab.items()},
        "idf": idf,
        "feature_log_prob": feature_log_prob,
        "class_log_prior": class_log_prior,
        "classes": classes,
        "class_names": {0: "REAL", 1: "FAKE"}
    }

    with open(weights_path, "w", encoding="utf-8") as f:
        json.dump(model_weights_data, f)
    print(f"Saved portable model weights to {weights_path}")

    # Also save a copy inside app/api/analyze/ for seamless Next.js execution
    nextjs_target_dir = os.path.abspath(os.path.join(output_dir, "..", "app", "api", "analyze"))
    os.makedirs(nextjs_target_dir, exist_ok=True)
    nextjs_weights_path = os.path.join(nextjs_target_dir, "model_weights.json")
    with open(nextjs_weights_path, "w", encoding="utf-8") as f:
        json.dump(model_weights_data, f)
    print(f"Exported copy to Next.js API dir: {nextjs_weights_path}")

if __name__ == "__main__":
    train_and_save()
