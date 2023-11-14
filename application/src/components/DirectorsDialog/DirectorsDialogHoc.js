import { compose } from 'recompose';
import { graphql } from "react-apollo";

import { deleteDirectorMutation } from "./mutations";
import { directorsQuery } from "../DirectorsTable/queries";

const withGraphqlDelete = graphql(deleteDirectorMutation, {
    props: ({ mutate }) => ({
        deleteDirector: movie => mutate({
            variables: movie,
            refetchQueries: [{ query: directorsQuery }],
        })
    })
});

export default compose(withGraphqlDelete);
