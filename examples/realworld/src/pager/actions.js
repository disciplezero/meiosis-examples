//import { articlesApi } from "../services";

export const actions = ({ _update }) => ({
  page: ({ _model, _pageNumber }) => null /* {
    const articlesFilter = _.set(filter, "offset", (pageNumber - 1) * filter.limit)
    articlesApi.getList(articlesFilter).then(
      articles => update(model => _.merge(model, articles, { articlesFilter }))
    )
  }*/
})
