async function carregarDadosUsuario() {
    const authToken = localStorage.getItem('token');
    const parametrosUrl = new URLSearchParams(window.location.search);
    const userId = parametrosUrl.get('userId');

    console.log('Token armazenado:', authToken);
    console.log('ID do Usuário:', userId);

    try {
        if (authToken && userId) {
            const resposta = await fetch(`http://localhost:8000/api/user/visualizar/${userId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json',
                },
            });

            if (resposta.ok) {
                const dadosUsuario = await resposta.json();
                document.getElementById('userName').value = dadosUsuario.user.name;
                document.getElementById('userEmail').value = dadosUsuario.user.email;
            } else {
                const erroResposta = await resposta.json();
                throw new Error(erroResposta.message || 'Falha ao obter detalhes do usuário');
            }
        } else {
            window.location.href = 'login.html'; // Redireciona se não houver token ou ID
        }
    } catch (erro) {
        console.error('Erro:', erro);
        mostrarMensagemErro('Não foi possível carregar os dados do usuário.');
    }
}

function mostrarMensagemErro(mensagem) {
    const alertaErro = document.getElementById('erroMensagem');
    alertaErro.textContent = mensagem;
    alertaErro.classList.remove('d-none');
}

async function atualizarUsuario(evento) {
    evento.preventDefault();

    const authToken = localStorage.getItem('token');
    const parametrosUrl = new URLSearchParams(window.location.search);
    const userId = parametrosUrl.get('userId');
    
    const user = {
        name: document.getElementById('userName').value,
        email: document.getElementById('userEmail').value,
        password: document.getElementById('userPassword').value,
        password_confirmation: document.getElementById('userPasswordConfirm').value
    };


    try {
        if (authToken && userId) {
            const resposta = await fetch(`http://localhost:8000/api/user/atualizar/${userId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user)
            });

            if (resposta.ok) {
                window.location.href = 'visualizar.html'; // Redireciona após sucesso
            } else {
                const erroResposta = await resposta.json();
                throw new Error(erroResposta.message || 'Erro durante a atualização dos dados.');
            }
        } else {
            window.location.href = 'login.html'; // Redireciona se faltar token ou ID
        }
    } catch (erro) {
        console.error('Erro durante a atualização dos dados:', erro);
        mostrarMensagemErro('Erro durante a atualização dos dados.');
    }
}

// Inicializa a página e define os eventos
document.addEventListener('DOMContentLoaded', carregarDadosUsuario);
document.getElementById('usuarioForm').addEventListener('submit', atualizarUsuario);
document.getElementById('botaoVoltar').addEventListener('click', function() {
    window.history.back();
});
