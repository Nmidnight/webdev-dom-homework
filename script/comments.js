import { renderComments } from './renderFn.js'

export let commentsArr = []

fetch('https://wedev-api.sky.pro/api/v1/anastasiya-veremyova/comments', {
    method: 'GET',
})
    .then((response) => response.json())
    .then((data) => {
        commentsArr.push(...data.comments)
        renderComments()
    })
