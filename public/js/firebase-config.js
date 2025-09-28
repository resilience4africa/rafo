// Firebase configuration for Mcket Website

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCdiw54sjqaeZReg1rsTtX2O2mB6dssEDI",
  authDomain: "resilience-for-africa-s-future.firebaseapp.com",
  projectId: "resilience-for-africa-s-future",
  storageBucket: "resilience-for-africa-s-future.firebasestorage.app",
  messagingSenderId: "933254932777",
  appId: "1:933254932777:web:d44a884ca2dc7d3c196f38",
  measurementId: "G-3Q1FHCMT75"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore(app);
const storage = firebase.storage(app);

// Function to fetch images from Firestore
async function fetchImagePaths() {
  try {
    console.log('Fetching image paths from Firestore...');
    
    // Get the specific document with ID "8hukJB0d6vmMa8iFSUlt" from imagesPaths collection
    const imagePathsDoc = await db.collection('imagesPaths').doc('8hukJB0d6vmMa8iFSUlt').get();
    
    if (imagePathsDoc.exists) {
      console.log('Image paths document found');
      const data = imagePathsDoc.data();
      console.log('Image paths data:', data);
      return data;
    } else {
      
      // Try to get any document in the collection as fallback
      const snapshot = await db.collection('imagesPaths').limit(1).get();
      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        console.log('Found alternative document:', doc.id);
        const data = doc.data();
        console.log('Alternative document data:', data);
        return data;
      }
      
      return null;
    }
  } catch (error) {
    console.error('Error getting image paths:', error);
    return null;
  }
}

// Load images when page is ready
document.addEventListener('DOMContentLoaded', () => {
  // Check if we have image containers
  const imageContainers = document.querySelectorAll('[data-dynamic-image]');
  
  if (imageContainers.length > 0) {
    loadDynamicImages();
  }
});

// Function to load dynamic images from Firebase
async function loadDynamicImages() {
  const imagePaths = await fetchImagePaths();
  if (!imagePaths) return;
  
  document.querySelectorAll('[data-dynamic-image]').forEach(async container => {
    const imageKey = container.getAttribute('data-dynamic-image');
    const path = imagePaths[imageKey];
    if (!path) return;
    try {
      const url = await storage.ref(path).getDownloadURL();
      if (container.tagName === 'IMG') {
        container.src = url;
        if (!container.alt) container.alt = imageKey;
      } else {
        container.style.backgroundImage = `url("${url}")`;
      }
      container.classList.add('loaded');
    } catch (error) {
      console.error('Error loading image for:', imageKey, error);
    }
  });
}
