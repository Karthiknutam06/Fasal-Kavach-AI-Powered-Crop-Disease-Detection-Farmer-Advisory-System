import os

os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3' 

import tensorflow as tf
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D, Dropout
from tensorflow.keras.models import Model

print("==================================================")
print("Fasal Kavach AI - Live Model Training Engine")
print("==================================================")
print("[*] Loading custom Plant Disease Dataset from local directory...")

dataset_dir = os.path.join(os.path.dirname(__file__), 'dataset', 'color')

if not os.path.exists(dataset_dir) or len(os.listdir(dataset_dir)) == 0:
    print(f"[-] ERROR: Dataset folder not found or is empty at: {dataset_dir}")
    print("[-] Please download your dataset and extract it here so that each disease has its own subfolder.")
    print("[-] Example: backend/dataset/Tomato_Late_Blight/img1.jpg")
    exit(1)

BATCH_SIZE = 32
IMG_SIZE = (224, 224)

train_dataset = tf.keras.utils.image_dataset_from_directory(
    dataset_dir,
    validation_split=0.2,
    subset="training",
    seed=123,
    image_size=IMG_SIZE,
    batch_size=BATCH_SIZE
)

val_dataset = tf.keras.utils.image_dataset_from_directory(
    dataset_dir,
    validation_split=0.2,
    subset="validation",
    seed=123,
    image_size=IMG_SIZE,
    batch_size=BATCH_SIZE
)

# Extract dynamic class names directly from the folder names the user provided!
class_names = train_dataset.class_names
NUM_CLASSES = len(class_names)
print(f"[*] Dataset mapped successfully. Found {NUM_CLASSES} distinct crop disease classes.")

# Preprocessing Pipeline Configuration
# MobileNetV2 requires pixels in [-1, 1]
normalization_layer = tf.keras.layers.Rescaling(1./127.5, offset=-1)

# Appending ignore_errors() to silently drop any corrupted image files from Kaggle
train_dataset = train_dataset.ignore_errors().map(lambda x, y: (normalization_layer(x), y)).prefetch(buffer_size=tf.data.AUTOTUNE)
val_dataset = val_dataset.ignore_errors().map(lambda x, y: (normalization_layer(x), y)).prefetch(buffer_size=tf.data.AUTOTUNE)

print("[*] Constructing Neural Network Architecture (MobileNetV2)...")
base_model = MobileNetV2(input_shape=(224, 224, 3), include_top=False, weights='imagenet')
base_model.trainable = False  # Freeze base layers for rapid training

x = base_model.output
x = GlobalAveragePooling2D()(x)
x = Dropout(0.2)(x)
predictions = Dense(NUM_CLASSES, activation='softmax')(x)

model = Model(inputs=base_model.input, outputs=predictions)

model.compile(optimizer='adam',
              loss='sparse_categorical_crossentropy',
              metrics=['accuracy'])

print("[*] Commencing Deep Learning Model Extraction... (1 Epoch Demo)")
# Train the model
model.fit(train_dataset, validation_data=val_dataset, epochs=1)

model_path = os.path.join(os.path.dirname(__file__), 'disease_model.h5')
model.save(model_path)

# Save the class names dynamically so app.py reads them perfectly without hardcoding
classes_path = os.path.join(os.path.dirname(__file__), 'classes.txt')
with open(classes_path, 'w') as f:
    f.write('\n'.join(class_names))

print(f"[*] SUCCESS! Live AI Model saved securely to => {model_path}")
print("[*] The Fasal Kavach backend (`app.py`) will now automatically switch to Native AI Inference using your exact folders!")
