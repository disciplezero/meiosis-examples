export const createBeerList = actions => ({
  view: model => (
    <div>
      <p>Beer List</p>
      <ul>
        {model.beerList.map(beer =>
          <li key={beer.id}>
            <a href={"#/beerList/" + beer.id}>{beer.title}</a>
            {" "}
            <button className="btn btn-default btn-xs"
              onClick={actions.beerDetails(beer.id)}>
              {beer.title}
            </button>
          </li>
        )}
      </ul>
    </div>
  )
});
