import { commentsArr } from './comments.js'
import { nl2br } from './escapeHtml.js'

export function renderComments() {
    const commentsList = document.querySelector('.comments')
    commentsList.innerHTML = ''
    commentsArr.forEach((comment) => {
        const commentElement = document.createElement('li')
        commentElement.classList.add('comment')
        commentElement.innerHTML = `
        <div class="comment-header">
          <div>${comment.author.name}</div>
            <div>${new Date(comment.date).toLocaleString('ru-RU', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            })}</div>
        </div>
        <div class="comment-body">
          <div class="comment-text">${nl2br(comment.text)}</div>
        </div>
        <div class="comment-footer">
          <div class="likes">
              <span class="likes-counter">${comment.likes}</span>
              <button type="button" class="like-button ${comment.isLiked ? '-active-like' : ''}" data-id="${comment.id}" aria-label="Лайк"></button>
       </div>
        </div>
        `

        // Добавляем обработчик лайка для конкретной кнопки
        const likeButton = commentElement.querySelector('.like-button')
        likeButton.addEventListener('click', async function () {
            likeButton.classList.add('loading')

            // Имитация задержки
            await new Promise((resolve) => setTimeout(resolve, 2000))

            const id = Number(likeButton.dataset.id)
            const commentObj = commentsArr.find((c) => c.id === id)

            if (commentObj) {
                if (!commentObj.isLiked) {
                    commentObj.likes++
                } else {
                    commentObj.likes--
                }
                commentObj.isLiked = !commentObj.isLiked
            }

            likeButton.classList.remove('loading')
            renderComments()
        })

        // Добавляем обработчик цитаты для конкретного текста комментария
        const commentText = commentElement.querySelector('.comment-text')
        commentText.addEventListener('click', function () {
            const userComment = document.querySelector('.add-form-text')
            const author = commentElement.querySelector(
                '.comment-header > div',
            ).textContent
            const text = commentText.textContent
            userComment.value = `"${text}"\n\nКомментарий от: ${author}\n\n`
        })

        commentsList.appendChild(commentElement)
    })
}
