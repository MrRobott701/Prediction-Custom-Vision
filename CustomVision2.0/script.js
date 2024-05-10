
// Llamar a la función togglePredictButtonVisibility() cada vez que cambie la imagen
document.getElementById('fileInput').addEventListener('change', togglePredictButtonVisibility);
async function predict() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];

    if (!file) {
        alert('Por favor, selecciona un archivo de imagen.');
        return;
    }
// CREDENCIALES DE AZURE COGNITIVE SERVICES
    const endpoint = 'https://customvisionrazas-prediction.cognitiveservices.azure.com';
    const predictionKey = 'f5cb652899c1408a998ee904e79a85e6';
    const projectId = '8f153988-3561-42e0-82ce-fced699cba09';
    const publishedIterationName = 'Predict2';

    const url = `${endpoint}/customvision/v3.0/Prediction/${projectId}/classify/iterations/${publishedIterationName}/image`;
//--------------------------------------------------------------------------------
    const formData = new FormData();
    formData.append('image', file);

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Prediction-Key': predictionKey
            },
            body: formData
        });

        const data = await response.json();
        // Enviar la predicción al chat bot
        sendPredictionToChatBot(data);
        // Mostrar la miniatura de la imagen en el chat
        displayImagePreview(file);
    } catch (error) {
        console.error('Error al realizar la predicción:', error);
    }
    // Ocultar el botón de predecir después de realizar la predicción
const predictButton = document.getElementById('predictButton');
if (predictButton) {
    predictButton.style.display = 'none';
}
}

function submitQuestion() {
    const questionInput = document.getElementById('questionInput');
    const question = questionInput.value.trim(); 

    if (question !== '') {
        addMessage('user', question); // Agregar la pregunta al chat como un mensaje del usuario
        askQuestion(question); // Llamar a askQuestion con la pregunta como parámetro
        questionInput.value = ''; 
    } else {
        alert('Por favor, ingrese una pregunta.');
    }
}



// Función para mostrar u ocultar el botón de predecir según si se seleccionó una imagen
function togglePredictButtonVisibility() {
    const fileInput = document.getElementById('fileInput');
    const predictButton = document.getElementById('predictButton');
    if (fileInput.files.length > 0) {
        predictButton.style.display = 'inline-block';
    } else {
        predictButton.style.display = 'none';
    }
}



function sendPredictionToChatBot(data) {
    if (data.predictions && data.predictions.length > 0) {
        // Ordenar las predicciones por probabilidad de mayor a menor
        const sortedPredictions = data.predictions.sort((a, b) => b.probability - a.probability);

        // Tomar la predicción con la probabilidad más alta
        const topPrediction = sortedPredictions[0];

        // Enviar la predicción al chat bot como si fuera un mensaje del usuario
        const predictionMessage = `${topPrediction.tagName}`;

/* IMPRIMIR LA PREDICCION CON SU PORCENTAJE DE ACIERTO
        const predictionMessage = `Mi predicción es que esta imagen es ${topPrediction.tagName} con una probabilidad del ${(
            topPrediction.probability * 100
        ).toFixed(2)}%.`;
*/
        // Simular una pregunta del usuario con la predicción
        askQuestion(predictionMessage);
    } else {
        addMessage('bot', 'No se pudo realizar la predicción.');
    }
}

async function askQuestion(question) {
    var request = {
        top: 3,
        question: question,
        includeUnstructuredSources: true,
        confidenceScoreThreshold: 0.5,
        answerSpanRequest: {
            enable: true,
            topAnswersWithSpan: 1,
            confidenceScoreThreshold: 0.5
        }
    };

    try {
        const response = await fetch("https://chatbbot.cognitiveservices.azure.com/language/:query-knowledgebases?projectName=chat-bot&api-version=2021-10-01&deploymentName=production", {
            method: "POST",
            headers: {
                "Ocp-Apim-Subscription-Key": "d1a4a7ccd04946e6bf30a4aea0811f6e",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(request)
        });

        const data = await response.json();
        // Manejar la respuesta aquí, por ejemplo, mostrarla en el contenedor de respuesta
        var answer = data.answers[0].answer;
        // Agregar la respuesta del bot al chat
        addMessage('bot', answer);
    } catch (error) {
        console.error("Error:", error);
    }
}



function addMessage(sender, message) {
    var chatBox = document.getElementById("chatBox");
    var messageElement = document.createElement("div");
    messageElement.classList.add("message");
    messageElement.classList.add(sender + "-message");
    messageElement.innerHTML = message;
    chatBox.appendChild(messageElement);
}



function displayImagePreview(imageFile) {
    const chatBox = document.getElementById('chatBox');
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    messageElement.classList.add('user-message');

    const imageElement = document.createElement('img');
    imageElement.src = URL.createObjectURL(imageFile);
    imageElement.width = 100; // Establece el ancho deseado para la miniatura
    imageElement.height = 100; // Establece la altura deseada para la miniatura

    messageElement.appendChild(imageElement);
    chatBox.appendChild(messageElement);
}

