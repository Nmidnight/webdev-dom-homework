'use strict'
import { addComment } from './eventListener.js'
import { fetchCommentsToServer } from './comments.js'

fetchCommentsToServer()

addComment()
