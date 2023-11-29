import { useRef } from 'react';

import { useAmBlogProContext } from '@app/components/Blog/context';
import { usePost } from '@app/talons/usePost';

export const useArticleRichSnippet = () => {
    const commentsRef = useRef(null);
    const { getAuthorById } = useAmBlogProContext();
    const { post } = usePost({ commentsRef });

    if (!post) {
        return {};
    }

    const {
        post_thumbnail: postThumbnail,
        updated_at: updatedDate,
        published_at: publishedDate,
        title,
        author_id: authorId
    } = post;

    const writerAurthor = getAuthorById(authorId);
    const articleStructuredData =
        post && !!writerAurthor.external_url
            ? {
                  '@context': 'https://schema.org',
                  '@type': 'NewsArticle',
                  headline: title,
                  image: [postThumbnail],
                  datePublished: publishedDate,
                  dateModified: updatedDate,
                  author: [
                      {
                          '@type': 'Person',
                          name: writerAurthor.name,
                          url: writerAurthor.external_url
                      }
                  ]
              }
            : post
            ? {
                  '@context': 'https://schema.org',
                  '@type': 'NewsArticle',
                  headline: title,
                  image: [postThumbnail],
                  datePublished: publishedDate,
                  dateModified: updatedDate
              }
            : {};

    return {
        articleStructuredData
    };
};
