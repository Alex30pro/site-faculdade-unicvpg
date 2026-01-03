document.addEventListener('DOMContentLoaded', function() {

    const form = document.getElementById('lead-form');
    if (form) {
        const captchaLabel = document.getElementById('captcha-label');
        const formMessage = document.getElementById('form-message');

        let num1 = Math.floor(Math.random() * 10) + 1;
        let num2 = Math.floor(Math.random() * 10) + 1;
        let correctAnswer = num1 + num2;

        captchaLabel.textContent = `Quanto é ${num1} + ${num2}?`;

        form.addEventListener('submit', function(event) {
            event.preventDefault();

            const nome = document.getElementById('nome').value;
            const email = document.getElementById('email').value;
            const telefone = document.getElementById('telefone').value;
            const userAnswer = parseInt(document.getElementById('captcha').value, 10);

            if (userAnswer !== correctAnswer) {
                formMessage.textContent = 'A resposta da soma está incorreta. Tente novamente.';
                formMessage.style.color = 'red';
                return;
            }

            formMessage.textContent = 'Enviando, por favor aguarde...';
            formMessage.style.color = 'inherit';

            const hubspotData = {
                fields: [
                    { name: 'firstname', value: nome },
                    { name: 'email', value: email },
                    { name: 'phone', value: telefone },
                    { name: 'polo', value: 'Ponta Grossa' } 
                ],
                context: {
                    pageUri: window.location.href,
                    pageName: document.title
                }
            };

            const portalId = '50364600';
            const formGuid = '11c0e10e-f481-45fd-ac77-472f986ac3bb';
            const url = `https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formGuid}`;

            fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(hubspotData)
            })
            .then(response => {
                if (response.ok) {
                    formMessage.textContent = 'Cadastro enviado com sucesso! Obrigado.';
                    formMessage.style.color = 'green';
                    form.reset();
                    
                    num1 = Math.floor(Math.random() * 10) + 1;
                    num2 = Math.floor(Math.random() * 10) + 1;
                    correctAnswer = num1 + num2;
                    captchaLabel.textContent = `Quanto é ${num1} + ${num2}?`;

                } else {
                    response.json().then(data => {
                        const errorMessage = data.errors && data.errors[0] ? data.errors[0].message : 'Por favor, verifique os dados.';
                        formMessage.textContent = `Ocorreu um erro: ${errorMessage}`;
                        formMessage.style.color = 'red';
                    });
                }
            })
            .catch(error => {
                console.error('Erro de Conexão:', error);
                formMessage.textContent = 'Ocorreu um erro de conexão. Verifique sua internet e tente novamente.';
                formMessage.style.color = 'red';
            });
        });
    }

    const accordionBtns = document.querySelectorAll('.accordion-button');
    if (accordionBtns.length > 0) {
        accordionBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const content = document.querySelector(this.dataset.target);
                const isActive = this.classList.contains('active');
    
                accordionBtns.forEach(otherBtn => {
                    const otherContent = document.querySelector(otherBtn.dataset.target);
                    if (otherBtn !== this) {
                        otherBtn.classList.remove('active');
                        otherContent.style.maxHeight = null;
                    }
                });
    
                if (isActive) {
                    this.classList.remove('active');
                    content.style.maxHeight = null;
                } else {
                    this.classList.add('active');
                    content.style.maxHeight = content.scrollHeight + "px";
                }
            });
        });
    }
});
