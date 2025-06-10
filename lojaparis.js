function limpar() {
    for (let i = 1; i <= 8; i++) {
        const produtoElement = document.getElementById("produto" + i);
        if (produtoElement) {
            produtoElement.value = 0;
        }
    }
    const carrinhoForm = document.getElementById('carrinhoForm');
    if (carrinhoForm) {
        carrinhoForm.reset();
    }
    document.getElementById("produtos").innerText = "0";
    document.getElementById("quantidades").innerText = "0";
    document.getElementById("total").innerText = "0.00";
    const mediaElement = document.getElementById("media");
    if (mediaElement) {
        mediaElement.innerText = "0.00";
    }
    console.log("CALL: limpar()");
}

function validar() {
    let produtosDiferentes = 0;
    for (let i = 1; i <= 8; i++) {
        if (parseInt(document.getElementById("produto" + i).value) > 0) {
            produtosDiferentes++;
        }
    }
}

function comprar(number) {
    let quantidade = parseInt(document.getElementById("produto" + number).value);
    quantidade += 1;
    document.getElementById("produto" + number).value = quantidade;

    calcular();
    console.log("CALL: comprar()");
}

function calcular() {
    let totalProdutos = 0;
    let totalQuantidade = 0;
    let valorTotal = 0.0;

    for (let i = 1; i <= 8; i++) {
        let quantidade = parseInt(document.getElementById("produto" + i).value);
        if (quantidade > 0) {
            totalProdutos++;
            totalQuantidade += quantidade;
            let preco = parseFloat(document.getElementById("precoproduto" + i).value);
            valorTotal += quantidade * preco;
        }
    }

    document.getElementById("produtos").innerText = totalProdutos;
    document.getElementById("quantidades").innerText = totalQuantidade;
    document.getElementById("total").innerText = valorTotal.toFixed(2);

    let media = totalQuantidade > 0 ? valorTotal / totalQuantidade : 0;
    //document.getElementById("media").innerText = media.toFixed(2);

    console.log("CALL: calcular()");
}

(() => {
    'use strict'

    const getStoredTheme = () => localStorage.getItem('theme')
    const setStoredTheme = theme => localStorage.setItem('theme', theme)

    const getPreferredTheme = () => {
        const storedTheme = getStoredTheme()
        if (storedTheme) {
            return storedTheme
        }

        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }

    const setTheme = theme => {
        if (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.documentElement.setAttribute('data-bs-theme', 'dark')
        } else {
            document.documentElement.setAttribute('data-bs-theme', theme)
        }
    }

    setTheme(getPreferredTheme())

    const showActiveTheme = (theme, focus = false) => {
        const themeSwitcher = document.querySelector('#bd-theme')

        if (!themeSwitcher) {
            return
        }

        const themeSwitcherText = document.querySelector('#bd-theme-text')
        const activeThemeIcon = document.querySelector('.theme-icon-active')
        const btnToActive = document.querySelector(`[data-bs-theme-value="${theme}"]`)

        document.querySelectorAll('[data-bs-theme-value]').forEach(element => {
            element.classList.add('opacity-50');
            element.setAttribute('aria-pressed', 'false');
        })

        //btnToActive.classList.add('active');
        btnToActive.setAttribute('aria-pressed', 'true');
        btnToActive.classList.remove('opacity-50')

        if (focus) {
            themeSwitcher.focus()
        }
    }

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        const storedTheme = getStoredTheme()
        if (storedTheme !== 'light' && storedTheme !== 'dark') {
            setTheme(getPreferredTheme())
        }
    })

    window.addEventListener('DOMContentLoaded', () => {
        showActiveTheme(getPreferredTheme())

        document.querySelectorAll('[data-bs-theme-value]')
            .forEach(toggle => {
                toggle.addEventListener('click', () => {
                    const theme = toggle.getAttribute('data-bs-theme-value')
                    setStoredTheme(theme)
                    setTheme(theme)
                    showActiveTheme(theme, true)
                })
            })
    })
})()

function irParaCheckout() {
    const total = parseFloat(document.getElementById('total').textContent);
    if (total === 0.00) {
        alert('O valor da compra não pode ser nulo. Por favor, adicione itens ao carrinho.');
        return false;
    } else {
        window.location.href = 'checkout.html';
    }
}
