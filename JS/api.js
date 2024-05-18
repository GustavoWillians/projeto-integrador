document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('cep').addEventListener('blur', function() {
        const cep = this.value.replace(/\D/g, '');
        if (cep) {
            fetch(`https://viacep.com.br/ws/${cep}/json/`)
                .then(response => response.json())
                .then(data => {
                    if (!data.erro) {
                        document.getElementById('address').value = `${data.logradouro}, ${data.bairro}, ${data.localidade} - ${data.uf}`;
                    }
                })
                .catch(error => console.error('Erro ao buscar CEP:', error));
        }
    });

    document.getElementById('searchButton').addEventListener('click', function() {
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();

        const posts = document.getElementsByClassName('post');
        for (let post of posts) {
            const postText = post.innerText.toLowerCase();
            if (postText.includes(searchTerm)) {
                post.style.display = 'block'; // Mostrar postagem se contiver o termo de pesquisa
            } else {
                post.style.display = 'none'; // Ocultar postagem se não contiver o termo de pesquisa
            }
        }
    });

    document.getElementById('postForm').addEventListener('submit', function(e) {
        e.preventDefault();
        console.log('Formulário enviado'); // Verificação

        const userName = document.getElementById('userName').value;
        const postContent = document.getElementById('postContent').value;
        const postImage = document.getElementById('postImage').files[0];
        const userAddress = document.getElementById('address').value;
        const houseNumber = document.getElementById('houseNumber').value;

        if (userName.trim() !== "" && postContent.trim() !== "" && userAddress.trim() !== "" && houseNumber.trim() !== "") {
            const postFeed = document.getElementById('postFeed');

            const newPost = document.createElement('div');
            newPost.classList.add('post');

            const postAuthor = document.createElement('p');
            postAuthor.classList.add('post-author');
            postAuthor.textContent = `Nome: ${userName}`;
            newPost.appendChild(postAuthor);

            const postAddress = document.createElement('p');
            postAddress.classList.add('post-address');
            postAddress.textContent = `Endereço: ${userAddress}, Nº: ${houseNumber}`;
            newPost.appendChild(postAddress);

            const postText = document.createElement('p');
            postText.textContent = postContent;
            newPost.appendChild(postText);

            if (postImage) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    newPost.appendChild(img);

                    // Adiciona a sessão de comentários
                    addCommentsSection(newPost);
                };
                reader.readAsDataURL(postImage);
            } else {
                // Adiciona a sessão de comentários
                addCommentsSection(newPost);
            }

            postFeed.prepend(newPost);
            document.getElementById('userName').value = '';
            document.getElementById('postContent').value = '';
            document.getElementById('postImage').value = '';
            document.getElementById('cep').value = '';
            document.getElementById('address').value = '';
            document.getElementById('houseNumber').value = '';
        } else {
            console.error('Por favor, preencha todos os campos.');
        }
    });

    // Função para adicionar um comentário
    document.addEventListener('submit', function(e) {
        e.preventDefault();
        if (e.target.classList.contains('comment-form')) {
            const commentInput = e.target.querySelector('.comment-input');
            const commentTextarea = e.target.querySelector('.comment-textarea');

            if (commentInput.value.trim() !== "" && commentTextarea.value.trim() !== "") {
                const commentsList = e.target.parentElement.querySelector('.comments-list');

                const newComment = document.createElement('li');
                newComment.textContent = `${commentInput.value}: ${commentTextarea.value}`;

                commentsList.appendChild(newComment);

                commentInput.value = '';
                commentTextarea.value = '';
            }
        }
    });

    function addCommentsSection(postElement) {
        const commentsSection = document.createElement('section');
        commentsSection.classList.add('comments-section');

        const commentsTitle = document.createElement('h3');
        commentsTitle.textContent = 'Comentários';
        commentsSection.appendChild(commentsTitle);

        const commentsList = document.createElement('ul');
        commentsList.classList.add('comments-list');
        commentsSection.appendChild(commentsList);

        const newCommentForm = document.createElement('form');
        newCommentForm.classList.add('comment-form');
        newCommentForm.innerHTML = `
            <input type="text" class="comment-input" placeholder="Seu nome" required>
            <textarea class="comment-textarea" placeholder="Seu comentário" required></textarea>
            <button type="submit">Comentar</button>
        `;
        commentsSection.appendChild(newCommentForm);

        postElement.appendChild(commentsSection);
    }
});

// Desenvolvido por Gustavo Willians, Diogo Fonseca, Gabriel Gomes, Felipe Fontenele, Leonardo Vinicius e Henrique Mota.*/
