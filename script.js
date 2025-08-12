// Aguarda o carregamento completo da página
document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('lead-form'); // Garanta que seu <form> no HTML tem o id="lead-form"
  const captchaLabel = document.getElementById('captcha-label'); // Garanta que sua <label> do captcha tem o id="captcha-label"
  const formMessage = document.getElementById('form-message'); // Garanta que você tem uma <div> com id="form-message" para os recados

  // --- Lógica do Captcha Matemático ---
  const num1 = Math.floor(Math.random() * 10) + 1;
  const num2 = Math.floor(Math.random() * 10) + 1;
  const correctAnswer = num1 + num2;
  captchaLabel.textContent = `Quanto é ${num1} + ${num2}?`;

  // --- Lógica de Envio do Formulário ---
  form.addEventListener('submit', function(event) {
    event.preventDefault();

    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const telefone = document.getElementById('telefone').value;
    const userAnswer = parseInt(document.getElementById('captcha').value, 10);

    // 1. Validar o Captcha
    if (userAnswer !== correctAnswer) {
      formMessage.textContent = 'A resposta da soma está incorreta. Tente novamente.';
      formMessage.style.color = 'red';
      return;
    }

    formMessage.textContent = 'Enviando...';
    formMessage.style.color = 'black';
    
    // 2. Montar os dados para o HubSpot
    const hubspotData = {
      fields: [
        { name: 'firstname', value: nome },
        { name: 'email', value: email },
        { name: 'phone', value: telefone }
      ],
      context: {
        pageUri: window.location.href,
        pageName: document.title
      }
    };

    // 3. Enviar para a API do HubSpot com os IDs CORRETOS
    const portalId = '50364600';
    const formGuid = '11c0e10e-f481-45fd-ac77-472f986ac3bb';
    const url = `https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formGuid}`;

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(hubspotData)
    })
    .then(response => {
      if (response.ok) {
        formMessage.textContent = 'Cadastro enviado com sucesso! Obrigado.';
        formMessage.style.color = 'green';
        form.reset(); // Limpa o formulário
        // Recria o desafio matemático para o próximo envio
        const newNum1 = Math.floor(Math.random() * 10) + 1;
        const newNum2 = Math.floor(Math.random() * 10) + 1;
        correctAnswer = newNum1 + newNum2;
        captchaLabel.textContent = `Quanto é ${newNum1} + ${newNum2}?`;

      } else {
        response.json().then(data => {
          formMessage.textContent = `Ocorreu um erro: ${data.errors[0].message}`;
          formMessage.style.color = 'red';
        });
      }
    })
    .catch(error => {
      console.error('Erro de conexão:', error);
      formMessage.textContent = 'Ocorreu um erro de conexão. Verifique sua internet e tente novamente.';
      formMessage.style.color = 'red';
    });
  });
});

// --- Lógica do Acordeão de Cursos ---
document.addEventListener('DOMContentLoaded', function() {
    // ... (o código do formulário e captcha já deve estar aqui em cima)

    const accordionBtns = document.querySelectorAll('.accordion-button');

    accordionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const content = document.querySelector(this.dataset.target);
            const isActive = this.classList.contains('active');

            // Fecha todos os acordeões abertos
            accordionBtns.forEach(otherBtn => {
                const otherContent = document.querySelector(otherBtn.dataset.target);
                if (otherBtn !== this) {
                    otherBtn.classList.remove('active');
                    otherContent.style.maxHeight = null;
                }
            });

            // Abre ou fecha o acordeão clicado
            if (isActive) {
                this.classList.remove('active');
                content.style.maxHeight = null;
            } else {
                this.classList.add('active');
                // Define a altura máxima para o conteúdo se expandir
                content.style.maxHeight = content.scrollHeight + "px";
            }
        });
    });
});