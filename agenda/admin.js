

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get Firestore instance
const db = firebase.firestore();

// Reference to the agenda collection
const agendaRef = db.collection('agenda');

// Handle form submission
const agendaForm = document.getElementById('agendaForm');
agendaForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // Get form input values
  const time = document.getElementById('timeInput').value;
  const title = document.getElementById('titleInput').value;
  const description = document.getElementById('descriptionInput').value;

  // Save agenda item to Firestore
  agendaRef.add({
    time: time,
    title: title,
    description: description
  })
    .then(() => {
      // Clear form inputs
      agendaForm.reset();
    })
    .catch(error => {
      console.error('Failed to save agenda item:', error);
    });
});

// Listen for changes in Firestore collection
agendaRef.onSnapshot(snapshot => {
  const agendaList = document.getElementById('agendaList');

  // Clear previous agenda items
  agendaList.innerHTML = '';

  snapshot.forEach(doc => {
    const agendaItem = doc.data();
    const agendaItemId = doc.id;

    const li = document.createElement('li');

    const time = document.createElement('span');
    time.textContent = `Time: ${agendaItem.time}`;

    const title = document.createElement('span');
    title.textContent = `Title: ${agendaItem.title}`;

    const description = document.createElement('span');
    description.textContent = `Description: ${agendaItem.description}`;

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => {
      // Delete agenda item from Firestore
      agendaRef.doc(agendaItemId).delete()
        .catch(error => {
          console.error('Failed to delete agenda item:', error);
        });
    });

    li.appendChild(time);
    li.appendChild(title);
    li.appendChild(description);
    li.appendChild(deleteButton);

    agendaList.appendChild(li);
  });
});