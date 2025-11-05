import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

# ✅ Updated imports compatible with LangChain 1.x (v1.0.3)
from langchain_community.document_loaders import DirectoryLoader, TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_core.prompts import ChatPromptTemplate

# --- Note ---
# Fix for ValueError: Sync client is not available. Ensure API key is passed as a string, not callable.

load_dotenv()
OPENAI_API_KEY = str(os.getenv("OPENAI_API_KEY", "")).strip()

if not OPENAI_API_KEY:
    raise EnvironmentError("OPENAI_API_KEY not found. Please set it in your .env file.")

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return 'Backend is running. Try POST /chat instead.'

# --- Load and prepare data ---
DATA_DIR = os.path.join(os.path.dirname(__file__), "data")
loader = DirectoryLoader(DATA_DIR, glob="**/*.txt", loader_cls=TextLoader, loader_kwargs={"encoding": "utf-8"})
docs = loader.load()

splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=100)
chunks = splitter.split_documents(docs)

# --- Create embeddings and vectorstore ---
# ✅ Pass the API key directly as a string (fixes the sync client error)
embeddings = OpenAIEmbeddings(api_key=OPENAI_API_KEY)
vectorstore = FAISS.from_documents(chunks, embeddings)
retriever = vectorstore.as_retriever(search_kwargs={"k": 4})

# --- Define LLM and prompt ---
# ✅ Pass API key explicitly to avoid async client mismatch
llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.3, api_key=OPENAI_API_KEY)
#prompt = ChatPromptTemplate.from_template("Answer the user question using only the context provided.\n\nContext: {context}\n\nQuestion: {input}")

prompt = ChatPromptTemplate.from_template(
    """You are **Devasena Vangavolu’s Personal AI Assistant**, representing her portfolio and personality.
Respond in a warm, articulate, and confident tone. 
Be professional yet friendly. Always answer in first person (as if Devasena is speaking through you).
If the user asks about my background, highlight:
- I’m a Senior Analytics Consultant at EXL, working with FIS in FinTech & Marketing Analytics.
- My focus areas include Generative AI, Data Engineering, Entity Resolution, and Marketing Intelligence.
- I use tools like Python, SQL, PySpark, Azure, and LangChain.

If asked about achievements, mention metrics and impact when possible.
If asked something unrelated to my work, reply politely that you specialize in Devasena’s professional profile.

Use the following context to support your answers:
{context}

Now answer clearly and naturally and points wise whereever applicable:
User: {input}
Devasena’s AI Assistant:"""
)


@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json(silent=True, force=True) or {}
    query = data.get("message", "").strip()
    if not query:
        return jsonify({"response": "Please provide a question."})

    try:
        # Retrieve context documents
        docs = retriever.invoke(query)
        context = "\n\n".join([d.page_content for d in docs])

        # Format prompt and get LLM answer
        formatted_prompt = prompt.format(context=context, input=query)
        response = llm.invoke(formatted_prompt)

        answer = response.content if hasattr(response, 'content') else str(response)

    except Exception as e:
        answer = f"Error during processing: {e}"

    return jsonify({"response": answer or "No response generated."})

@app.route("/health", methods=["GET"])
def health():
    return {"ok": True}

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
