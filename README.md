# GraphConnect

GraphConnect is a social network application inspired by popular platforms like Instagram and Twitter, designed to facilitate user interaction through features such as chatting, liking, and commenting on posts.

---

## ✨ Features

* **User Interaction:** Engage with other users through direct messaging, liking posts, and leaving comments.
* **Post Management:** Create and share posts, including image uploads.
* **Image Analysis:** Leverages Google Cloud Vision to analyze uploaded images, generating descriptive labels for enhanced content understanding and recommendation.
* **Recommendation System:** Features a nearest-neighbor search-based recommendation algorithm powered by FAISS for efficient content discovery.

---

## 🛠 Technical Stack

GraphConnect is built with a robust and scalable architecture, utilizing modern technologies for both front-end and back-end development, containerization, and cloud deployment.

### **Back-end**

* **Django:** A high-level Python web framework that encourages rapid development and clean, pragmatic design.
* **Django REST Framework:** A powerful and flexible toolkit for building Web APIs.

### **Front-end**

* **ReactJS:** A JavaScript library for building user interfaces.
* * **Tailwind UI:** A collection of professionally designed, fully responsive UI components built with Tailwind CSS, making it easy to quickly build modern user interfaces.

### **Containerization & Deployment**

* **Docker:** Used to containerize both the front-end and back-end applications, ensuring portability and consistent deployment across different environments.
* **Google Cloud Run:** The application is deployed on Google Cloud Run, leveraging Google's infrastructure for direct Docker container execution and website hosting.

### **Cloud Services**

* **Google Cloud Storage:** Utilized for media storage, with a dedicated bucket for static files (images, JavaScript, and CSS).
* **Google Cloud Vision:** Integrated for image recognition, analyzing images upon post creation and generating descriptive labels.
* **Google Cloud SQL (PostgreSQL):** The primary database, with tables defined using Django models and migrated to Cloud SQL.

### **Other Technologies**

* **FAISS (Facebook AI Similarity Search):** Employed for the nearest-neighbor search-based recommendation algorithm to efficiently handle large datasets.

---
Due to budget constraints, the application has been configured to run in local mode, which disables Google Cloud and FAISS-related features (still available in the GraphConnect_cloud branch).

As a result, the main branch (main) contains the local version of the application.
