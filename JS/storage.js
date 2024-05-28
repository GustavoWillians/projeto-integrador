// Função para salvar os dados no localStorage
function savePostToStorage(userName, postContent, userAddress, houseNumber, imageFile = null) {
    // Obter as postagens já existentes ou inicializar uma array vazia se não houver
    const existingPosts = JSON.parse(localStorage.getItem('posts')) || [];

    // Criar um novo objeto de postagem
    const newPost = {
        userName: userName,
        postContent: postContent,
        userAddress: userAddress,
        houseNumber: houseNumber,
        imageUrl: null, // Inicializar a URL da imagem como null por padrão
        comments: [] // Inicializar os comentários como uma array vazia
    };

    // Se uma imagem foi fornecida, salvar a imagem e sua URL
    if (imageFile) {
        // Gerar uma URL temporária para a imagem usando o objeto URL.createObjectURL
        const imageUrl = URL.createObjectURL(imageFile);

        // Atualizar a URL da imagem no objeto de postagem
        newPost.imageUrl = imageUrl;

        // Salvar a imagem no localStorage usando a URL temporária
        localStorage.setItem(`image_${userName}_${Date.now()}`, imageUrl);
    }

    // Adicionar a nova postagem à array de postagens
    existingPosts.unshift(newPost);

    // Salvar a array atualizada no localStorage
    localStorage.setItem('posts', JSON.stringify(existingPosts));
}

// Função para carregar as postagens salvas do localStorage e exibi-las na página
function loadPostsFromStorage() {
    const postFeed = document.getElementById('postFeed');
    const existingPosts = JSON.parse(localStorage.getItem('posts')) || [];

    // Limpar o feed de postagens antes de adicionar as novas postagens
    postFeed.innerHTML = '';

    // Iterar sobre as postagens e adicionar cada uma ao feed
    existingPosts.forEach(post => {
        const newPost = document.createElement('div');
        newPost.classList.add('post');

        const postAuthor = document.createElement('p');
        postAuthor.classList.add('post-author');
        postAuthor.textContent = `Nome: ${post.userName}`;
        newPost.appendChild(postAuthor);

        const postAddress = document.createElement('p');
        postAddress.classList.add('post-address');
        postAddress.textContent = `Endereço: ${post.userAddress}, Nº: ${post.houseNumber}`;
        newPost.appendChild(postAddress);

        const postText = document.createElement('p');
        postText.textContent = post.postContent;
        newPost.appendChild(postText);

        if (post.imageUrl) {
            const img = document.createElement('img');
            img.src = post.imageUrl;
            newPost.appendChild(img);
        }

        // Adiciona a sessão de comentários
        addCommentsSection(newPost, post.comments);

        // Adiciona a postagem ao feed
        postFeed.appendChild(newPost);
    });
}

// Função para adicionar uma seção de comentários a uma postagem
function addCommentsSection(postElement, comments) {
    const commentsSection = document.createElement('section');
    commentsSection.classList.add('comments-section');

    const commentsTitle = document.createElement('h3');
    commentsTitle.textContent = 'Comentários';
    commentsSection.appendChild(commentsTitle);

    const commentsList = document.createElement('ul');
    commentsList.classList.add('comments-list');
    commentsSection.appendChild(commentsList);

    // Adiciona os comentários à lista de comentários
    comments.forEach(comment => {
        const commentItem = document.createElement('li');
        commentItem.textContent = comment;
        commentsList.appendChild(commentItem);
    });

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

// Função para salvar comentários no localStorage
function saveCommentsToStorage(postIndex, comments) {
    const existingPosts = JSON.parse(localStorage.getItem('posts')) || [];
    existingPosts[postIndex].comments = comments;
    localStorage.setItem('posts', JSON.stringify(existingPosts));
}

// Evento de envio do formulário de comentário
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

            // Obter o índice da postagem no feed
            const postIndex = Array.from(e.target.closest('.post').parentElement.children).indexOf(e.target.closest('.post'));

            // Obter os comentários existentes ou inicializar uma array vazia se não houver
            const existingComments = JSON.parse(localStorage.getItem('posts'))[postIndex].comments || [];
            existingComments.push(newComment.textContent);

            // Salvar os comentários atualizados no localStorage
            saveCommentsToStorage(postIndex, existingComments);

            commentInput.value = '';
            commentTextarea.value = '';
        }
    }
});

// Modifique a função de envio do formulário para salvar os dados no localStorage
document.getElementById('postForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const userName = document.getElementById('userName').value;
    const postContent = document.getElementById('postContent').value;
    const postImageInput = document.getElementById('postImage'); // Armazenar referência ao elemento
    const postImage = postImageInput ? postImageInput.files[0] : null; // Verificar se o elemento foi encontrado e acessar o arquivo
    const userAddress = document.getElementById('address').value;
    const houseNumber = document.getElementById('houseNumber').value;

    if (userName.trim() !== "" && postContent.trim() !== "" && userAddress.trim() !== "" && houseNumber.trim() !== "") {
        savePostToStorage(userName, postContent, userAddress, houseNumber, postImage);

        // Chamar a função para carregar as postagens novamente para atualizar o feed
        loadPostsFromStorage();

        // Limpar os campos do formulário após o envio
        document.getElementById('userName').value = '';
        document.getElementById('postContent').value = '';
        if(postImageInput) postImageInput.value = ''; // Limpar o campo de imagem apenas se o elemento existir
        document.getElementById('cep').value = '';
        document.getElementById('address').value = '';
        document.getElementById('houseNumber').value = '';
    } else {
        console.error('Por favor, preencha todos os campos.');
    }
});

// Chamar a função para carregar as postagens ao carregar a página
document.addEventListener('DOMContentLoaded', loadPostsFromStorage);
