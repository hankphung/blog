

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get Firestore instance
const db = firebase.firestore();
// // Fetch event agenda data from an API or use static data
// const fetchAgendaData = () => {
//     return fetch('api/agenda')
//       .then(response => response.json())
//       .catch(error => {
//         console.error('Failed to fetch agenda data:', error);
//       });
//   };
const fetchAgendaData = () => {
  return db.collection('agenda').get()
    .then(snapshot => {
      const agendaData = [];
      snapshot.forEach(doc => {
        const agendaItem = doc.data();
        agendaData.push(agendaItem);
      });
      return agendaData;
    })
    .catch(error => {
      console.error('Failed to fetch agenda data:', error);
    });
};
// Render the agenda on the page
const renderAgenda = (agendaData) => {
  const agendaElement = document.getElementById('agenda');

  // Clear previous agenda data
  agendaElement.innerHTML = '';

  // Loop through agenda items and create HTML elements
  agendaData.forEach(item => {
    const time = item.time;
    const title = item.title;
    const description = item.description;

    const agendaItemElement = document.createElement('div');
    agendaItemElement.classList.add('agenda-item');

    const timeElement = document.createElement('h2');
    timeElement.textContent = time;

    const titleElement = document.createElement('h3');
    titleElement.textContent = title;

    const descriptionElement = document.createElement('p');
    descriptionElement.textContent = description;

    agendaItemElement.appendChild(timeElement);
    agendaItemElement.appendChild(titleElement);
    agendaItemElement.appendChild(descriptionElement);

    agendaElement.appendChild(agendaItemElement);
  });
};

// Fetch agenda data and render it on page load
window.addEventListener('load', () => {
  fetchAgendaData()
    .then(agendaData => {
      renderAgenda(agendaData);
    });
});