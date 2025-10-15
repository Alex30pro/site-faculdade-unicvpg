document.addEventListener('DOMContentLoaded', function() {
    
    const form = document.getElementById('lead-form');
        if (form) {
            const captchaLabel = document.getElementById('captcha-label');
            const formMessage = document.getElementById('form-message');

            const num1 = Math.floor(Math.random() * 10) + 1;
            const num2 = Math.floor(Math.random() * 10) + 1;
            
            let correctAnswer = num1 + num2; 

            captchaLabel.textContent = `Quanto é ${num1} + ${num2}?`;

            form.addEventListener('submit', async function(event) {
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
        const submitButton = form.querySelector('button[type="submit"]');
        if (submitButton) submitButton.disabled = true;

        const crmData = { 
            nome, 
            email, 
            telefone,
            captcha: { num1, num2, answer: userAnswer }
        };

        const crmUrl = 'http://localhost:3000/api/public/lead'; 
        const crmApiKey = 'CHAVE_SECRETA_PARA_PONTA_GROSSA'; 

        try {
            
            const response = await fetch(crmUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-API-KEY': crmApiKey
                },
                body: JSON.stringify(crmData)
            });

            if (!response.ok) {

                const errorData = await response.json();
                throw new Error(errorData.message || 'Ocorreu um erro ao enviar seu cadastro.');
            }

            formMessage.textContent = 'Cadastro enviado com sucesso! Obrigado.';
            formMessage.style.color = 'green';
            form.reset();
            
            const newNum1 = Math.floor(Math.random() * 10) + 1;
            const newNum2 = Math.floor(Math.random() * 10) + 1;
            correctAnswer = newNum1 + newNum2; 
            captchaLabel.textContent = `Quanto é ${newNum1} + ${newNum2}?`;

        } catch (error) {
           
            console.error('Erro ao enviar para o CRM:', error); 
            formMessage.textContent = error.message || 'Ocorreu um erro de conexão. Tente novamente.';
            formMessage.style.color = 'red';
        } finally {

            if (submitButton) submitButton.disabled = false;
        }
    });
}

    
    const accordionBtns = document.querySelectorAll('.accordion-button');
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
});
