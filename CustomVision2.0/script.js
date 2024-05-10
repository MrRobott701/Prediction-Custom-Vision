async function predict() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];

    if (!file) {
        alert('Por favor, selecciona un archivo de imagen.');
        return;
    }

    const endpoint = 'https://customvisionrazas-prediction.cognitiveservices.azure.com';
    const predictionKey = 'f5cb652899c1408a998ee904e79a85e6';
    const projectId = '8f153988-3561-42e0-82ce-fced699cba09';
    const publishedIterationName = 'Predict2';

    const url = `${endpoint}/customvision/v3.0/Prediction/${projectId}/classify/iterations/${publishedIterationName}/image`;

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
        displayResult(data);
    } catch (error) {
        console.error('Error al realizar la predicción:', error);
    }
}
async function predict() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];

    if (!file) {
        alert('Por favor, selecciona un archivo de imagen.');
        return;
    }

    const endpoint = 'https://customvisionrazas-prediction.cognitiveservices.azure.com';
    const predictionKey = 'f5cb652899c1408a998ee904e79a85e6';
    const projectId = '8f153988-3561-42e0-82ce-fced699cba09';
    const publishedIterationName = 'Predict2';

    const url = `${endpoint}/customvision/v3.0/Prediction/${projectId}/classify/iterations/${publishedIterationName}/image`;

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
        displayResult(data);
    } catch (error) {
        console.error('Error al realizar la predicción:', error);
    }
}
function displayResult(data) {
    const resultDiv = document.getElementById('predictionResult');
    resultDiv.innerHTML = '';

    if (data.predictions && data.predictions.length > 0) {
        // Ordenar las predicciones por probabilidad de mayor a menor
        const sortedPredictions = data.predictions.sort((a, b) => b.probability - a.probability);

        // Tomar solo los tres primeros elementos (los de mayor probabilidad)
        const topPredictions = sortedPredictions.slice(0, 3);

        // Mostrar los resultados
        topPredictions.forEach(prediction => {
            const tag = prediction.tagName;
            const probability = (prediction.probability * 100).toFixed(2);
            resultDiv.innerHTML += `<p>${tag}: ${probability}%</p>`;
        });
    } else {
        resultDiv.innerHTML = '<p>No se encontraron predicciones.</p>';
    }
}

