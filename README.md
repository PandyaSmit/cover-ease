# 📝 CoverEase

**CoverEase** is a smart web app that generates personalized, professional cover letters using state-of-the-art language models. Simply provide your background details, and CoverEase will create a tailored cover letter to match the job you're applying for.

---

## 🚀 Core Features

* **Information Input**: Fill out fields like job title, company, skills, and experience.
* **AI-Powered Cover Letter Generation**: Uses a fine-tuned version of [`google/flan-t5-large`](https://huggingface.co/google/flan-t5-large) on the [`ShashiVish/cover-letter-dataset`](https://huggingface.co/datasets/ShashiVish/cover-letter-dataset).
* **Real-time Preview**: Instantly view the generated letter in a clean, copy-friendly format.

---

## 🎨 Style Guidelines

| Element         | Color Code | Purpose                              |
| --------------- | ---------- | ------------------------------------ |
| Primary Color   | `#3498db`  | Trustworthy and professional accents |
| Secondary Color | `#ecf0f1`  | Subtle background contrast           |
| Accent Color    | `#2ecc71`  | Highlights key actions and success   |

* Clean, minimal layout to guide users intuitively.
* Professional icons for each input field and interaction point.

---

## 🧠 Model & Training Info

* **Base Model**: [`google/flan-t5-large`](https://huggingface.co/google/flan-t5-large)
* **Fine-tuning Dataset**: [`ShashiVish/cover-letter-dataset`](https://huggingface.co/datasets/ShashiVish/cover-letter-dataset)
* **Training Notebook**: [Google Colab - Fine-tuning FLAN-T5](https://colab.research.google.com/drive/1tZS7fAGnx8gLOZBBjA2Wkbq6PMNvMfh3?usp=sharing)

---

## 🤖 Use the Model

* **Hosted Model on Hugging Face**: [Try the CoverEase Model](https://huggingface.co/smitzpandya/cover-ease-fine-tuned-t5)
* **Google Colab for Inference**: [Run the Model in Colab](https://colab.research.google.com/drive/1XG8TzQIVQU4ujTlkuPWznCSAHx9faOzN?usp=sharing)

---

## 📄 Example Use Case

Input:

```
Job Title: Data Scientist  
Company: OpenAI  
Skills: Python, Machine Learning, NLP  
Experience: 3 years at XYZ Corp  
```

Output:

> *"Dear Hiring Manager at OpenAI,
> With over 3 years of hands-on experience in machine learning and NLP, I bring a strong track record..."*

---

## 💼 License

MIT License. Feel free to use and improve the app for your own projects.
