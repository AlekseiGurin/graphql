import { compose } from 'recompose';
import { graphql } from "react-apollo";

import { deleteMovieMutation } from "./mutations";
import { moviesQuery } from "../MoviesTable/queries";

const withGraphqlDelete = graphql(deleteMovieMutation, {
    props: ({ mutate }) => ({
        deleteMovie: movie => mutate({
            variables: movie,
            refetchQueries: [{ query: moviesQuery }],
        })
    })
});

export default compose(withGraphqlDelete);
