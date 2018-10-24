import marked from "marked"

import { compose, defaultTo, get, preventDefault, thrush } from "../util/fp"
import { ArticleEditPage, getUrl } from "../util/router"
import { defaultImage } from "../util/view"

const isAuthor = (username, article) => article.author.username === username

const authorMeta = article => [
  ["a.btn.btn-outline-secondary.btn-sm",
    { href: getUrl(ArticleEditPage, { slug: article.slug }) },
    ["i.ion-edit"],
    " Edit Article"
  ],
  ["button.btn.btn-outline-danger.btn-sm",
    ["i.ion-trash-a"],
    " Delete Article"
  ]
]

const nonAuthorMeta = article => [
  ["button.btn.btn-sm.btn-outline-secondary",
    ["i.ion-plus-round"],
    ` Follow ${article.author.username} `
  ],
  ["button.btn.btn-sm.btn-outline-primary",
    ["i.ion-heart"],
    " Favorite Post ",
    ["span.counter", `(${article.favoritesCount})`]
  ]
]

const articleMeta = (article, username) =>
  [".article-meta",
    ["a", /*profileLink(article.author.username),*/ /*["img", { src: article.author.image }]*/],
    [".info",
      ["a.author", /*profileLink(article.author.username),*/ article.author.username],
      ["span.date", new Date(article.createdAt).toDateString()]
    ],
    thrush(article, isAuthor(username, article) ? authorMeta : nonAuthorMeta)
  ]

export const view = ({ actions }) => model => {
  const article = model.article
  const username = get(model, ["user", "username"])

  return !article ? ["img", { src: "/assets/loading.gif" }] : [".article-page",
    [".banner",
      [".container",
        ["h1", article.title],
        articleMeta(article, username)
      ]
    ],
    [".container page",
      [".row.article-content",
        [".col-md-12",
          ["h2", article.description],
          [".tag-list",
            article.tagList.map(tag => ["span.tag-pill.tag-default", tag])
          ],
          ["p", { innerHTML: marked(article.body, { sanitize: true }) }]
        ]
      ],
      ["hr"],
      [".article-actions",
        articleMeta(article, username)
      ],
      [".row",
        [".col-xs-12.col-md-8.offset-md-2",
          ["form.card.comment-form",
            [".card-block",
              ["textarea.form-control", { placeholder: "Write a comment...", rows: "3",
                onInput: evt => actions.updateCommentField(evt.target.value),
                value: model.comment }]
            ],
            [".card-footer",
              ["img.comment-author-img", { src: model.user.image || defaultImage }],
              ["button.btn.btn-sm.btn-primary",
                { onClick: compose(() => actions.addComment(article.slug, model.comment), preventDefault) },
                "Post Comment"]
            ]
          ],
          defaultTo([], model.comments).map(comment =>
            [".card",
              [".card-block",
                ["p.card-text", comment.body]
              ],
              [".card-footer",
                ["a.comment-author[href=#]",
                  ["img.comment-author-img", { src: comment.author.image || defaultImage }]
                ],
                " ",
                ["a.comment-author[href=#]", comment.author.username],
                ["span.date-posted", new Date(comment.createdAt).toDateString()],
                ["span.mod-options",
                  ["i.ion-edit"],
                  ["i.ion-trash-a", { onClick: actions.deleteComment(article.slug, comment.id) } ]
                ]
              ]
            ]
          )
        ]
      ]
    ]
  ]
}
