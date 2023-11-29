import { bool, shape, string } from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

const AuthorLink = ({ author, isWordAuthor = false }) => {
    if (!author) {
        return null;
    }
    const message = isWordAuthor ? 'Words -' : 'Photography -';

    return (
        <Link to={'author/' + author.url_key} title={author.name}>
            <span>
                <FormattedMessage
                    id={isWordAuthor ? 'blog.words.author' : 'blog.photography.author'}
                    defaultMessage="{message} {name}"
                    values={{ message, name: author.name }}
                />
            </span>
        </Link>
    );
};
AuthorLink.propTypes = {
    author: shape({
        name: string,
        url_key: string
    }),
    isWordAuthor: bool
};

export default AuthorLink;
