// Configuration MQTT
const brokerUrl = "wss://votre-cluster.hivemq.cloud:8884/mqtt"; // Remplacez par l'URL de votre cluster HiveMQ (utilisez wss:// pour TLS)
const clientId = "Android_Dashboard_" + Math.random().toString(16).substr(2, 8);
const username = "votre_utilisateur"; // Optionnel
const password = "votre_mot_de_passe"; // Optionnel

// Créer un client MQTT
const client = new Paho.MQTT.Client(brokerUrl, clientId);

// Fonction de connexion
function connectToBroker() {
  client.connect({
    userName: username,
    password: password,
    onSuccess: () => {
      console.log("Connecté à HiveMQ !");
      client.subscribe("esp32/temperature");
      client.subscribe("esp32/humidity");
      client.subscribe("esp32/cam/image");
    },
    onFailure: (error) => {
      console.error("Erreur de connexion :", error);
      setTimeout(connectToBroker, 5000); // Réessayer après 5 secondes
    }
  });
}

// Appeler la fonction de connexion
connectToBroker();

// Gérer les messages entrants
client.onMessageArrived = (message) => {
  const topic = message.destinationName;
  const payload = message.payloadString;

  if (topic === "esp32/temperature") {
    document.getElementById("temperature").textContent = payload + " °C";
  } else if (topic === "esp32/humidity") {
    document.getElementById("humidity").textContent = payload + " %";
  } else if (topic === "esp32/cam/image") {
    // Décoder l'image en Base64
    document.getElementById("cameraImage").src = "data:image/jpeg;base64," + payload;
  }
};

// Gérer les boutons pour contrôler la LED
document.getElementById("ledOn").addEventListener("click", () => {
  const message = new Paho.MQTT.Message("ON");
  message.destinationName = "esp32/led/commande";
  client.send(message);
});

document.getElementById("ledOff").addEventListener("click", () => {
  const message = new Paho.MQTT.Message("OFF");
  message.destinationName = "esp32/led/commande";
  client.send(message);
});
