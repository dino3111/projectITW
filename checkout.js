// Selecionar o formulário
const form = document.querySelector('#checkoutForm');

// Adicionar evento de submissão ao formulário
form.addEventListener('submit', function (event) {
    console.log('Formulário submetido');
    // Impedir o envio padrão do formulário
    event.preventDefault();

    // Limpar mensagens de erro anteriores
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(message => message.remove());

    // Verificar os campos
    let isValid = true;

    const inputs = [
        { selector: 'input[placeholder="Introduza o seu nome completo"]', message: 'Por favor, insira seu nome completo.' },
        { selector: 'input[placeholder="exemplo@exemplo.com"]', message: 'Por favor, insira um email válido.', validate: validateEmail },
        { selector: 'input[placeholder="Rua - Prédio - Número"]', message: 'Por favor, insira seu endereço.' },
        { selector: 'input[placeholder="Tondela"]', message: 'Por favor, insira sua cidade.' },
        { selector: 'input[placeholder="Viseu"]', message: 'Por favor, insira seu distrito.' },
        { selector: 'input[placeholder="1234-123"]', message: 'Por favor, insira um código postal válido.', validate: validatePostalCode },
        { selector: 'input[placeholder="Claudino José Martins"]', message: 'Por favor, insira a informação correta.' },
        { selector: 'input[placeholder="1111-2222-3333-4444"]', message: 'Por favor, insira um número de cartão válido.', validate: validateCardNumber },
        { selector: 'input[placeholder="MM/AA"]', message: 'Por favor, insira uma validade válida.', validate: validateExpirationDate },
        { selector: 'input[placeholder="123"]', message: 'Por favor, insira o CVV.', validate: validateCVV },
    ];
    

    inputs.forEach(input => {
        const element = document.querySelector(input.selector);
        if (!element || element.value.trim() === '' || (input.validate && !input.validate(element.value.trim()))) {
            isValid = false;
            showError(element, input.message);
        }
    });

    // Se tudo estiver válido, permitir o envio
    if (isValid) {
        alert('Formulário enviado com sucesso!');
        form.submit();
    }
});

// Função para mostrar mensagens de erro
function showError(input, message) {
    const error = document.createElement('span');
    error.classList.add('error-message');
    error.style.color = 'red';
    error.textContent = message;
    input.parentElement.appendChild(error);
}

// Funções de validação específicas
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePostalCode(postalCode) {
    const postalCodeRegex = /^\d{4}-\d{3}$/;
    return postalCodeRegex.test(postalCode);
}

function validateCardNumber(cardNumber) {
    const cardRegex = /^\d{4}-\d{4}-\d{4}-\d{4}$/;
    return cardRegex.test(cardNumber);
}

function validateYear(year) {
    const currentYear = new Date().getFullYear();
    return year >= currentYear;
}

function validateCVV(cvv) {
    const cvvRegex = /^\d{3,4}$/;
    return cvvRegex.test(cvv);
}

function validateExpirationDate(expiration) {
    // Verifica se está no formato MM/AA usando regex
    const expirationRegex = /^(0[1-9]|1[0-2])\/\d{2}$/; // MM deve ser entre 01 e 12, AA são dois dígitos
    if (!expirationRegex.test(expiration)) {
        return false;
    }

    // Divide a data em mês (MM) e ano (AA)
    const [month, year] = expiration.split('/').map(Number);
    console.log(month, year);

    // Obter o mês e o ano atuais
    const currentYear = new Date().getFullYear() % 100; // Últimos 2 dígitos do ano atual
    const currentMonth = new Date().getMonth() + 1;    // Mês atual (1-12)
    console.log(currentMonth, currentYear);

    // Verificar validade
    if (year > currentYear || (year === currentYear && month >= currentMonth)) {
        return true; // Data de expiração válida
    }

    return false; // Data inválida
}
