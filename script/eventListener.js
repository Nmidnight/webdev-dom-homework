import { escapeHtml } from './escapeHtml.js'
import { commentsArr } from './comments.js'
import { renderComments } from './renderFn.js'

export function addComment() {
    const addFormButton = document.querySelector('.add-form-button')
    const userName = document.querySelector('.add-form-name')
    const userComment = document.querySelector('.add-form-text')

    addFormButton.addEventListener('click', () => {
        if (userName.value.trim() === '' || userComment.value.trim() === '') {
            alert('Заполните все поля')
            return
        }

        fetch(
            'https://wedev-api.sky.pro/api/v1/anastasiya-veremyova/comments',
            {
                method: 'POST',
                body: JSON.stringify({
                    text: escapeHtml(userComment.value),
                    name: escapeHtml(userName.value),
                }),
            },
        )
            .then((response) => {
                if (!response.ok) {
                    return response.json().then((error) => {
                        throw new Error(error.error)
                    })
                }
                return response.json()
            })
            .then(() => {
                return fetch(
                    'https://wedev-api.sky.pro/api/v1/anastasiya-veremyova/comments',
                )
            })
            .then((response) => response.json())
            .then((data) => {
                commentsArr.length = 0
                commentsArr.push(...data.comments)
                renderComments()
                userName.value = ''
                userComment.value = ''
            })
            .catch((error) => {
                alert('Ошибка: ' + error.message)
            })
    })
}

export function likeComment() {
    const commentsList = document.querySelector('.comments')
    commentsList.addEventListener('click', function (event) {
        if (event.target.classList.contains('like-button')) {
            const id = Number(event.target.dataset.id)
            const comment = commentsArr.find((comment) => comment.id === id)

            if (comment.isLiked === false) {
                comment.likes++
            } else {
                comment.likes--
            }

            comment.isLiked = !comment.isLiked

            renderComments()
        }
    })
}

export function quoteComment() {
    const commentsList = document.querySelector('.comments')
    const userComment = document.querySelector('.add-form-text')

    commentsList.addEventListener('click', function (event) {
        if (event.target.classList.contains('comment-text')) {
            const commentEl = event.target.closest('.comment')
            const author = commentEl.querySelector(
                '.comment-header > div',
            ).textContent
            const commentText = event.target.textContent
            userComment.value = `"${commentText}"\n\nКомментарий от: ${author}\n\n`
        }
        event.stopPropagation()
    })
}
