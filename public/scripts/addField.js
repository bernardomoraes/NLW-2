// Procurar o botão
document.querySelector('#add-time').addEventListener('click', cloneField);
// Clicar no botão

// Executar uma ação
function cloneField() {
  console.log('Hello World');
  // Duplicar os campos
  const newFieldContainer = document.querySelector('.schedule-item').cloneNode(true);

  //Limpar os campos
  const fields = newFieldContainer.querySelectorAll('input');

  fields.forEach((e) => (e.value = ""))

  // Colocar na página
  document.querySelector('#schedule-items').appendChild(newFieldContainer);
}